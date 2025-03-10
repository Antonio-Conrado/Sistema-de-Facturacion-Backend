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
        .toInt()
        .isInt()
        .notEmpty()
        .withMessage('El iva es obligatorio')
        .custom((value) => value >= 0 && value <= 20)
        .withMessage('El iva no es válido. Debe estar en un rango de 0% - 20%'),
    ErrorsValidation,
    IvaController.createIva,
);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    IvaController.getAllIva,
);
router.get(
    '/:id',
    validateRole(['administrador', 'empleado']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del iva no es válido'),
    ErrorsValidation,
    IvaController.getIva,
);

router.put(
    '/:id',
    validateRole(['administrador']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del iva no es válido'),
    body('rate')
        .toInt()
        .isInt()
        .notEmpty()
        .withMessage('El iva es obligatorio')
        .custom((value) => value >= 0 && value <= 20)
        .withMessage('El iva no es válido. Debe estar en un rango de 0% - 20%'),
    ErrorsValidation,
    IvaController.updateIva,
);

router.patch(
    '/:id',
    validateRole(['administrador']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del iva no es válido'),
    ErrorsValidation,
    IvaController.suspendIva,
);

export default router;
