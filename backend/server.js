import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
mongoose.set("bufferCommands", false);

app.use(cors());
app.use(express.json());

console.log("SERVER STARTED");

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Add it to backend/.env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));


if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


app.use("/uploads", express.static("uploads"));


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: {
    type: String,
    default: ""
  },
  password: String,
  role: {
    type: String,
    default: "student"
  }
});

const User = mongoose.model("User", userSchema);


const internshipSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  companyId: String,
  companyName: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Internship = mongoose.model("Internship", internshipSchema);


const applicationSchema = new mongoose.Schema({
  userId: String,
  internshipId: String,
  jobTitle: String,
  phone: String,
  resumeFile: String,
  coverLetterFile: String,
  status: {
    type: String,
    default: "Pending"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model("Application", applicationSchema);

const isAdminUser = async (adminId) => {
  if (!adminId) return false;
  const adminUser = await User.findById(adminId);
  return adminUser?.role === "admin";
};



app.post("/api/auth/register", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and try again."
      });
    }

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
    res.status(500).json({ message: "Server error while registering user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and try again."
      });
    }

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
      user
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error while logging in" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and try again."
      });
    }

    const { name, email, phone, password } = req.body;
    const userId = req.params.id;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use by another account" });
    }

    const updateData = { name, email, phone: phone || "" };
    if (password) {
      updateData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});



app.get("/api/internships", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (error) {
    console.log("Fetch Internships Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/internships", async (req, res) => {
  try {
    const { title, location, description, companyId, companyName } = req.body;

    if (!title || !location || !description || !companyId) {
      return res.status(400).json({ message: "Title, location, description and company are required" });
    }

    const newInternship = new Internship({
      title,
      location,
      description,
      companyId,
      companyName: companyName || "Company"
    });

    await newInternship.save();

    res.status(200).json({
      message: "Internship added successfully"
    });

  } catch (error) {
    console.log("Add Internship Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/company/:companyId/internships", async (req, res) => {
  try {
    const internships = await Internship.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    console.log("Fetch Company Internships Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/internships/:id", async (req, res) => {
  try {
    const { title, location, description, companyId } = req.body;
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.companyId !== companyId) {
      return res.status(403).json({ message: "You can only edit your own internships" });
    }

    internship.title = title || internship.title;
    internship.location = location || internship.location;
    internship.description = description || internship.description;
    internship.updatedAt = new Date();
    await internship.save();

    res.status(200).json({ message: "Internship updated successfully", internship });
  } catch (error) {
    console.log("Update Internship Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/internships/:id", async (req, res) => {
  try {
    const { companyId } = req.body;
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.companyId !== companyId) {
      return res.status(403).json({ message: "You can only delete your own internships" });
    }

    await Application.deleteMany({ internshipId: internship._id.toString() });
    await internship.deleteOne();

    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (error) {
    console.log("Delete Internship Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



app.post(
  "/api/applications/apply",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { userId, internshipId, jobTitle, phone } = req.body;

      if (!req.files.resume || !req.files.coverLetter) {
        return res.status(400).json({
          message: "Resume and Cover Letter are required"
        });
      }

      const newApplication = new Application({
        userId,
        internshipId,
        jobTitle,
        phone,
        resumeFile: req.files.resume[0].filename,
        coverLetterFile: req.files.coverLetter[0].filename
      });

      await newApplication.save();

      res.status(200).json({
        message: "Application submitted successfully"
      });

    } catch (error) {
      console.log("Apply Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);



app.get("/api/applications/:userId", async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.params.userId
    });

    res.status(200).json(applications);

  } catch (error) {
    console.log("Fetch Applications Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/company/:companyId/applications", async (req, res) => {
  try {
    const companyInternships = await Internship.find({ companyId: req.params.companyId }, "_id title");
    const internshipIds = companyInternships.map((item) => item._id.toString());

    if (internshipIds.length === 0) {
      return res.status(200).json([]);
    }

    const applications = await Application.find({ internshipId: { $in: internshipIds } }).sort({ appliedAt: -1 });
    const users = await User.find({}, "_id name email");

    const userMap = new Map(users.map((item) => [item._id.toString(), item]));
    const internshipMap = new Map(companyInternships.map((item) => [item._id.toString(), item.title]));

    const enrichedApplications = applications.map((application) => {
      const applicant = userMap.get(application.userId);
      return {
        ...application.toObject(),
        internshipTitle: internshipMap.get(application.internshipId) || application.jobTitle,
        applicantName: applicant?.name || "Unknown",
        applicantEmail: applicant?.email || "Unknown"
      };
    });

    res.status(200).json(enrichedApplications);
  } catch (error) {
    console.log("Fetch Company Applications Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/applications/:id/status", async (req, res) => {
  try {
    const { companyId, status } = req.body;
    const allowedStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const internship = await Internship.findById(application.internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.companyId !== companyId) {
      return res.status(403).json({ message: "You can only manage applications for your internships" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: "Application status updated", application });
  } catch (error) {
    console.log("Update Application Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!(await isAdminUser(adminId))) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const users = await User.find().sort({ name: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.log("Fetch Admin Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/admin/users/:id/role", async (req, res) => {
  try {
    const { adminId, role } = req.body;
    if (!(await isAdminUser(adminId))) {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (!["student", "company", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    console.log("Update User Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!(await isAdminUser(adminId))) {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (req.params.id === adminId) {
      return res.status(400).json({ message: "Admin cannot delete own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "student") {
      await Application.deleteMany({ userId: req.params.id });
    }

    if (user.role === "company") {
      const companyInternships = await Internship.find({ companyId: req.params.id }, "_id");
      const internshipIds = companyInternships.map((item) => item._id.toString());
      if (internshipIds.length > 0) {
        await Application.deleteMany({ internshipId: { $in: internshipIds } });
      }
      await Internship.deleteMany({ companyId: req.params.id });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin/internships", async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!(await isAdminUser(adminId))) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const internships = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    console.log("Fetch Admin Internships Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/admin/internships/:id", async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!(await isAdminUser(adminId))) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    await Application.deleteMany({ internshipId: internship._id.toString() });
    await internship.deleteOne();
    res.status(200).json({ message: "Internship removed successfully" });
  } catch (error) {
    console.log("Admin Delete Internship Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/", (req, res) => {
  res.send("Backend running...");
});

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



