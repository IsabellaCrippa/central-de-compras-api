import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    contact_email: String,
    user: String,
    pwd: String,
    level: String,
    status: String,
    id: String
  });

export default mongoose.model("User", userSchema);