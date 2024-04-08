const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const Blog = require("./models/blog");
const blogRoute = require("./routes/blog");

const {checkForAuthenticationCookie, } = require("./middlewares/authentication");

const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("MonngoDB connected"));
app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({})
  res.render("home",{
    user:req.user,
    blogs:allBlogs
  })
});

// app.get("/", (req, res) => {
//   res.render("home", { user: req.user });
// });

// app.get("/", (req, res) => {
//   res.render("home");
// });

app.use("/user", userRoute);

app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
