import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import utilities from "../utilities/index.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

// Index route
router.get("/", utilities.handleErrors(utilities.buildHome));

// Favicon routes
router.get("/favicon.ico", (req, res) => {
  res.set("Content-Type", "image/x-icon");
  res.sendFile("public/images/site/favicon.svg", { root: "./" });
});

router.get("/images/site/favicon.svg", (req, res) => {
  res.set("Content-Type", "image/svg+xml");
  res.sendFile("public/images/site/favicon.svg", { root: "./" });
});

export default router;
