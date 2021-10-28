import { Level, LevelType, Target } from "../types";

const NotificationAdapter = {
  sendEmail: (target: Target): Promise<void> => new Promise(resolve => resolve()),
  sendSMS: (target: Target): Promise<void> => new Promise(resolve => resolve()),
  sendNotification: function (level: Level) {
    level.map(target => {
      if (target.type === LevelType.EMAIL) {
        this.sendEmail(target);
      } else if (target.type === LevelType.SMS) {
        this.sendSMS(target)
      }
    });
  }
}

export default NotificationAdapter;