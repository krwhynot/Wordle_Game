import { Router } from 'express';
import wordRoutes from './wordRoutes';

const router = Router();

// Word-related routes
router.use('/word', wordRoutes);

export default router;
