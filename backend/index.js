import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/UserRoute.js";
import { connectDB } from './config/db.js';

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api",userRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// MongoDB connection
app.listen(process.env.PORT || 5000, () => {
  connectDB();
  console.log(`Server started at http://localhost:${process.env.PORT || 5000}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});