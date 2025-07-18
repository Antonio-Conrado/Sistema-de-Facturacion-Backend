import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRole } from '../middlewares/validateRole';
import { Role } from '../types';
import { SaleController } from '../controllers/SaleController';
import { DashboardController } from '../controllers/DashboardController';

const router = Router();

router.use(authenticate);

router.get(
    '/',
    validateRole([Role.admin]),
    DashboardController.getDashboardSummary,
);

export default router;
