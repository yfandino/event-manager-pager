import {
  Alert,
  EscalationPolicy,
  Level, PagerPersistenceItem,
  Source
} from './types';
import * as EPA from "./adapters/EscalationPolicyAdapter";
import * as PPA from "./adapters/PagerPersistenceAdapter";
import NotificationAdapter from "./adapters/NotificationAdapter";
import TimerAdapter from "./adapters/TimerAdapter";

const DEFAULT_TIMEOUT = 15;

const handler = async function(alert: Alert, source: Source): Promise<void> {
  const msId = alert.monitoredServiceId;
  const escalationPolicy: EscalationPolicy = await EPA.getEscalationPolicy(msId);
  const item: PagerPersistenceItem = await PPA.getItem(msId);

  if (source === Source.DYSFUNCTION) {
    if (!item.isHealthy) return;
    await processAlert(msId, 0)
  } else if (source === Source.HEALTHY) {
    await PPA.setItem(msId, -1,true);
  } else if (source === Source.ACKNOWLEDGE) {
    if (item.isHealthy) return;
    await PPA.setItem(msId, -1, false);
  } else if (source === Source.ACK_TIMEOUT) {
    if (item.isHealthy || item.lastLevelUserIndex < 0) {
      return;
    }
    await processAlert(msId, item.lastLevelUserIndex + 1);
  }

  async function processAlert(msId: string, levelIndex: number = 0): Promise<void> {
    const level: Level = escalationPolicy.levels[levelIndex];
    await NotificationAdapter.sendNotification(level);
    await TimerAdapter.setTimeOut(msId, DEFAULT_TIMEOUT);
    await PPA.setItem(msId, levelIndex, false);
  }
}

export default handler;
