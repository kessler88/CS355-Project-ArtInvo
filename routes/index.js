// File that handles routing middlewares.

// modules
const express = require("express");

// routes modules that need to be mounted in this main route module.
const speakersRoutes = require("./speakers");
const feedbackRoutes = require("./feedback");
const faqRoutes = require("./faq");
const galleryRoutes = require("./gallery");

const router = express.Router();

// params is use to collect the service objects
module.exports = (params) => {
  // take speakersService obj of params.
  const { speakersService } = params;

  /* Routing handlers */
  /* 
    Since we already tell express where to look for views in which folder (./views).
    render function 1st argument is for the path to a template,
    and since we set the template file type to be .ejs
    express will automatically look into ./views to find the matching template file in /layout folder
    also 2nd argument in render() which accepts an object that contain local variables that will be available to this template.
 *//* 
    "/" in this case means localhost:3000/
    local template variable value MUST have the same name as the template file in pages folder that we want to render
    else, in the /layout/index.ejs the template variable won't able to render or find the correct template file in pages folder. 
  */
  router.get("/", async (request, response, next) => {
    try {
      const topSpeakers = await speakersService.getList();
      const artworks = await speakersService.getAllArtwork();
      return response.render("layout", {
        pageTitle: "Welcome",
        template: "index",
        topSpeakers,
        artworks,
      });
    } catch (error) {
      // next function need to use with return
      return next(error);
    }
  });

  // Mount the .speaker and .feedback w/ routing handlers in main route module.
  // pass the services objects to speakers and feedback routes
  // when on /speaker route use speakersRoutes, when on /feedback route use feedbackRoutes
  router.use("/speakers", speakersRoutes(params));
  router.use("/feedback", feedbackRoutes(params));
  router.use("/faq", faqRoutes());
  router.use("/gallery", galleryRoutes(params));

  return router;
};
