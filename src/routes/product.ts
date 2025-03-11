import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ProductsController } from '../controllers/ProductsController';
import { validateRole } from '../middlewares/validateRole';
import { body, param } from 'express-validator';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { uploadImage } from '../middlewares/uploadImage';

const router = Router();
router.use(authenticate);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    ProductsController.getAllProducts,
);
router.get(
    '/:id',
    validateRole(['administrador', 'empleado']),
    ProductsController.getProduct,
);
router.post(
    '/',
    validateRole(['administrador', 'empleado']),
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
    validateRole(['administrador', 'empleado']),
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
    validateRole(['administrador', 'empleado']),
    uploadImage,
    ProductsController.uploadImageProduct,
);

router.patch(
    '/:id',
    validateRole(['administrador']),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del producto no es válido'),
    ErrorsValidation,
    ProductsController.suspendProduct,
);

export default router;
