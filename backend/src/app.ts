import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';
import { startMaintenanceScheduler } from './utils/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow static files like image uploads to be accessed from frontend
}));

// CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = [corsOrigin, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging via Morgan -> Winston
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Bạn đã thực hiện quá nhiều yêu cầu từ địa chỉ IP này. Vui lòng thử lại sau 15 phút.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Serve static upload directory
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Swagger Documentation
const swaggerFilePath = path.join(__dirname, '../swagger/swagger.json');
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info('Swagger API documentation initialized under /api-docs');
} else {
  logger.warn('Swagger specification file not found. Documentation under /api-docs disabled.');
}

// Base Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AutoRent SaaS API is running successfully',
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Listen
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server started successfully on port ${PORT} in ${process.env.NODE_ENV} mode`);
    // Start maintenance reminder scheduler
    startMaintenanceScheduler();
  });
}

export default app;
