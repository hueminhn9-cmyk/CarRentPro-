import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
      )
    }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

export const logAuth = (message: string) => {
  logger.info(`[AUTH] ${message}`);
};

export const logBooking = (bookingId: string | number, status: string, details?: string) => {
  logger.info(`[BOOKING #${bookingId}] Status changed to ${status}${details ? ` - ${details}` : ''}`);
};

export const logPayment = (paymentId: string | number, method: string, amount: number | string, status: string) => {
  logger.info(`[PAYMENT #${paymentId}] Method: ${method}, Amount: ${amount}, Status: ${status}`);
};

export const logError = (message: string, error?: any) => {
  if (error && error.stack) {
    logger.error(`${message}: ${error.message}\nStack: ${error.stack}`);
  } else {
    logger.error(`${message}${error ? ` - ${JSON.stringify(error)}` : ''}`);
  }
};
