import { Level } from "./Level";

export type EscalationPolicy = {
  monitoredServiceId: string,
  levels: Level[]
}