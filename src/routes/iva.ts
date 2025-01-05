import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { ErrorsValidation } from "../middlewares/ErrorsValidation";
import { body, param } from "express-validator";
import { validateRole } from "../middlewares/validateRole";
import { IvaController } from "../controllers/IvaController";

const router = Router()

router.use(authenticate)

router.post('/create-iva',
    validateRole('admin'),
    body('rate')
        .notEmpty().withMessage('El iva es obligatorio')
        .custom(value => value >= 0 || value <= 30).withMessage('El iva no es válido'),
    ErrorsValidation,
    IvaController.createIva
)

router.get('/',
    IvaController.getAllIva
)
router.get('/:ivaId',
    param('ivaId')
        .custom(value => value > 0).withMessage('El id del iva no es válido'),
    ErrorsValidation,
    IvaController.getIva
)

router.put('/:ivaId',
    validateRole('admin'),
    param('ivaId')
        .custom(value => value > 0).withMessage('El id del iva no es válido'),
    body('rate')
        .notEmpty().withMessage('El iva es obligatorio'),
    ErrorsValidation,
    IvaController.updateIva
)

router.patch('/:ivaId',
    validateRole('admin'),
    param('ivaId')
        .custom(value => value > 0).withMessage('El id del iva no es válido'),
    body('rate')
        .notEmpty().withMessage('El iva es obligatorio'),
    ErrorsValidation,
    IvaController.suspendedIva
)

export default router;
