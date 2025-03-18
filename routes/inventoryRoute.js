import express from "express";
import invController from "../controllers/invController.js";
const router = new express.Router();

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

export default router;
