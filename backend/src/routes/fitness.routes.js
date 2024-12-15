import express from 'express';
import { getFitnessData, getFitnessDataHistory } from '../controllers/googleFit.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/data', verifyJWT, getFitnessData);
router.get('/history', verifyJWT, getFitnessDataHistory);

export default router;