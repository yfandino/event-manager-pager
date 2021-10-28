import { Level, LevelType } from "../types";

const NotificationAdapter = {
  sendEmail: (level: Level): Promise<void> => new Promise(resolve => resolve()),
  sendSMS: (level: Level): Promise<void> => new Promise(resolve => resolve()),
  sendNotification: function (level: Level) {
    if (level.type === LevelType.EMAIL) {
      this.sendEmail(level);
    } else if (level.type === LevelType.SMS) {
      this.sendSMS(level)
    }
  }
}

export default NotificationAdapter;