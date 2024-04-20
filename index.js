const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ejs = require("ejs");
dotenv.config();


const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL).then(
  () => console.log("MongoDB connected"),
  (err) => console.log(err)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/loginAPI", require("./routes/api/loginAPI"));
app.use("/api/", require("./routes/api/registerAPI"));
app.use("/api/", require("./routes/api/todosApi"));



app.set("view engine", "ejs");

//static
app.use(express.static("website/Login"));
app.use(express.static("website/Register"));
app.use(express.static("website/mainpage"));
app.use(express.static("website/calendar"));



app.get("/", (req, res) => {
  res.render("index", {
    title: "Login",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
  });
});

app.get("/mainpage", (req, res) => {
  res.render("mainpage", {
    title: "To Do List",
    layout: "mainlayout.ejs",
  });
});

app.get("/calendar", (req, res) => {
  res.render("calendar", {
    title: "Calendar",
    layout: "mainlayout.ejs",
  });
});

app.get("/profile", (req, res) => {
  res.render("profile", {
    title: "Profile",
    layout: "profile.ejs",
  });
});


app.get("/category", (req, res) => {
  res.render("category", {
    title: "category",
    layout: "category.ejs",
  });
});

app.get("/money", (req, res) => {
  res.render("money", {
    title: "money",
    layout: "money.ejs",
  });
});



app.listen(port, () => {
  console.log("Example app");
});
