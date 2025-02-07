import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param, query } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { BusinessDataController } from '../controllers/BusinessDataController';
import { uploadImage } from '../middlewares/uploadImage';

const router = Router();

router.use(authenticate);

router.get(
    '/',
    validateRole(['administrador', 'empleado']),
    BusinessDataController.getBusinessData,
);

router.put(
    '',
    validateRole(['administrador']),
    body('ruc').notEmpty().withMessage('El ruc del negocio es obligatorio'),
    body('name').notEmpty().withMessage('El nombre del negocio es obligatorio'),
    body('direction')
        .notEmpty()
        .withMessage('La dirección del negocio es obligatorio'),
    body('description')
        .notEmpty()
        .withMessage('La descripión de los datos del negocio es obligatorio'),
    body('telephone')
        .notEmpty()
        .withMessage('El teléfono del negocio es obligatorio'),
    ErrorsValidation,
    BusinessDataController.updateBusinessData,
);

router.post(
    '/upload-image',
    validateRole(['administrador', 'empleado']),
    uploadImage,
    BusinessDataController.uploadImage,
);
export default router;
