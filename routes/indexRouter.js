// routes/indexRouter.js
const { Router } = require("express");

const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.post("/sign-up", indexController.postSignUpForm);

indexRouter.post("/log-in", indexController.postLoginForm);

module.exports = indexRouter;
