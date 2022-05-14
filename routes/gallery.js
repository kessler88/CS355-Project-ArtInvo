// File that handles routing middlewares.

const express = require("express");

const router = express.Router();

module.exports = (params) => {
  // speakersService  == params.speakersService
  const { speakersService } = params; // destructring assignment

  router.get("/", async (request, response, next) => {
    try {
      const speakers = await speakersService.getList();
      const artworks = await speakersService.getAllArtwork();
      return response.render("layout", {
        pageTitle: "Gallery",
        template: "gallery",
        speakers,
        artworks,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
