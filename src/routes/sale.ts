import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRole } from '../middlewares/validateRole';
import { Role } from '../types';
import { validatePaginationQuery } from '../middlewares/pagination';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { SaleController } from '../controllers/SaleController';
import { uploadFile } from '../middlewares/uploadFile';
import { body, query } from 'express-validator';
import {
    discountValidation,
    ivaValidation,
    saleValidation,
} from '../middlewares/transactionsValidation';

const router = Router();

router.use(authenticate);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    validatePaginationQuery,
    ErrorsValidation,
    SaleController.getAllSales,
);

router.get(
    '/last-invoice-number',
    validateRole([Role.admin, Role.employee]),
    SaleController.lastInvoiceNumber,
);

router.get(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    SaleController.getSale,
);

router.post(
    '/',
    validateRole([Role.admin, Role.employee]),
    saleValidation,
    discountValidation,
    ivaValidation,
    ErrorsValidation,
    SaleController.createSale,
);
router.patch(
    '/:id',
    validateRole([Role.admin]),
    body('cancellationReason')
        .notEmpty()
        .withMessage(
            'Debe proporcionar el motivo por el cual se anula la factura.',
        ),
    ErrorsValidation,
    SaleController.suspendSale,
);

router.patch(
    '/upload-document/:id',

    validateRole([Role.admin, Role.employee]),
    uploadFile,
    SaleController.uploadSaleInvoice,
);

// The structure should be as follows. Example: api/purchases/suppliers/filter/term?suppliersId=1&take=10&skip=0
router.get(
    '/filter/term',
    validateRole([Role.admin, Role.employee]),
    query().custom((value, { req }) => {
        const { paymentMethodId, usersId, invoiceNumber } = req.query;
        if (!paymentMethodId && !usersId && !invoiceNumber) {
            throw new Error(
                'Debe proporcionar al menos un uno de los siguiente parametros con la estructura siguiente. Ejemplo: paymentMethodId=1, usersId=1 o invoiceNumber=1',
            );
        }

        return true;
    }),
    query('usersId')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El ID del usuario debe ser un número entero'),

    query('paymentMethodId')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El ID del método de pago debe ser un número entero'),
    query('invoiceNumber')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El número de factura debe ser un número entero'),
    validatePaginationQuery,
    ErrorsValidation,
    SaleController.filterSaleByTerm,
);

export default router;
