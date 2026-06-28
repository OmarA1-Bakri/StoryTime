export type LogContext = Record<string, string | number | boolean | undefined>;

export const logger = {
  info(message: string, context: LogContext = {}) {
    console.log(JSON.stringify({ level: "info", message, ...context }));
  },
  warn(message: string, context: LogContext = {}) {
    console.warn(JSON.stringify({ level: "warn", message, ...context }));
  },
  error(message: string, context: LogContext = {}) {
    console.error(JSON.stringify({ level: "error", message, ...context }));
  }
};
