// File that handles routing middlewares.

const express = require("express");

const router = express.Router();

module.exports = (params) => {
  // speakersService  == params.speakersService
  const { speakersService } = params; // destructring assignment

  // "/" in this case means the route /speakers
  // .getList() is a asyn method so have to await it.
  // when we await a function in another function, we have to make this function async
  // local template variable value MUST have the same name as the template file in pages folder that we want to render
  // else, in the /layout/index.ejs the template variable won't able to render or find the correct template file in pages folder.
  router.get("/", async (request, response, next) => {
    try {
      const speakers = await speakersService.getList();
      const artworks = await speakersService.getAllArtwork();
      return response.render("layout", {
        pageTitle: "Speakers",
        template: "speakers",
        speakers,
        artworks,
      });
    } catch (error) {
      return next(error);
    }
  });

  // parameter route, this matches /speakers/"short name"
  // in order to get these parameter shortname, this come with the request object
  // request.params.shortname ==> the shortname in this url param: /speakers/shortname
  router.get("/:shortname", async (request, response, next) => {
    try {
      const speaker = await speakersService.getSpeaker(request.params.shortname);
      const artworks = await speakersService.getArtworkForSpeaker(request.params.shortname);
      return response.render("layout", {
        pageTitle: "Speakers",
        template: "speakers-detail",
        speaker,
        artworks,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
