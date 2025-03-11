import { Router } from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { query } from 'express-validator';
import {
    discountValidation,
    ivaValidation,
    purchaseValidation,
} from '../middlewares/transactionsValidation';
import { authenticate } from '../middlewares/authenticate';
import { validateRole } from '../middlewares/validateRole';

const router = Router();
router.use(authenticate);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    query('take')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El límite de página debe ser un número entero'),
    query('skip')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El salto de página debe ser un número entero'),
    ErrorsValidation,
    PurchaseController.getAllPurchases,
);

router.get(
    '/:id',
    validateRole(['administrador', 'empleado']),
    PurchaseController.getPurchase,
);

router.post(
    '/',
    validateRole(['administrador', 'empleado']),
    purchaseValidation,
    discountValidation,
    ivaValidation,
    ErrorsValidation,
    PurchaseController.createPurchase,
);
router.patch(
    '/:id',
    validateRole(['administrador']),
    PurchaseController.suspendPurchase,
);

export default router;
