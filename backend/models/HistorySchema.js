import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  analysisPreference: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
  processTime: { type: Date },
});

export default mongoose.model("History", historySchema);