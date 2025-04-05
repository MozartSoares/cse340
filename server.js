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
import session from "express-session";
import pool from "./database/index.js";
import connectPgSimple from "connect-pg-simple";
import flash from "connect-flash";
import expressMessages from "express-messages";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
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
app.use(
  session({
    store: new (connectPgSimple(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

app.use(express.static("public")); // Serve static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(utilities.checkJWTToken);

/* ***********************
 * Routes
 *************************/
import staticRoutes from "./routes/static.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import accountRoute from "./routes/accountRoute.js";

app.use(staticRoutes);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
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
