/**
 * Simple console logging class
 * Params: logLevel: number
 *      Level on a scale from 1-5. 5 being the most verbose, 1 being the least.
 */
export class Logs {
  constructor(private readonly logLevel = 3) {
    logs = this;
  }

  trace(message, ...parameters: any[]) {
    if (this.logLevel == 5) {
      console.info(message, ...parameters);
    }
  }

  debug(message, ...parameters: any[]) {
    if (this.logLevel >= 4) {
      console.info(message, ...parameters);
    }
  }

  info(message, ...parameters: any[]) {
    if (this.logLevel >= 3) {
      console.info(message, ...parameters);
    }
  }

  warn(message, ...parameters: any[]) {
    if (this.logLevel >= 2) {
      console.info(message, ...parameters);
    }
  }

  error(message, ...parameters: any[]) {
    if (this.logLevel >= 1) {
      console.info(message, ...parameters);
    }
  }
}

let logs: Logs;

export function getLogs() {
  return logs;
}