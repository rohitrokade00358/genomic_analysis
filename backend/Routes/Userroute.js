import express from "express";
import User from "../models/UserSchema.js";
import History from "../models/HistorySchema.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { category, resId, labId, name, email, phoneNumber, gender, password, securityQuestion, securityAnswer } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      category,
      userId: category === "Researcher" ? resId : labId,
      name,
      email,
      phoneNumber,
      gender,
      password: hashedPassword, // Use the hashed password
      securityQuestion,
      securityAnswer,
    });

    console.log("Hashed password during registration:", hashedPassword); //Debuggig

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { category, resId, labId, password } = req.body;
    const userId = category === "Researcher" ? resId : labId;

    console.log("Login attempt:", { userId, category }); // Debugging

    // Find the user
    const user = await User.findOne({ userId, category });
    if (!user) {
      console.log("User not found"); // Debugging
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Stored hashed password:", user.password); // Debugging
    console.log("Input password:", password); // Debugging

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password"); // Debugging
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a new history entry for the login
    const history = new History({
      userId,
      name: user.name,
      phone: user.phoneNumber,
      analysisPreference: "N/A", // Default value, can be updated later
      // loginTime is automatically set to the current timestamp by the schema
    });
    await history.save();

    console.log("History entry created:", history); // Debugging

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, { _id: 0, password: 0 }).sort({ userId: 1 }).lean();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// Fetch user details
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details", error: error.message });
  }
});

// Reset password
router.put("/reset-password", async (req, res) => {
  try {
    const { category, userId, secquestion, answer, password } = req.body;

    // Find the user by category and userId
    const user = await User.findOne({ category, userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate security question
    if (user.securityQuestion !== secquestion) {
      return res.status(400).json({ message: "Invalid security question" });
    }

    // Validate security answer (compare plain text)
    if (user.securityAnswer !== answer) {
      return res.status(400).json({ message: "Invalid security answer" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
});

// Update user details for dashboard
router.put("/user/:userId", async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { name, phoneNumber: phone, email },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Failed to update user details", error: error.message });
  }
});

// Update logout time in history
router.put("/history/logout/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await History.findOneAndUpdate(
      { userId, logoutTime: { $exists: false } }, // Update only if logoutTime is not set
      { logoutTime: Date.now() },
      { new: true }
    );
    res.status(200).json({ message: "Logout time updated successfully" });
  } catch (error) {
    console.error("Error updating logout time:", error);
    res.status(500).json({ message: "Failed to update logout time", error: error.message });
  }
});

// Delete user
router.delete("/user/:userId", async (req, res) => {
  try {
    await User.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

// Log history
router.post("/history", async (req, res) => {
  try {
    const { userId, name, phone, analysisPreference, processTime } = req.body;
    const history = new History({
      userId,
      name,
      phone,
      analysisPreference,
      processTime: new Date(processTime),  // Make sure processTime is stored correctly
    });
    await history.save();
    res.status(201).json({ message: "History logged successfully" });
  } catch (error) {
    console.error("Error logging history:", error);
    res.status(500).json({ message: "Failed to log history", error: error.message });
  }
});


// Fetch history for a specific user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await History.find({ userId }).sort({ loginTime: -1 }); // Fetch history sorted by loginTime
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
});

export default router;