import express from 'express';
import * as foodController from '../controllers/food.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import multer from 'multer'; // Import multer for file handling

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory as Buffer objects
});

// POST /api/food/ [protected]
router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);

// GET /api/food/ [protected]
router.get('/', authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood);

router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood);

export default router;