import express from "express";
import invController from "../controllers/invController.js";
import utilities from "../utilities/index.js";
const router = new express.Router();

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildInventoryPage)
);
router.get(
  "/generate-error",
  utilities.handleErrors(invController.generateError)
);

export default router;
