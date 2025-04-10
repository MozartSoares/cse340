import * as reviewModel from "../models/review-model.js";
import utilities from "../utilities/index.js";

const reviewController = {};

/* ****************************************
 *  Process New Review
 * *************************************** */
export async function addReview(req, res) {
  const { inventory_id, review_text } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    const result = await reviewModel.addReview(
      inventory_id,
      account_id,
      review_text
    );
    const reviews = await reviewModel.getReviewsByVehicle(inventory_id);
    const reviewsHtml = await utilities.buildReviewList(reviews);
    res.json({ message: "Review added successfully", reviews: reviewsHtml });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* ****************************************
 *  Get Reviews for Vehicle
 * *************************************** */
export async function getVehicleReviews(req, res) {
  const { inventory_id } = req.params;
  try {
    const reviews = await reviewModel.getReviewsByVehicle(inventory_id);
    const reviewsHtml = await utilities.buildReviewList(reviews);
    res.json({ reviews: reviewsHtml });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* ****************************************
 *  Delete Review
 * *************************************** */
export async function deleteReview(req, res) {
  const { review_id } = req.params;
  const account_id = res.locals.accountData.account_id;

  try {
    const result = await reviewModel.deleteReview(review_id, account_id);
    if (result) {
      res.json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found or unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* ****************************************
 *  Get User Reviews View
 * *************************************** */
export async function getUserReviews(req, res) {
  const account_id = res.locals.accountData.account_id;
  try {
    const reviews = await reviewModel.getReviewsByAccount(account_id);
    const reviewsHtml = await utilities.buildUserReviewList(reviews);
    res.render("account/reviews", {
      title: "Your Reviews",
      nav: await utilities.getNav(),
      reviews: reviewsHtml,
      errors: null,
    });
  } catch (error) {
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Error fetching reviews",
      nav: await utilities.getNav(),
    });
  }
}

/* ****************************************
 *  Update Review
 * *************************************** */
export async function updateReview(req, res) {
  const { review_id, review_text } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    const result = await reviewModel.updateReview(
      review_id,
      account_id,
      review_text
    );
    if (result) {
      const reviews = await reviewModel.getReviewsByAccount(account_id);
      const reviewsHtml = await utilities.buildUserReviewList(reviews);
      res.json({
        message: "Review updated successfully",
        reviews: reviewsHtml,
      });
    } else {
      res.status(404).json({ message: "Review not found or unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
