/**
 * Application Logger
 * Provides structured logging with different levels
 * In production, logs can be sent to external services
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
}

class Logger {
  private isDevelopment: boolean;
  private enableDebug: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.enableDebug =
      import.meta.env.VITE_DEBUG_MODE === "true" || this.isDevelopment;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string,
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === "debug" && !this.enableDebug) {
      return false;
    }
    return true;
  }

  private formatLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]${entry.context ? ` [${entry.context}]` : ""}`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case "debug":
        console.debug(message, entry.data || "");
        break;
      case "info":
        console.info(message, entry.data || "");
        break;
      case "warn":
        console.warn(message, entry.data || "");
        break;
      case "error":
        console.error(message, entry.data || "");
        break;
    }

    // In production, you could send logs to external service
    if (!this.isDevelopment && entry.level === "error") {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(_entry: LogEntry): void {
    // Implement external logging service integration here
    // e.g., Sentry, LogRocket, DataDog, etc.
  }

  /**
   * Log debug information (only in development or when debug mode is enabled)
   */
  debug(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry("debug", message, data, context);
    this.formatLog(entry);
  }

  /**
   * Log general information
   */
  info(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry("info", message, data, context);
    this.formatLog(entry);
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry("warn", message, data, context);
    this.formatLog(entry);
  }

  /**
   * Log errors
   */
  error(message: string, error?: any, context?: string): void {
    const entry = this.createLogEntry("error", message, error, context);
    this.formatLog(entry);
  }

  /**
   * Log API calls
   */
  api(method: string, url: string, data?: any): void {
    if (this.enableDebug) {
      this.debug(`API ${method.toUpperCase()} ${url}`, data, "API");
    }
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, url: string, status: number, data?: any): void {
    if (this.enableDebug) {
      this.debug(`API ${method.toUpperCase()} ${url} - ${status}`, data, "API");
    }
  }

  /**
   * Log API errors
   */
  apiError(method: string, url: string, error: any): void {
    this.error(`API ${method.toUpperCase()} ${url} failed`, error, "API");
  }
}

// Create and export singleton instance
export const logger = new Logger();

// Export default
export default logger;
