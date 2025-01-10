// routes/indexRouter.js
const { Router } = require("express");

const indexController = require("../controllers/indexController");
const indexRouter = Router();
indexRouter.get("/test", (req, res) => {
  res.json({ message: "alive" });
});

indexRouter.post("/sign-up", indexController.postSignUpForm);

indexRouter.post("/log-in", indexController.postLoginForm);
indexRouter.post("/guest-log-in", indexController.postGuestLoginForm);

module.exports = indexRouter;
