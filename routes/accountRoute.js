import express from "express";
import utilities from "../utilities/index.js";
import { buildLogin, buildRegister } from "../controllers/accountController.js";
import accountController from "../controllers/accountController.js";

const router = express.Router();

// Login
router.get("/login", utilities.handleErrors(buildLogin));

// Register
router.get("/register", utilities.handleErrors(buildRegister));

// Process Registration
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

export default router;
