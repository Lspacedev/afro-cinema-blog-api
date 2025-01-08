const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//validation
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const commentLengthErr = "must be between 1 and 25 characters.";

const validateComment = [
  body("commentText")
    .trim()
    //.isAlpha().withMessage(`Comment ${alphaErr}`)
    .isLength({ min: 1, max: 50 })
    .withMessage(`Comment ${commentLengthErr}`),
];

async function getPublishedPosts(req, res) {
  //return all published posts from all authors
  const posts = await prisma.post.findMany({
    where: {
      published: false,
    },
  });

  res.send({ posts: posts });
}
async function getPostById(req, res) {
  const { postId } = req.params;
  //return specific post
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
    include: {
      comments: true,
    },
  });
  res.send({ post: post });
}
const addComment = [
  validateComment,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }
    try {
      //allow user to comment on specific post
      const { postId } = req.params;

      //get username from req / jwt token
      const user = req.user;
      const { commentText } = req.body;
      //get commentText form req.body
      //create comment in prisma
      const comment = await prisma.comment.create({
        data: {
          username: req.user.username,
          commentText: commentText,
          post: {
            connect: {
              id: Number(postId),
            },
          },
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      res.send({ message: "Comment added" });
    } catch (error) {
      console.log(error);
    }
  },
];
module.exports = { getPublishedPosts, getPostById, addComment };
