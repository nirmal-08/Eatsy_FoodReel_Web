import express from 'express';
import * as foodPartnerController from '../controllers/foodPartner.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// api/food-partner/:id [protected]
router.get('/:id', authMiddleware.authUserMiddleware, foodPartnerController.getFoodPartnerById);

export default router;