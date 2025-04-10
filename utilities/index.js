import * as invModel from "../models/inventory-model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.buildInventoryItemPage = async function (data, loggedin) {
  return `
  <div class="vehicle-container" data-inv-id="${data.inv_id}">
    <!-- Vehicle Image -->
    <div class="image-container">
      <img src="${data.inv_image}" alt="${data.inv_make} ${
    data.inv_model
  }" class="vehicle-image">
    </div>

    <!-- Vehicle Details -->
    <div class="vehicle-details">
      <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
      <p class="price"><strong>Price:</strong> $${new Intl.NumberFormat(
        "en-US"
      ).format(data.inv_price)}</p>
      <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(
        data.inv_miles
      )} miles</p>
      <p><strong>Color:</strong> ${data.inv_color}</p>
      <p class="description"><strong>Description:</strong> ${
        data.inv_description
      }</p>

      <!-- Call to Action -->
      <div class="cta">
        <a href="/" class="back-link">← Back to Home</a>
      </div>
    </div>
  </div>

  <!-- Reviews Section -->
  <div class="reviews-section">
    <div class="reviews-header">
      <h3>Vehicle Reviews</h3>
      ${
        !loggedin
          ? `
        <div class="login-prompt">
          <p>Want to share your thoughts? <a href="/account/login">Log in</a> to add a review.</p>
        </div>
      `
          : ""
      }
    </div>

    <div id="reviews-container">
      <!-- Reviews will be loaded here -->
    </div>

    ${
      loggedin
        ? `
      <div class="add-review-form" id="add-review-form">
        <h4>Add Your Review</h4>
        <textarea id="review-text" placeholder="Write your review here..." required></textarea>
        <button onclick="submitReview(${data.inv_id})" class="submit-review-btn">Submit Review</button>
      </div>
    `
        : ""
    }
  </div>

  <style>
    .reviews-section {
      max-width: 900px;
      margin: 20px auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #eee;
    }
    .reviews-header h3 {
      margin: 0;
      color: #333;
    }
    .login-prompt {
      font-size: 0.9em;
      color: #666;
    }
    .login-prompt a {
      color: var(--blue);
      text-decoration: underline;
    }
    .review-item {
      border-bottom: 1px solid #eee;
      padding: 15px 0;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #666;
    }
    .reviewer-name {
      font-weight: bold;
    }
    .review-text {
      line-height: 1.5;
    }
    .add-review-form {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #eee;
    }
    .add-review-form h4 {
      margin-bottom: 15px;
      color: #333;
    }
    .add-review-form textarea {
      width: 100%;
      min-height: 100px;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }
    .submit-review-btn {
      background-color: var(--blue);
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
    }
    .submit-review-btn:hover {
      background-color: #015a6e;
    }
    .no-reviews {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 20px 0;
    }
  </style>
  `;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the classification selection list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Admin/Employee Access
 * ************************************ */
Util.checkAdminEmployee = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      next();
    } else {
      req.flash(
        "notice",
        "Unauthorized access. Please log in with appropriate credentials."
      );
      return res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* **************************************
 * Build the review list HTML
 * ************************************ */
Util.buildReviewList = async function (reviews) {
  let reviewList = '<div class="reviews-list">';
  if (reviews.length === 0) {
    reviewList += '<p class="no-reviews">No reviews yet.</p>';
  } else {
    reviews.forEach((review) => {
      reviewList += '<div class="review-item">';
      reviewList += `<div class="review-header">
        <span class="reviewer-name">${review.account_firstname} ${
        review.account_lastname
      }</span>
        <span class="review-date">${new Date(
          review.created_date
        ).toLocaleDateString()}</span>
      </div>`;
      reviewList += `<div class="review-text">${review.review_text}</div>`;
      reviewList += "</div>";
    });
  }
  reviewList += "</div>";
  return reviewList;
};

Util.buildUserReviewList = async function (reviews) {
  if (!reviews || reviews.length === 0) {
    return '<p class="notice">You have not written any reviews yet.</p>';
  }

  let html = '<ul class="user-reviews">';
  reviews.forEach((review) => {
    html += '<li class="review-item">';
    html += `<h3>${review.inv_year} ${review.inv_make} ${review.inv_model}</h3>`;
    html += `<div class="review-text" id="review-text-${review.review_id}">${review.review_text}</div>`;
    html += `<div class="review-date">Posted on: ${new Date(
      review.created_date
    ).toLocaleDateString()}</div>`;
    html += '<div class="review-actions">';
    html += `<button onclick="editReview(${review.review_id})" class="btn-edit">Edit</button>`;
    html += `<button onclick="deleteReview(${review.review_id})" class="btn-delete">Delete</button>`;
    html += "</div>";
    html += "</li>";
  });
  html += "</ul>";
  return html;
};

/* ****************************************
 * Build the home page view
 * *************************************** */
Util.buildHome = async function (req, res) {
  try {
    const nav = await Util.getNav();
    res.render("index", {
      title: "Home",
      nav,
      errors: null,
    });
  } catch (error) {
    throw error;
  }
};

export default Util;
