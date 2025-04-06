import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { UserController } from '../controllers/UserController';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body } from 'express-validator';
import {
    validateUserExists,
    validateUserId,
    validateUserInputPassword,
    validateUserInputs,
} from '../middlewares/userValidation';
import { validateRole } from '../middlewares/validateRole';
import { uploadFile } from '../middlewares/uploadFile';
const router = Router();

router.param('userId', validateUserId);
router.param('userId', validateUserExists);
router.use(authenticate);

router.post(
    '/create-user',
    validateRole(['administrador']),
    validateUserInputs,
    validateUserInputPassword,
    ErrorsValidation,
    UserController.createUser,
);

router.get(
    '/get-all-users',
    validateRole(['administrador']),
    UserController.getAllUsers,
);

router.get(
    '/get-user/:userId',
    validateRole(['administrador', 'empleado']),
    UserController.getUser,
);

router.put(
    '/update-user/:userId',
    validateRole(['administrador', 'empleado']),
    validateUserInputs,
    ErrorsValidation,
    UserController.updateUser,
);

router.patch(
    '/suspended-user/:userId',
    validateRole(['administrador']),
    UserController.suspendUser,
);

router.post(
    '/upload-image/:userId',
    validateRole(['administrador', 'empleado']),
    uploadFile,
    UserController.uploadImageUser,
);

export default router;
