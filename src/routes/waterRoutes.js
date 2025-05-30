import express from 'express';
import waterController from '../controllers/waterController.js';

const router = express.Router();

router.post('/', waterController.createWater);
router.get('/insert', waterController.createWaterQuery);
router.get('/', waterController.getAllWater);
router.get('/:id', waterController.getWaterById);

export default router;