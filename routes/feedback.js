// File that handles routing middlewares.

const express = require("express");

const { check, validationResult } = require("express-validator");

const router = express.Router();

const validation = [
  check("name").trim().isLength({ min: 3 }).escape().withMessage("A name is required"),
  check("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email address is required"),
  check("title").trim().isLength({ min: 3 }).escape().withMessage("A title is required"),
  check("message").trim().isLength({ min: 5 }).escape().withMessage("A message is required"),
];

module.exports = (params) => {
  const { feedbackService } = params;

  // "/" in this case means the route /feedback
  // local template variable value MUST have the same name as the template file in pages folder that we want to render
  // else, in the /layout/index.ejs the template variable won't able to render or find the correct template file in pages folder.
  router.get("/", async (request, response, next) => {
    try {
      const feedbacks = await feedbackService.getList();

      //  check to see session object have error or not
      const errors = request.session.feedback ? request.session.feedback.errors : false;

      // check to see session object have message or not
      const successMessage = request.session.feedback
        ? request.session.feedback.message
        : false;

      // after store errors reset the session
      request.session.feedback = {};

      return response.render("layout", {
        pageTitle: "Feedbacks",
        template: "feedback",
        feedbacks,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });

  // submit any form with POST method to this /feedback route, this post routing handler will be call
  router.post("/", validation, async (request, response, next) => {
    try {
      // validationResult check for errors on the request object.
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
        return response.redirect("/feedback");
      }
      // no errors, data is valid
      // fetch the sanitized data from request.body
      const { name, email, title, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);
      request.session.feedback = {
        message: "Thank you for your feedback!",
      };
      return response.redirect("/feedback");
    } catch (error) {
      return next(error);
    }
  });

  // REST endpoint
  router.post("/api", validation, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.json({ errors: errors.array() });
      }
      const { name, email, title, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return response.json({ feedback, successMessage: "Thank you for your feedback!" });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
