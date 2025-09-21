const express = require("express");
const router = express.Router();

// Simple in-memory storage for demo purposes
let users = [];

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Backend is working!", users: users.length });
});

// Signup Endpoint
router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Create new user (in real app, hash password)
    const newUser = {
      id: Date.now(),
      name,
      email,
      password // In real app, this should be hashed
    };
    
    users.push(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Endpoint
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check password (in real app, compare hashed password)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate simple token (in real app, use JWT)
    const token = `token_${user.id}_${Date.now()}`;
    
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;