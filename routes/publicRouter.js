const { Router } = require("express");
//const postsController = require("../controllers/postsController");
const publicRouter = Router();

const publicController = require("../controllers/publicController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
//user -normal
publicRouter.get("/posts", publicController.getPublishedPosts);
publicRouter.get("/posts/:postId", publicController.getPostById);
publicRouter.post(
  "/posts/:postId/comments",
  authenticate,
  publicController.addComment
);

module.exports = publicRouter;
