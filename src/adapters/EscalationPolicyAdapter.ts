import { EscalationPolicy } from "../types";
import db from "./Database";

export function getEscalationPolicy(monitoredServiceId: string): Promise<EscalationPolicy> {
  return db().get(monitoredServiceId) as Promise<EscalationPolicy>;
}