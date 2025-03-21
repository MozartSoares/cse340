import * as invModel from "../models/inventory-model.js";
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

Util.buildInventoryItemPage = async function (data) {
  return `
  <div class="vehicle-container">
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default Util;
