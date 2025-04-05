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

    let data = await invModel.getInventoryById(inv_id);

    if (!data) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "The requested vehicle does not exist.",
      });
    }

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
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData && invData.length > 0) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
      req.flash("notice", "Sorry, we couldn't find that inventory item.");
      return res.redirect("/inv/");
    }

    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    );
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    console.error("Error rendering edit view:", error);
    req.flash("notice", "Server error. Please try again.");
    return res.redirect("/inv/");
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The vehicle ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(
        classification_id
      );
      const itemName = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
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
    console.error("Error updating inventory:", error);
    req.flash("notice", "Server error. Please try again.");
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
      req.flash("notice", "This item does not exist.");
      return res.redirect("/inv/");
    }

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("./inventory/delete-confirmation", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  } catch (error) {
    console.error("Error building delete view:", error);
    req.flash("notice", "Server error. Please try again.");
    return res.redirect("/inv/");
  }
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.");
    } else {
      req.flash("notice", "The deletion failed.");
    }
    res.redirect("/inv/");
  } catch (error) {
    console.error("Error deleting inventory:", error);
    req.flash("notice", "Server error. Please try again.");
    res.redirect("/inv/");
  }
};

export default invCont;
