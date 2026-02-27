import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER STARTED");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ================= USER MODEL =================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

// ================= REGISTER =================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= APPLY =================
app.post("/api/applications/apply", (req, res) => {
  console.log("Apply route hit");
  console.log(req.body);

  res.status(200).json({
    message: "Application submitted successfully",
  });
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});





