import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import vehicleRouter from './vehicle.routes.js';
import bookingRouter from './booking.routes.js';
import paymentRouter from './payment.routes.js';
import reviewRouter from './review.routes.js';
import mediaRouter from './media.routes.js';
import contractRouter from './contract.routes.js';
import settingRouter from './setting.routes.js';
import notificationRouter from './notification.routes.js';
import dashboardRouter from './dashboard.routes.js';
import maintenanceRouter from './maintenance.routes.js';
import customerProfileRouter from './customer-profile.routes.js';
import bookingServiceRouter from './booking-service.routes.js';
import handoverRecordRouter from './handover-record.routes.js';
import auditLogRouter from './audit-log.routes.js';
import bookingStatusHistoryRouter from './booking-status-history.routes.js';
import { prisma } from '../config/prisma.js';
const apiRouter = Router();
apiRouter.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({
            success: true,
            status: 'UP',
            services: {
                database: 'UP',
                api: 'UP',
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            status: 'DOWN',
            services: {
                database: 'DOWN',
                api: 'UP',
            },
            error: error instanceof Error ? error.message : 'Unknown database error',
            timestamp: new Date().toISOString(),
        });
    }
});
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/vehicles', vehicleRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/contracts', contractRouter);
apiRouter.use('/settings', settingRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/maintenance', maintenanceRouter);
apiRouter.use('/customer-profiles', customerProfileRouter);
apiRouter.use('/booking-services', bookingServiceRouter);
apiRouter.use('/handover-records', handoverRecordRouter);
apiRouter.use('/audit-logs', auditLogRouter);
apiRouter.use('/booking-status-history', bookingStatusHistoryRouter);
export default apiRouter;
