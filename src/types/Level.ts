export type Level = {
  type: LevelType,
  destination: string
}

export enum LevelType {
  SMS = "SMS",
  EMAIL = "EMAIL"
}