import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import utilities from "../utilities/index.js";

const router = express.Router();

// Get reviews for a vehicle
router.get(
  "/vehicle/:inventory_id",
  utilities.handleErrors(reviewController.getVehicleReviews)
);

// Add a new review
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.addReview)
);

// Delete a review
router.delete(
  "/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

// Update a review
router.post(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.updateReview)
);

export default router;
