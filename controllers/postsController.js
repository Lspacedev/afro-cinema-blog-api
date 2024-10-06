const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//validation
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 25 characters.";

const commentLengthErr = "must be between 1 and 25 characters.";
const blogLengthErr = "must be between 50 and 1600 characters.";


const validatePost = [
    body("title").trim()
    .isLength({ min: 1, max: 25 }).withMessage(`Title ${lengthErr}`),
    body("text").trim()
    .isLength({ min: 50, max: 1600 }).withMessage(`Text ${blogLengthErr}`),
  
  ];
  const validateUpdatePost = [
    body("title").optional().trim()
    .isLength({ min: 1, max: 25 }).withMessage(`Title ${lengthErr}`),
    body("text").optional().trim()
    .isLength({ min: 50, max: 1600 }).withMessage(`Text ${blogLengthErr}`),
  
  ];

  const validateComment = [
    body("commentText").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Comment ${commentLengthErr}`),
  ]


async function allAuthorPosts (req, res) {
    //return all pub & unpub posts from author
    const user = req.user;
    const posts = await prisma.post.findMany({
        where: {
            authorId: user.id,
          },
    });

    res.send({ posts: posts });
  }

  const createPost = [validatePost ,async (req, res) =>{
    const errors = validationResult(req);
      
    if (!errors.isEmpty()) {
       return res.json({
         errors: errors.array(),
          
        });
      }
    const user = req.user;
    const { title, text } = req.body;
    //return all pub & unpub posts from author
    const post = await prisma.post.create({
        data: {
            title: title,
            text: text,
            author: {
                connect: {
                    id: user.id
                }
            },
        }
    });
    res.send({ message: "Added post" });
  }];

  async function getAuthorPost (req, res) {
    //return specific post
    const { postId } = req.params;
    //return specific post
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    res.send(post)
  }

  const updatePost = [validateUpdatePost, async (req, res) =>{
    const errors = validationResult(req);
      
    if (!errors.isEmpty()) {
       return res.json({
         errors: errors.array(),
          
        });
      }
    const { postId } = req.params;
    const { title, text } = req.body;
  
    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        title: title,
        text: text
      },
    });
    res.send({message:"Updated successfully"});

  }]

  async function deletePost (req, res) {
    const { postId } = req.params;
    const postdelete = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    res.send({message: "Deleted successfully"});

  }

 const addComment = [ validateComment ,async (req, res) => {
  const errors = validationResult(req);
      
  if (!errors.isEmpty()) {
     return res.json({
       errors: errors.array(),
        
      });
    }
    const user = req.user;
    const { postId } = req.params;

    const { commentText } = req.body;
    //return all pub & unpub posts from author
    const comment = await prisma.comment.create({
        data: {
            commentText: commentText,
            post: {
                connect: {
                    id: Number(postId)
                }
            },
            author: {
                connect: {
                    id: user.id
                }
            },
        }
    });
    
    res.send({ posts: "Added comment" });
  }]

  async function publishPost(req, res) {
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
    res.send({message: "Published Post"});

  }
  async function unpublishPost(req, res) {
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
    res.send({message: "Unpublished Post"});

  }

module.exports = {allAuthorPosts, createPost, getAuthorPost, updatePost, deletePost, addComment, publishPost, unpublishPost};