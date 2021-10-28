import {
  Alert,
  EscalationPolicy,
  Level, PagerPersistenceItem,
  Source
} from './types';
import EscalationPolicyAdapter from "./adapters/EscalationPolicyAdapter";
import PagerPersistenceAdapter from "./adapters/PagerPersistenceAdapter";
import NotificationAdapter from "./adapters/NotificationAdapter";
import TimerAdapter from "./adapters/TimerAdapter";

const DEFAULT_TIMEOUT = 15;

module.exports.handler = async function(alert: Alert, source: Source): Promise<void> {
  if (source === Source.DYSFUNCTION) {
  } else if (source === Source.HEALTHY) {
  } else if (source === Source.ACKNOWLEDGE) {
  } else if (source === Source.ACK_TIMEOUT) {
  }
}