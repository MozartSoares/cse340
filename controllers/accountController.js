import utilities from "../utilities/index.js";
import * as accountModel from "../models/account-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/* ****************************************
 *  Login
 * *************************************** */
export async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Register
 * *************************************** */
export async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
export async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  console.log("🚀 ~ registerAccount ~ req:", req);

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  console.log("🚀 ~ registerAccount ~ hashedPassword:", hashedPassword);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
export async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    console.log("Comparing passwords...");
    console.log(
      "Account password in DB (hashed):",
      accountData.account_password
    );
    const passwordsMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    );

    if (passwordsMatch) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      console.log("JWT created successfully");

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      console.log("Redirecting to account management");
      return res.redirect("/account/");
    }
    console.log("Invalid password");
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Build account management view
 * ************************************ */
export async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

export default {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
};
