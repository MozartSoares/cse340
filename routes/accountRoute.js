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

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  (req, res) => {
    res.status(200).send("login process");
  }
);

export default router;
