import app from "../src/app";
import {
  Alert, EscalationPolicy, Level, LevelType, PagerPersistenceItem, Source
} from "../src/types";
import NotificationAdapter from "../src/adapters/NotificationAdapter";
import TimerAdapter from "../src/adapters/TimerAdapter";

jest.mock("../src/adapters/EscalationPolicyAdapter")
// import * as EscalationPolicyAdapter from "../src/adapters/EscalationPolicyAdapter";
const EscalationPolicyAdapter = require("../src/adapters/EscalationPolicyAdapter");

jest.mock("../src/adapters/PagerPersistenceAdapter")
// import * as PagerPersistenceAdapter from "../src/adapters/PagerPersistenceAdapter";
const PagerPersistenceAdapter = require("../src/adapters/PagerPersistenceAdapter");

jest.mock("../src/adapters/NotificationAdapter")

jest.mock("../src/adapters/TimerAdapter")

const getEscalationPolicyMock = jest.fn()
const setItemMock = jest.fn()
const getItemMock = jest.fn()
const sendNotificationMock = jest.fn()
const setTimeOutMock = jest.fn()
EscalationPolicyAdapter.getEscalationPolicy = getEscalationPolicyMock;
PagerPersistenceAdapter.setItem = setItemMock;
PagerPersistenceAdapter.getItem = getItemMock;
NotificationAdapter.sendNotification = sendNotificationMock;
TimerAdapter.setTimeOut = setTimeOutMock;

describe("Pager Service", () => {
  const level1: Level = [{
    type: LevelType.EMAIL,
    destination: "some.email@foo.bar"
  }]
  const level2: Level = [
    {
      type: LevelType.SMS,
      destination: "+34600123456"
    },
    {
      type: LevelType.EMAIL,
      destination: "other.email@foo.bar"
    },
  ]
  const escalationPolicy: EscalationPolicy = {
    monitoredServiceId: "1",
    levels: [
      level1,
      level2
    ]
  }

  beforeEach(() => {
    getEscalationPolicyMock.mockReturnValueOnce(
      new Promise(resolve => resolve(escalationPolicy))
    );
  });

  describe("Given a Monitored Service in a Healthy State", () => {
    const pagerPersistenceItem: PagerPersistenceItem = {
      lastLevelUserIndex: -1,
      isHealthy: true
    }

    beforeEach(() => {
      getItemMock.mockReturnValueOnce((
        new Promise(resolve => resolve(pagerPersistenceItem))
      ))
    });

    describe("When the Pager receives an Alert related to this Monitored" +
             " Service", () => {
      it("Monitored Service becomes Unhealthy, Pager notifies all targets of" +
         " the first level, sets a 15-minutes acknowledgement delay", async () => {
        const alert: Alert = {
          message: "Some error occurred",
          monitoredServiceId: "1"
        }
        await app(alert, Source.DYSFUNCTION);

        expect(sendNotificationMock).toHaveBeenCalledWith(level1);
        expect(setTimeOutMock).toHaveBeenCalledWith("1", 15);
        expect(setItemMock).toHaveBeenCalledWith("1", 0, false);
      });
    });
  });

  describe("Given a Monitored Service in an Unhealthy State", () => {
    const pagerPersistenceItem: PagerPersistenceItem = {
      lastLevelUserIndex: 0,
      isHealthy: false
    }

    beforeEach(() => {
      getItemMock.mockReturnValueOnce((
        new Promise(resolve => resolve(pagerPersistenceItem))
      ))
    });

    describe("When no acknowledgement alert has been received", () => {
      it("Pager notifies all targets of the next level, sets a 15-minutes acknowledgement delay", async () => {
        const alert: Alert = {
          message: "Timeout reached",
          monitoredServiceId: "1"
        }
        await app(alert, Source.ACK_TIMEOUT);
        expect(sendNotificationMock).toHaveBeenCalledWith(level2);
        expect(setTimeOutMock).toHaveBeenCalledWith("1", 15);
        expect(setItemMock).toHaveBeenCalledWith("1", 1, false);
      });
    });

    describe("When the Pager receives the Acknowledgement alert and" +
                  " later" +
             " receives the Acknowledgement Timeout", () => {
      it("Pager doesn't notify any Target and doesn't set an acknowledgement" +
         " delay", async () => {
        const ackAlert: Alert = {
          message: "Acknowledgement Alert",
          monitoredServiceId: "1"
        }
        await app(ackAlert, Source.ACKNOWLEDGE);
        const healthyAlert: Alert = {
          message: "Service is online",
          monitoredServiceId: "1"
        }
        await app(healthyAlert, Source.HEALTHY);
        expect(sendNotificationMock).not.toHaveBeenCalled();
        expect(setTimeOutMock).not.toHaveBeenCalled();
        expect(setItemMock).nthCalledWith(1, "1", -1, false);
        expect(setItemMock).nthCalledWith(2, "1", -1, true);
      });
    });

    describe("When the Pager receives an Alert related to this Monitored" +
             " Service", () => {
      it("Pager doesn't notify any Target, doesn't set an acknowledgement delay", async () => {
        const alert: Alert = {
          message: "Timeout reached",
          monitoredServiceId: "1"
        }
        await app(alert, Source.DYSFUNCTION);

        expect(sendNotificationMock).not.toHaveBeenCalled();
        expect(setTimeOutMock).not.toHaveBeenCalled();
        expect(setItemMock).not.toHaveBeenCalled();
      });
    });

    describe("When the Pager receives a Healthy event related to this" +
             " Monitored Service and later receives the Acknowledgement Timeout", () => {
      it("then the Monitored Service becomes Healthy,the Pager doesn't" +
         " notify any Target, doesn't set an acknowledgement delay", async () => {
        getItemMock.mockReturnValue({
          lastLevelUserIndex: -1,
          isHealthy: true
        })
        const healthyAlert: Alert = {
          message: "Service is online",
          monitoredServiceId: "1"
        }
        await app(healthyAlert, Source.HEALTHY);
        const ackAlert: Alert = {
          message: "Acknowledgement Alert",
          monitoredServiceId: "1"
        }
        await app(ackAlert, Source.ACKNOWLEDGE);
        expect(sendNotificationMock).not.toHaveBeenCalled();
        expect(setTimeOutMock).not.toHaveBeenCalled();
        expect(setItemMock).nthCalledWith(1, "1", -1, true);
        expect(setItemMock.mock.calls.length).toBe(1);
      });
    });
  });
});