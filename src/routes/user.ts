import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { UserController } from "../controllers/UserController";
import { ErrorsValidation } from "../middlewares/ErrorsValidation";
import { body } from "express-validator";
import { validateUserExists, validateUserId, validateUserInputs } from "../middlewares/userValidation";
import { validateRole } from "../middlewares/validateRole";

const router = Router()

router.param('userId', validateUserId)
router.param('userId', validateUserExists)
router.use(authenticate)

router.post('/create-user',
    validateRole('admin'),
    validateUserInputs,
    ErrorsValidation,
    UserController.createUser
)

router.get('/get-all-users',
    validateRole('admin'),
    UserController.getAllUsers
)

router.get('/get-user/:userId',
    UserController.getUser
)

router.put('/update-user/:userId',
    validateRole('admin'),
    validateUserInputs,
    ErrorsValidation,
    UserController.updateUser
)

router.patch('/suspended-user/:userId',
    validateRole('admin'),
    UserController.suspendUser
)

router.post('/upload-image/:userId',
    body('image')
        .notEmpty().withMessage('La imagen es obligatoria'),
    UserController.uploadImageUser
)

export default router