import { Router } from 'express';
import { SeedController } from '../controllers/SeedController';
import { ErrorsValidation } from '../middlewares/ErrorsValidation';
import { param } from 'express-validator';

const router = Router();

router.get(
    '/:type',
    param('type')
        .isIn(['basicSeed', 'fullSeed'])
        .withMessage('El tipo debe ser basicSeed o fullSeed como parámetro'),
    ErrorsValidation,
    SeedController.runSeed,
);

export default router;
