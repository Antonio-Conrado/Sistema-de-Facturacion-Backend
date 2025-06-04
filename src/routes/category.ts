import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { CategoryController } from '../controllers/CategoryController';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRole([Role.admin, Role.employee]),
    body('name')
        .notEmpty()
        .withMessage('El nombre de la categoría es obligatorio'),
    ErrorsValidation,
    CategoryController.createCategory,
);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    CategoryController.getAllCategories,
);

router.get(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    CategoryController.getCategory,
);

router.put(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),
    body('name')
        .notEmpty()
        .withMessage('El nombre de la categoría es obligatorio'),
    ErrorsValidation,
    CategoryController.updateCategory,
);

router.patch(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    CategoryController.suspendCategory,
);

export default router;
