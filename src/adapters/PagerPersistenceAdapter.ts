import { PagerPersistenceItem } from "../types";
import db from "./Database";

export function setItem(monitoredServiceId: string, lastLevelUserIndex: number, isHealthy: boolean): Promise<void> {
  return db().set(monitoredServiceId, { lastLevelUserIndex, isHealthy });
}

export function getItem(monitoredServiceId: string): Promise<PagerPersistenceItem> {
  return db().get(monitoredServiceId) as Promise<PagerPersistenceItem>;
}