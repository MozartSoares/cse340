/******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const env = require('dotenv').config();
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const app = express();

/* ***********************
 * Live reload
 *************************/
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + '/views'); // Watch EJS files
liveReloadServer.watch(__dirname + '/public'); // Watch static files

// Attach LiveReload to HTML responses
app.use(connectLiveReload());

// Refresh browser on changes
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('*'); // Reloads all pages
  }, 100);
});
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

/* ***********************
 * View engine and template
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Disable EJS caching in development
app.set('view cache', false);

/* ***********************
 * Middleware
 *************************/
app.use(express.static('public')); // Serve static files

/* ***********************
 * Routes
 *************************/
const staticRoutes = require('./routes/static');
app.use(staticRoutes);

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
