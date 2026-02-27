// Simple structured logger for server-side code
// Provides consistent formatting and respects NODE_ENV

const isDev = process.env.NODE_ENV !== 'production';

function format(level: string, message: string) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
}

export const debug = (message: string, ...args: unknown[]) => {
  if (!isDev) return;
  console.debug(format('debug', message), ...args);
};

export const info = (message: string, ...args: unknown[]) => {
  console.info(format('info', message), ...args);
};

export const warn = (message: string, ...args: unknown[]) => {
  console.warn(format('warn', message), ...args);
};

export const error = (message: string, ...args: unknown[]) => {
  console.error(format('error', message), ...args);
};

// default export for convenience
const logger = { debug, info, warn, error };
export default logger;
