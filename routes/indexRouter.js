// routes/indexRouter.js
const { Router } = require("express");


const indexController = require("../controllers/indexController");
const indexRouter = Router();


indexRouter.post("/sign-up", indexController.postSignUpForm);



indexRouter.post("/log-in", indexController.postLoginForm);
















// indexRouter.get("/log-out", (req, res, next) => {
//     req.logout((err) => {
//       if (err) {
//         return next(err);
//       }
//       res.redirect("/");
//     });
//   });





module.exports = indexRouter;