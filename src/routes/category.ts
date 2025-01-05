import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { ErrorsValidation } from "../middlewares/ErrorsValidation";
import { body, param } from "express-validator";
import { validateRole } from "../middlewares/validateRole";
import { CategoryController } from "../controllers/CategoryController";

const router = Router()

router.use(authenticate)

router.post('/',
    validateRole('admin'),
    body('name')
        .notEmpty().withMessage('El nombre de la categoría es obligatorio'),
    ErrorsValidation,
    CategoryController.createCategory
)

router.get('/',
    CategoryController.getAllCategories
)

router.get('/:categoryId',
    param('categoryId')
        .custom(value => value > 0).withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    CategoryController.getCategory
)

router.put('/:categoryId',
    validateRole('admin'),
    param('categoryId')
        .custom(value => value > 0).withMessage('El id de la categoría no es válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la categoría es obligatorio'),
    ErrorsValidation,
    CategoryController.updateCategory
)

router.patch('/:categoryId',
    validateRole('admin'),
    param('categoryId')
        .custom(value => value > 0).withMessage('El id de la categoría no es válido'),
    ErrorsValidation,
    CategoryController.suspendedCategory
)

export default router