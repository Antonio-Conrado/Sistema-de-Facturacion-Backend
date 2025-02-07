import { Router } from 'express';
import { body, param } from 'express-validator';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authenticate';
import { limiterRequest } from '../config/limiterRequest';
import { validateRole } from '../middlewares/validateRole';

const router = Router();

// router.use(limiterRequest)

router.post(
    '/create-account',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('surname').notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .isLength({ min: 6 })
        .withMessage('El password debe tener mínimo 6 carácteres'),
    ErrorsValidation,
    AuthController.createAccount,
);

router.post(
    '/confirm-account',
    body('token')
        .isLength({ min: 6, max: 6 })
        .withMessage('El token no es válido'),
    ErrorsValidation,
    AuthController.confirmAccount,
);

router.post(
    '/login',
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('El password no es válido'),
    ErrorsValidation,
    AuthController.login,
);

router.post(
    '/forgot-password',
    body('email').isEmail().withMessage('Email inválido'),
    ErrorsValidation,
    AuthController.forgotPassword,
);

router.post(
    '/validate-token',
    body('token').isLength({ min: 6, max: 6 }).withMessage('Token no válido'),
    ErrorsValidation,
    AuthController.validateToken,
);

router.post(
    '/reset-password',
    body('password').notEmpty().withMessage('El password es obligatorio'),
    body('token').notEmpty().withMessage('El token es obligatorio'),
    ErrorsValidation,
    AuthController.resetPasswordByToken,
);

router.get('/user', authenticate, AuthController.user);

router.get(
    '/update-password',
    authenticate,
    validateRole(['administrador', 'empleado']),
    body('password')
        .notEmpty()
        .withMessage('El password actual es obligatorio'),
    body('newPassword')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .isLength({ min: 6 })
        .withMessage('El password debe ser mínimo 6 caracteres'),
    ErrorsValidation,
    AuthController.updatePassword,
);

router.get(
    '/check-password',
    authenticate,
    validateRole(['administrador', 'empleado']),
    body('password')
        .notEmpty()
        .withMessage('El password actual es obligatorio'),
    ErrorsValidation,
    AuthController.checkPassword,
);

export default router;
