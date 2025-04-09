import { Router } from 'express';
import { SeedController } from '../controllers/SeedController';

const router = Router();

router.get('/', SeedController.runSeed);

export default router;
