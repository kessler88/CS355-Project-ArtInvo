// modules
const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const createError = require("http-errors");
const bodyParser = require("body-parser");

// the service classes
const FeedBackService = require("./services/FeedbackService");
const SpeakersService = require("./services/SpeakerService");

// class instance, botn instance constructor shld take datafile (JSON)
// these two instance will be pass down to our routing infrasture
const feedbackService = new FeedBackService("./data/feedback.json");
const speakersService = new SpeakersService("./data/speakers.json");

const routes = require("./routes");

const app = express();

const port = 3000;

// setting up cookie-session middleware
app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: ["SHDHFJHABSDA54221D", "sjdahjsdhjasdhashdahsdhj54884"],
  })
);

// setting body parser middleware for forms
app.use(bodyParser.urlencoded({ extended: true }));
// setting body parser middleware for JSON
app.use(bodyParser.json());


// View engine, setting our template files to be type ejs
app.set("view engine", "ejs");
// tell express where to find the template files, this expect the templates to live in a folder call views
app.set("views", path.join(__dirname, "./views"));

// this template variables are set during start up of the application
// and available for the whole lifecycle
app.locals.siteName = "ART-INVO";


/* static middleware, routing middlewares, global template variables. */
// all of the static data, telling express we using static data from this folder.
app.use(express.static(path.join(__dirname, "./static")));

app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    // global template variable.
    response.locals.speakerNames = names;
    return next();
  } catch (error) {
    // if use next function we need to use return
    return next(error);
  }
});

// route middlewares. (mounting index with the main route module.)
app.use(
  "/",
  routes({
    feedbackService,
    speakersService,
  })
);

// capture error middleware
// if end up at this last route, means no other route was match or found
app.use((request, response, next) => {
  return next(createError(404, "File not found!"));
});

// real error handler,
// express convention for the error handling function is
// a middleware that takes 4 arguments is the error handling middleware.
// render the correct error template.
app.use((err, request, response, next) => {
  // store the error message in template variable (global in this case).
  response.locals.message = err.message;
  // print the error stacktrace in the console.
  console.log(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  // render error template (need to modify to dynamic else not suffice.).
  response.render("error");
});

// In the end, we have to start the server and tell it where to listen
app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
