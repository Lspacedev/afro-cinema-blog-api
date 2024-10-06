const { Router } = require("express");
const postsController = require("../controllers/postsController");
const postsRouter = Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

  //user - admin
postsRouter.get("/",authenticate, authorize("ADMIN"), postsController.allAuthorPosts);
postsRouter.post("/",authenticate, authorize("ADMIN"), postsController.createPost);
postsRouter.get("/:postId", authenticate, authorize("ADMIN"), postsController.getAuthorPost);
postsRouter.put("/:postId", authenticate, authorize("ADMIN"), postsController.updatePost);
postsRouter.put("/:postId/publish", authenticate, authorize("ADMIN"), postsController.publishPost);
postsRouter.put("/:postId/unpublish", authenticate, authorize("ADMIN"), postsController.unpublishPost);
postsRouter.delete("/:postId", authenticate, authorize("ADMIN"), postsController.deletePost)
postsRouter.post("/:postId/comments",authenticate, authorize("ADMIN"), postsController.addComment);

module.exports = postsRouter;