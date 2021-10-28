export type Level = Target[];

export type Target = {
  type: LevelType,
  destination: string
}

export enum LevelType {
  SMS = "SMS",
  EMAIL = "EMAIL"
}
