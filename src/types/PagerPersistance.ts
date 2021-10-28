export type Persistence = {
  [key: string]: PagerPersistenceItem
}

export type PagerPersistenceItem = {
  lastLevelUserIndex: number,
  isHealthy: boolean
}