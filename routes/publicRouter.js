const { Router } = require("express");
//const postsController = require("../controllers/postsController");
const publicRouter = Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const publicController = require("../controllers/publicController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
//user -normal
publicRouter.get("/posts",authenticate, authorize("ADMIN"), publicController.getPublishedPosts);
publicRouter.get("/posts/:postId",authenticate, authorize("ADMIN"), publicController.getPostById);
  publicRouter.post("/posts/:postId/comments",authenticate, authorize("ADMIN"), publicController.addComment);

  module.exports = publicRouter;