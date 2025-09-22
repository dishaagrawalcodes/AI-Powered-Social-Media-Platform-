const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Test endpoint
router.get("/test", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ message: "Backend is working!", users: userCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup Endpoint
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize email: lowercase + trim
    email = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user (password still plain for now)
    const newUser = new User({
      name: name.trim(),
      email,
      password
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    res.status(500).json({ message: error.message });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email
    email = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password (plain for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate simple token (in real app, use JWT)
    const token = `token_${user._id}_${Date.now()}`;

    res.json({ token, message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
