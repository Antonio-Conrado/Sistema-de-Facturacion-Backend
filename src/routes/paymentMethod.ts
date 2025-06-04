import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { PaymentMethodController } from '../controllers/PaymentMethodController';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRole([Role.admin]),
    body('name').notEmpty().withMessage('El método de pago es obligatorio'),
    ErrorsValidation,
    PaymentMethodController.createPaymentMethod,
);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    PaymentMethodController.getAllPaymentMethods,
);
router.get(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del método de pago no es válido'),
    ErrorsValidation,
    PaymentMethodController.getPaymentMethod,
);

router.put(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del método de pago no es válido'),
    body('name').notEmpty().withMessage('El método de pago es obligatorio'),
    ErrorsValidation,
    PaymentMethodController.updatePaymentMethod,
);

router.patch(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del método de pago no es válido'),
    ErrorsValidation,
    PaymentMethodController.suspendPaymentMethod,
);

export default router;
