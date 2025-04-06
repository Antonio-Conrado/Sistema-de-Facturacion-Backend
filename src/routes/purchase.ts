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
import { uploadFile } from '../middlewares/uploadFile';
import { validatePaginationQuery } from '../middlewares/pagination';

const router = Router();
router.use(authenticate);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    validatePaginationQuery,
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

router.patch(
    '/upload-document/:id',
    validateRole(['administrador', 'empleado']),
    uploadFile,
    PurchaseController.uploadPurchaseInvoice,
);

// The structure should be as follows. Example: api/purchases/suppliers/filter/term?suppliersId=1&take=10&skip=0
router.get(
    '/filter/term',
    validateRole(['administrador', 'empleado']),
    query().custom((value, { req }) => {
        const { suppliersId, usersId, invoiceNumber } = req.query;
        if (!suppliersId && !usersId && !invoiceNumber) {
            throw new Error(
                'Debe proporcionar al menos un uno de los siguiente parametros con la estructura siguiente. Ejemplo: suppliersId=1, usersId=1 o invoiceNumber=1',
            );
        }

        return true;
    }),
    query('usersId')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El ID del usuario debe ser un número entero'),

    query('suppliersId')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El ID del proveedor debe ser un número entero'),
    query('invoiceNumber')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El número de factura debe ser un número entero'),
    validatePaginationQuery,
    ErrorsValidation,
    PurchaseController.filterPurchasesByTerm,
);

export default router;
