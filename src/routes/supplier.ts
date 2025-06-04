import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { SupplierController } from '../controllers/SupplierController';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRole([Role.admin]),
    body('ruc').notEmpty().withMessage('El ruc del proveedor es obligatorio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre del proveedor es obligatorio'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('El email del proveedor no es válido'),
    ErrorsValidation,
    SupplierController.createSupplier,
);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    SupplierController.getAllSuppliers,
);

router.get(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    SupplierController.getSupplier,
);

router.put(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del proveedor no es válido'),
    body('ruc').notEmpty().withMessage('El ruc del proveedor es obligatorio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre del proveedor es obligatorio'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('El email del proveedor no es válido'),
    ErrorsValidation,
    SupplierController.updateSupplier,
);

router.patch(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del proveedor no es válido'),
    ErrorsValidation,
    SupplierController.suspendSupplier,
);

export default router;
