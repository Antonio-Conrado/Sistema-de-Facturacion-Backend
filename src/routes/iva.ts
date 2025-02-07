import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { IvaController } from '../controllers/IvaController';

const router = Router();

router.use(authenticate);

router.post(
    '/create-iva',
    validateRole(['administrador']),
    body('rate')
        .notEmpty()
        .withMessage('El iva es obligatorio')
        .custom((value) => value >= 0 || value <= 30)
        .withMessage('El iva no es válido'),
    ErrorsValidation,
    IvaController.createIva,
);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    IvaController.getAllIva,
);
router.get(
    '/:ivaId',
    validateRole(['administrador', 'empleado']),
    param('ivaId')
        .custom((value) => value > 0)
        .withMessage('El id del iva no es válido'),
    ErrorsValidation,
    IvaController.getIva,
);

router.put(
    '/:ivaId',
    validateRole(['administrador']),
    param('ivaId')
        .custom((value) => value > 0)
        .withMessage('El id del iva no es válido'),
    body('rate').notEmpty().withMessage('El iva es obligatorio'),
    ErrorsValidation,
    IvaController.updateIva,
);

router.patch(
    '/:ivaId',
    validateRole(['administrador']),
    param('ivaId')
        .custom((value) => value > 0)
        .withMessage('El id del iva no es válido'),
    body('rate').notEmpty().withMessage('El iva es obligatorio'),
    ErrorsValidation,
    IvaController.suspendedIva,
);

export default router;
