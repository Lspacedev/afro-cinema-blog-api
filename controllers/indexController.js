const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
//validation
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 25 characters.";
const passLengthErr = "must be between 5 and 25 characters.";

const validateSignUp = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`Username ${lengthErr}`),
  body("email").isEmail().withMessage("Not a valid e-mail address"),
  body("password")
    .isLength({ min: 5, max: 25 })
    .withMessage(`Password ${passLengthErr}`),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match with password");
      }
      return true;
    })
    .withMessage("Passwords do not match."),
];

const postSignUpForm = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({
        title: "Sign up",
        errors: errors.array().map((error) => error.msg),
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      return res.status(404).json({ errors: ["Account with username exists"] });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // if err, do something
      if (err) {
        console.error(err);
      }
      // otherwise, store hashedPassword in DB
      try {
        const { username, email, role } = req.body;
        //create user
        const user = await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
          },
        });
        return res.status(201).json({ message: "registration success" });
      } catch (err) {
        return next(err);
      }
    });
  },
];
async function postLoginForm(req, res) {
  try {
    let { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // passwords do not match!
      return res.status(404).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.status(200).json({
      message: "Auth Passed",
      token,
    });
  } catch (err) {
    console.error(err);
  }
}
async function postGuestLoginForm(req, res) {
  try {
    let { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username: "tshepo",
      },
    });

    if (!user) {
      return res.status(401).json({ errors: ["Incorrect username"] });
    }
    const match = await bcrypt.compare("tshepo", user.password);
    if (!match) {
      // passwords do not match!
      return res.status(401).json({ errors: ["Incorrect password"] });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.status(200).json({
      message: "Auth Passed",
      userId: user.id,
      token,
    });
  } catch (err) {
    console.error(err);
  }
}
module.exports = { postSignUpForm, postLoginForm, postGuestLoginForm };
