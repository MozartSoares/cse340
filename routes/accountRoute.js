import express from "express";
import utilities from "../utilities/index.js";
import { buildLogin, buildRegister } from "../controllers/accountController.js";
import accountController from "../controllers/accountController.js";
import validate from "../utilities/account-validation.js";
import * as reviewController from "../controllers/reviewController.js";

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

// Account update route
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  validate.accountUpdateRules(),
  validate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  validate.passwordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// User reviews route
router.get(
  "/reviews",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.getUserReviews)
);

export default router;
