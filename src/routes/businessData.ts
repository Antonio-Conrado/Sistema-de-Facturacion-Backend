import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param, query } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { BusinessDataController } from '../controllers/BusinessDataController';
import { uploadFile } from '../middlewares/uploadFile';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    BusinessDataController.getBusinessData,
);

router.put(
    '/',
    validateRole([Role.admin]),
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
    validateRole([Role.admin, Role.employee]),
    uploadFile,
    BusinessDataController.uploadImage,
);
export default router;
