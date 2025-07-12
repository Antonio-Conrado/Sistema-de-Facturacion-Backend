import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { body, param } from 'express-validator';
import { validateRole } from '../middlewares/validateRole';
import { BankController } from '../controllers/BankController';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validateRole([Role.admin, Role.employee]),
    body('name').notEmpty().withMessage('El nombre del banco es obligatorio'),
    ErrorsValidation,
    BankController.createBank,
);

router.get(
    '/',
    validateRole([Role.admin, Role.employee]),
    BankController.getAllBanks,
);

router.get(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del banco no es válido'),
    ErrorsValidation,
    BankController.getBank,
);

router.put(
    '/:id',
    validateRole([Role.admin, Role.employee]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del banco no es válido'),
    body('name').notEmpty().withMessage('El nombre del banco es obligatorio'),
    ErrorsValidation,
    BankController.updateBank,
);

router.patch(
    '/:id',
    validateRole([Role.admin]),
    param('id')
        .custom((value) => value > 0)
        .withMessage('El id del banco no es válido'),
    ErrorsValidation,
    BankController.suspendBank,
);

export default router;
