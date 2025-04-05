import utilities from "./index.js";
import { body, validationResult } from "express-validator";
import * as invModel from "../models/inventory-model.js";

const validate = {};

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be string with only alphanumeric characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlphanumeric()
      .withMessage("Classification name must contain only letters and numbers.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error(
            "Classification exists. Please use a different name."
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to adding classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle make is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle model is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),

    // inv_year is required and must be 4-digit year
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle year is required.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits.")
      .isNumeric()
      .withMessage("Year must contain only numbers."),

    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle description is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),

    // inv_image is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    // inv_thumbnail is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    // inv_price is required and must be numeric
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle price is required.")
      .isNumeric()
      .withMessage("Price must be a number."),

    // inv_miles is required and must be numeric
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle miles are required.")
      .isNumeric()
      .withMessage("Miles must be a number."),

    // inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle color is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle color."),

    // classification_id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification is required.")
      .isNumeric()
      .withMessage("Classification ID must be a number."),
  ];
};

/* ******************************
 * Check data and return errors or continue to adding inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
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

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classList,
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
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to updating inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
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
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
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
    return;
  }
  next();
};

export default validate;
