import { LogLevel } from '../types/apillon';

export class ApillonLogger {
  private static logLevel: LogLevel = LogLevel.NONE;

  public static initialize(logLevel?: LogLevel) {
    this.logLevel = logLevel || LogLevel.NONE;
  }

  static log(message: any, logLevel: LogLevel) {
    if (this.logLevel >= logLevel) {
      if (message instanceof Object) {
        console.log(JSON.stringify(message));
      } else {
        console.log(message);
      }
    }
  }

  static logWithTime(message: any, logLevel: LogLevel) {
    if (this.logLevel >= logLevel) {
      if (message instanceof Object) {
        console.log(`${new Date().toISOString()}: `, JSON.stringify(message));
      } else {
        console.log(`${new Date().toISOString()}: `, message);
      }
    }
  }
}
