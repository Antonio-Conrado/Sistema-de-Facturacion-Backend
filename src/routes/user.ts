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
import { Role } from '../types';
const router = Router();

router.param('userId', validateUserId);
router.param('userId', validateUserExists);
router.use(authenticate);

router.post(
    '/create-user',
    validateRole([Role.admin]),
    validateUserInputs,
    validateUserInputPassword,
    ErrorsValidation,
    UserController.createUser,
);

router.get(
    '/get-all-users',
    validateRole([Role.admin]),
    UserController.getAllUsers,
);

router.get(
    '/get-user/:userId',
    validateRole([Role.admin, Role.employee]),
    UserController.getUser,
);

router.put(
    '/update-user/:userId',
    validateRole([Role.admin, Role.employee]),
    validateUserInputs,
    ErrorsValidation,
    UserController.updateUser,
);

router.patch(
    '/suspended-user/:userId',
    validateRole([Role.admin]),
    UserController.suspendUser,
);

router.post(
    '/upload-image/:userId',
    validateRole([Role.admin, Role.employee]),
    uploadFile,
    UserController.uploadImageUser,
);

export default router;
