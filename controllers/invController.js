import * as invModel from "../models/inventory-model.js";
import utilities from "../utilities/index.js";

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const classificationData = await invModel.getClassificationById(
      classification_id
    );

    if (!classificationData || classificationData.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Classification Not Found",
        message: "The requested classification does not exist.",
        nav: await utilities.getNav(),
      });
    }

    const className = classificationData[0].classification_name;

    const inventoryData = await invModel.getInventoryByClassificationId(
      classification_id
    );
    let grid;

    if (!inventoryData || inventoryData.length === 0) {
      grid = `<div class="empty-classification">
                <p>No vehicles found in the ${className} classification.</p>
                <p>More vehicles will be added soon!</p>
              </div>`;
    } else {
      grid = await utilities.buildClassificationGrid(inventoryData);
    }

    const nav = await utilities.getNav();

    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error fetching inventory by classification:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An error occurred while processing your request.",
      nav: await utilities.getNav(),
    });
  }
};

/* ***************************
 *  Build inventory item page (Vehicle Details)
 * ************************** */
invCont.buildInventoryPage = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;

    let data = await invModel.getInventoryItemByID(inv_id);

    if (!data || data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "The requested vehicle does not exist.",
      });
    }

    data = data[0];
    const page = await utilities.buildInventoryItemPage(data);
    const nav = await utilities.getNav();

    res.render("./inventory/inventoryItem", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      page,
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An error occurred while fetching vehicle details.",
    });
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error rendering management view:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error rendering add-classification view:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};

/* ***************************
 *  Add new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result.rowCount === 1) {
      req.flash(
        "notice",
        `Classification '${classification_name}' added successfully.`
      );
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "Server error. Please try again.");
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      errors: null,
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classList,
      errors: null,
    });
  } catch (error) {
    console.error("Error rendering add-inventory view:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};

/* ***************************
 *  Add new inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );

    if (result.rowCount === 1) {
      req.flash(
        "notice",
        `Vehicle ${inv_make} ${inv_model} added successfully.`
      );
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.");
      const nav = await utilities.getNav();
      const classList = await utilities.buildClassificationList(
        classification_id
      );
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classList,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      });
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    req.flash("notice", "Server error. Please try again.");
    const nav = await utilities.getNav();
    const classList = await utilities.buildClassificationList(
      req.body.classification_id
    );
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classList,
      errors: null,
      ...req.body,
    });
  }
};

invCont.generateError = async function (req, res, next) {
  throw new Error("This is a generated error.");
};

export default invCont;
