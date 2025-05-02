import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ["Researcher", "Lab Technician"] 
  },
  userId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    trim: true 
  },
  gender: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  securityQuestion: { 
    type: String, 
    required: true 
  },
  securityAnswer: { 
    type: String, 
    required: true 
  },
});


export default mongoose.model("User", userSchema);