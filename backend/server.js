import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER STARTED");


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);


const applicationSchema = new mongoose.Schema({
  userId: String,
  jobTitle: String,
  status: {
    type: String,
    default: "Pending",
  },
});

const Application = mongoose.model("Application", applicationSchema);


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


app.post("/api/applications/apply", async (req, res) => {
  try {
    const { userId, jobTitle } = req.body;

    const newApplication = new Application({
      userId,
      jobTitle,
    });

    await newApplication.save();

    res.status(200).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.log("Apply Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/applications/:userId", async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.params.userId,
    });

    res.status(200).json(applications);
  } catch (error) {
    console.log("Fetch Applications Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});




