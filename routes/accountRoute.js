import express from "express";
import utilities from "../utilities/index.js";
import { buildLogin, buildRegister } from "../controllers/accountController.js";
import accountController from "../controllers/accountController.js";
import validate from "../utilities/account-validation.js";

const router = express.Router();

// Login
router.get("/login", utilities.handleErrors(buildLogin));

// Register
router.get("/register", utilities.handleErrors(buildRegister));

// Process Registration
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Default route for account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

export default router;
