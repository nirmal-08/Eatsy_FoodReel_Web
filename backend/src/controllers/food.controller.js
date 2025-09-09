import foodModel from '../models/food.model.js';
import * as storageService from '../services/storage.service.js';
import { v4 as uuid } from "uuid";
import likeModel from '../models/likes.model.js';
import saveModel from '../models/save.model.js';

export async function createFood(req, res) {
    // console.log(req.foodPartner);
    // console.log(req.body);
    // console.log(req.file);

    const fileUploadResult = await storageService.uploadFile(
        req.file.buffer, // Access the file buffer directly
        uuid()
    );
    // console.log(fileUploadResult);

    const foodItem =
        await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })
    console.log("Schema paths:", Object.keys(foodModel.schema.paths));

    // console.log("Cookies:", req.cookies);


    res.status(201).json({
        message: "Food item created successfully",
        food: foodItem
    })
}

export async function getFoodItems(req, res) {

    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems,
    })
}
export async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!user || !user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId });

        let like;
        let likeStatus;
        if (isAlreadyLiked) {
            await likeModel.deleteOne({ user: user._id, food: foodId });
            await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
            likeStatus = false;
        } else {
            like = await likeModel.create({ user: user._id, food: foodId });
            await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });
            likeStatus = true;
        }

        // Get the updated like count
        const food = await foodModel.findById(foodId);
        const likeCount = food?.likeCount || 0;

        return res.status(200).json({
            message: likeStatus ? "Food item liked successfully" : "Food item unliked successfully",
            like: likeStatus,
            likeCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function saveFood(req, res) {
    const { foodId } = req.body;

    const user = req.user;
    
    const isAlreadySaved = await likeModel.findOne({ user: user._id, food: foodId });

    if (isAlreadySaved) {
        await likeModel.deleteOne({ user: user._id, food: foodId });
        return res.status(200).json({
            message: "Food item unsaved successfully",
        })
    }
    
    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    res.status(201).json({
        message: "Food item saved successfully",
        save
    })
}


// All functions are exported above as named exports