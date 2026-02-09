import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as ratingsController from '../controllers/ratingsController.js';

const router = Router();

router.get('/doctor/:id', ratingsController.getByDoctor);

router.use(authenticateToken);
router.get('/my-ratings', authorizeRoles('patient'), ratingsController.getMyRatings);
router.post('/', authorizeRoles('patient'), ratingsController.create);

export default router;
