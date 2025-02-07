import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { SupplierController } from '../controllers/SupplierController';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRole(['administrador']),
    body('ruc').notEmpty().withMessage('El ruc del proveedor es obligatorio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre del proveedor es obligatorio'),
    ErrorsValidation,
    SupplierController.createSupplier,
);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    SupplierController.getAllSuppliers,
);

router.get(
    '/:supplierId',
    validateRole(['administrador', 'empleado']),
    param('supplierId')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    SupplierController.getSupplier,
);

router.put(
    '/:supplierId',
    validateRole(['administrador']),
    param('supplierId')
        .custom((value) => value > 0)
        .withMessage('El id del proveedor no es válido'),
    body('ruc').notEmpty().withMessage('El ruc del proveedor es obligatorio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre del proveedor es obligatorio'),
    ErrorsValidation,
    SupplierController.updateSupplier,
);

router.patch(
    '/:supplierId',
    validateRole(['administrador']),
    param('supplierId')
        .custom((value) => value > 0)
        .withMessage('El id del proveedor no es válido'),
    ErrorsValidation,
    SupplierController.suspendedSupplier,
);

export default router;
