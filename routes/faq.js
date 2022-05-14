const express = require("express");

const router = express.Router();

module.exports = () => {

    // "/" in this case means the route /faq
    router.get("/", async (request, response, next) => {
      try {
        return response.render("layout", {
          pageTitle: "FAQ",
          template: "faq"
        });
      } catch (error) {
        return next(error);
      }
    });
  

    return router;
  };