import * as invModel from "../models/inventory-model.js";
import utilities from "../utilities/index.js";

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (!data || data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Classification Not Found",
        message: "No vehicles found for this classification.",
      });
    }
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;

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

invCont.generateError = async function (req, res, next) {
  throw new Error("This is a generated error.");
};

export default invCont;
