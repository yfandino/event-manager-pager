import { PagerPersistenceItem, Persistence } from "../types";


const PagerPersistenceAdapter = (persistence: Persistence = {}) => ({
  getItem(monitoredServiceId: string): Promise<PagerPersistenceItem> {
    return new Promise(resolve => {
      const item = persistence[monitoredServiceId];
      resolve(item);
    });
  },
  setItem(monitoredServiceId: string, lastLevelUserIndex: number, isHealthy: boolean): Promise<void> {
    return new Promise(resolve => {
      persistence[monitoredServiceId] = {
        lastLevelUserIndex,
        isHealthy
      };
      resolve();
    });
  }
});

export default PagerPersistenceAdapter;