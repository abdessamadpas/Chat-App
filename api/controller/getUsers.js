const dotenv = require("dotenv").config();
const User = require("../models/User");

const addUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.username) {
      return res.status(400).json({ message: "Please enter the username" });
    }
    const checkUser = await User.findById(user._id);
    if (checkUser) {
      return rs.status(404).json({
        message: "another user with the same username already exists",
      });
    }
    const newUser = new User(user);
    await newUser.save();
    res.status(201).json({ message: "user created  successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ error });
  }
};

module.exports = { addUser, getUsers };
