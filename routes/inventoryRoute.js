import express from "express";
import invController from "../controllers/invController.js";
import utilities from "../utilities/index.js";
import validate from "../utilities/inventory-validation.js";

const router = new express.Router();

//build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

//build inventory detail view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildInventoryPage)
);

//build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

//build add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

//add a new classification
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

//build add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

//add a new inventory item
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

//generate error (for testing)
router.get(
  "/generate-error",
  utilities.handleErrors(invController.generateError)
);

export default router;
