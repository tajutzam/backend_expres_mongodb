const { Router } = require("express");
const router = Router();
const todo = require("../../models/todos");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));

router.post("/register", async (req, res) => {
  try {
    const existingUser = await todo.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const todoData = new todo({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    const newRegister = await todoData.save();
    return res.status(201).json({message : 'success registrations'});
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


module.exports = router;
