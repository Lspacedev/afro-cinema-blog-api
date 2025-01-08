const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../config/supabase");
const { decode } = require("base64-arraybuffer");
const { v4: uuidv4 } = require("uuid");

//validation
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 25 characters.";

const commentLengthErr = "must be between 1 and 25 characters.";
const blogLengthErr = "must be between 50 and 1600 characters.";

const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Title ${lengthErr}`),
  body("text")
    .trim()
    .isLength({ min: 50, max: 1600 })
    .withMessage(`Text ${blogLengthErr}`),
];
const validateUpdatePost = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Title ${lengthErr}`),
  body("text")
    .optional()
    .trim()
    .isLength({ min: 50, max: 1600 })
    .withMessage(`Text ${blogLengthErr}`),
];

const validateComment = [
  body("commentText")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Comment ${commentLengthErr}`),
];

async function allAuthorPosts(req, res) {
  try {
    //return all pub & unpub posts from author
    const user = req.user;
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
    });

    res.send({ posts: posts });
  } catch (error) {
    console.log(error);
  }
}

const createPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    try {
      const user = req.user;
      const { title, text } = req.body;
      let postImageUrl = "";
      if (typeof req.file !== "undefined") {
        const fileBase64 = decode(req.file.buffer.toString("base64"));

        const { data, error } = await supabase.storage
          .from("afro-cinema-blog")
          .upload(
            `public/${req.user.id}/` + uuidv4() + req.file.originalname,
            fileBase64,
            {
              cacheControl: "5",
              upsert: true,
              contentType: req.file.mimetype,
            }
          );
        if (error) {
          console.log(error);
          return res.status(404).json({ error: error.message });
        } else {
          postImageUrl = supabase.storage
            .from("afro-cinema-blog")
            .getPublicUrl(data.path).data.publicUrl;
          console.log({ data, error });
        }
      }
      const post = await prisma.post.create({
        data: {
          title: title,
          text: text,
          imageUrl: postImageUrl,
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      res.send({ message: "Added post" });
    } catch (error) {
      console.log(error);
      res.send({ errors: ["An error occured while creating post"] });
    }
  },
];

async function getAuthorPost(req, res) {
  try {
    //return specific post
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
    res.send(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({ errors: ["An error occured while getting post"] });
  }
}

const updatePost = [
  validateUpdatePost,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }
    try {
      const { postId } = req.params;
      const { title, text } = req.body;

      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
      });
      let newPost = {};
      let isUpdate = false;

      let postImageUrl = "";
      if (typeof req.file !== "undefined") {
        const fileBase64 = decode(req.file.buffer.toString("base64"));
        const id = uuidv4();
        if (post.imageUrl !== null) {
          const fileToReplace = post.imageUrl.substring(
            post.imageUrl.lastIndexOf("/") + 1
          );

          await supabase.storage
            .from("afro-cinema-blog")
            .move(
              `public/${req.user.id}/` + fileToReplace,
              `public/${req.user.id}/` + id + req.file.originalname
            );
        }
        const { data, error } = await supabase.storage
          .from("afro-cinema-blog")
          .upload(
            `public/${req.user.id}/` + id + req.file.originalname,
            fileBase64,
            {
              cacheControl: "5",
              upsert: true,
              contentType: req.file.mimetype,
            }
          );
        console.log({ data, error });

        if (error) {
          console.log(error);
          return res.status(404).json({ error: error.message });
        } else {
          postImageUrl = supabase.storage
            .from("afro-cinema-blog")
            .getPublicUrl(data.path).data.publicUrl;
          console.log({ data, error });
        }
      }

      if (title !== "") {
        isUpdate = true;
        newPost.title = title;
      }

      if (text !== "") {
        isUpdate = true;
        newPost.text = text;
      }

      if (postImageUrl !== "") {
        isUpdate = true;
        newPost.imageUrl = postImageUrl;
      }

      if (isUpdate) {
        const post = await prisma.post.update({
          where: {
            id: Number(postId),
          },
          data: newPost,
        });
        res.send({ message: "Updated successfully" });
      } else {
        res.send({ message: "Nothing to update" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .json({ errors: ["An error occured while updating post"] });
    }
  },
];

async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (post.imageUrl !== null) {
      const filename = post.imageUrl.substring(
        post.imageUrl.lastIndexOf("/") + 1
      );
      console.log({ filename });

      const { data, error } = await supabase.storage
        .from("afro-cinema-blog")
        .remove([`public/${req.user.id}/` + filename]);
    }
    const postdelete = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    res.send({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ errors: ["An error occured while deleting post"] });
  }
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
      const user = req.user;
      const { postId } = req.params;

      const { commentText } = req.body;
      //return all pub & unpub posts from author
      const comment = await prisma.comment.create({
        data: {
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

      res.send({ posts: "Added comment" });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .json({ errors: ["An error occured while adding comment"] });
    }
  },
];

async function publishPost(req, res) {
  try {
    const { postId } = req.params;
    const { publish } = req.body;

    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        published: publish,
      },
    });
    res.send({ message: "Published Post" });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ errors: ["An error occured while publishing post"] });
  }
}
async function unpublishPost(req, res) {
  try {
    const { postId } = req.params;
    const { publish } = req.body;

    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        published: publish,
      },
    });
    res.send({ message: "Unpublished Post" });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ errors: ["An error occured while unpublishing post"] });
  }
}

module.exports = {
  allAuthorPosts,
  createPost,
  getAuthorPost,
  updatePost,
  deletePost,
  addComment,
  publishPost,
  unpublishPost,
};
