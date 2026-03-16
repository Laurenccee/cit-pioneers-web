type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isDev = process.env.NODE_ENV === 'development';

const COLORS: Record<LogLevel, string> = {
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
  debug: '\x1b[35m', // magenta
};
const RESET = '\x1b[0m';

function log(
  level: LogLevel,
  context: string,
  message: string,
  data?: unknown,
) {
  if (!isDev && level === 'debug') return;

  const timestamp = new Date().toISOString();
  const color = COLORS[level];
  const prefix = `${color}[${level.toUpperCase()}]${RESET} [${timestamp}] [${context}]`;

  if (data !== undefined) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  info: (context: string, message: string, data?: unknown) =>
    log('info', context, message, data),
  warn: (context: string, message: string, data?: unknown) =>
    log('warn', context, message, data),
  error: (context: string, message: string, data?: unknown) =>
    log('error', context, message, data),
  debug: (context: string, message: string, data?: unknown) =>
    log('debug', context, message, data),
};
