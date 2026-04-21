/**
 * Simple logger for the review workflow
 */
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`[INFO][${this.context}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.debug(`[DEBUG][${this.context}] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.error(`[ERROR][${this.context}] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.warn(`[WARN][${this.context}] ${message}`, ...args);
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
