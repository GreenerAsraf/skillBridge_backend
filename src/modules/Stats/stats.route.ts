import express from 'express';
import { StatsController } from './stats.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = express.Router();

router.get('/', StatsController.getPublicStats);
router.get('/admin/analytics', authMiddleware('ADMIN'), StatsController.getAdminAnalytics);

export const StatsRoutes = router;
