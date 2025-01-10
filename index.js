// app.js
const express = require("express");
const app = express();
const path = require('node:path');
const passport = require("passport");
const cors = require('cors');


//define routers
const indexRouter = require("./routes/indexRouter");
const postsRouter = require("./routes/postsRouter");
const publicRouter = require("./routes/publicRouter");


require('dotenv').config();

const jwt = require("jsonwebtoken");

//passport stuff
const jwtStrategry  = require("./strategies/jwt")
passport.use(jwtStrategry);

app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));




//index routes
app.use("/", indexRouter);

//posts route
app.use("/api/posts", postsRouter);
//public route
app.use("/api/public", publicRouter);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));