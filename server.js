/******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Import Statements
 *************************/
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";
config();
import express from "express";
import expressLayouts from "express-ejs-layouts";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import * as baseController from "./controllers/baseController.js";
import utilities from "./utilities/index.js";
const app = express();

/* ***********************
 * Live reload
 *************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(join(__dirname, "views"));
liveReloadServer.watch(join(__dirname, "public"));

// Attach LiveReload to HTML responses
app.use(connectLiveReload());

// Refresh browser on changes
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("*"); // Reloads all pages
  }, 100);
});
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

/* ***********************
 * View engine and template
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Disable EJS caching in development
app.set("view cache", false);

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public")); // Serve static files

/* ***********************
 * Routes
 *************************/
import staticRoutes from "./routes/static.js";
import inventoryRoute from "./routes/inventoryRoute.js";
app.use(staticRoutes);

app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});
/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
