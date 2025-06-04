import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ProductsController } from '../controllers/ProductsController';
import { validateRole } from '../middlewares/validateRole';
import { body, oneOf, param, query } from 'express-validator';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { uploadFile } from '../middlewares/uploadFile';
import { Role } from '../types';

const router = Router();
router.use(authenticate);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    ProductsController.getAllProducts,
);

router.get(
    '/term',
    validateRole([Role.admin]),
    oneOf([query('code').notEmpty(), query('name').notEmpty()], {
        message:
            'Debe proporcionar al menos un término de búsqueda válido: "code" o "name".',
    }),
    ErrorsValidation,
    ProductsController.filterProductByTerm,
);

router.get(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    ProductsController.getProduct,
);
router.post(
    '/',
    validateRole([Role.admin, Role.employee]),
    body('detailsProducts.products.name')
        .notEmpty()
        .withMessage('El nombre del producto es obligatorio'),
    body('detailsProducts.products.code')
        .notEmpty()
        .withMessage('El código del producto es obligatorio'),
    body('detailsProducts.products.categoriesId')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    ProductsController.createProduct,
);

router.put(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    body('detailsProducts.id')
        .custom((value) => value > 0)
        .withMessage('El id de detalles de producto no es válido'),
    body('detailsProducts.products.id')
        .custom((value) => value > 0)
        .withMessage('El id del producto no es válido'),
    body('detailsProducts.products.name')
        .notEmpty()
        .withMessage('El nombre del producto es obligatorio'),
    body('detailsProducts.products.code')
        .notEmpty()
        .withMessage('El código del producto es obligatorio'),
    body('detailsProducts.products.categoriesId')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),

    ErrorsValidation,
    ProductsController.updateProduct,
);

router.post(
    '/upload-image/:id',
    validateRole([Role.admin, Role.employee]),
    uploadFile,
    ProductsController.uploadImageProduct,
);

router.patch(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del producto no es válido'),
    ErrorsValidation,
    ProductsController.suspendProduct,
);

export default router;
