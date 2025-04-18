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
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildManagementView)
);

//build add classification view
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddClassification)
);

//add a new classification
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  validate.classificationRules(),
  validate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

//build add inventory view
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddInventory)
);

//add a new inventory item
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

//get inventory JSON data by classification
router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.getInventoryJSON)
);

//build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.editInventoryView)
);

//update inventory item
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

//build delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildDeleteView)
);

//process delete inventory item
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.deleteInventory)
);

//generate error (for testing)
router.get(
  "/generate-error",
  utilities.handleErrors(invController.generateError)
);

export default router;
