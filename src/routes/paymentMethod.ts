import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { PaymentMethodController } from '../controllers/PaymentMethodController';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRole(['administrador']),
    body('name').notEmpty().withMessage('El método de pago es obligatorio'),
    ErrorsValidation,
    PaymentMethodController.createPaymentMethod,
);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    PaymentMethodController.getAllPaymentMethods,
);
router.get(
    '/:id',
    validateRole(['administrador', 'empleado']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del método de pago no es válido'),
    ErrorsValidation,
    PaymentMethodController.getPaymentMethod,
);

router.put(
    '/:id',
    validateRole(['administrador']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del método de pago no es válido'),
    body('name').notEmpty().withMessage('El método de pago es obligatorio'),
    ErrorsValidation,
    PaymentMethodController.updatePaymentMethod,
);

router.patch(
    '/:id',
    validateRole(['administrador']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del método de pago no es válido'),
    ErrorsValidation,
    PaymentMethodController.suspendPaymentMethod,
);

export default router;
