import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome é obrigatório"]
  },
  contact_email: {
    type: String,
    required: [true, "O e-mail de contato é obrigatório"]
  },
  user: {
    type: String,
    required: [true, "O usuário é obrigatório"]
  },
  pwd: {
    type: String,
    required: [true, "A senha é obrigatória"]
  },
  level: {
    type: String,
    required: [true, "O nível é obrigatório"]
  },
  status: {
    type: String,
    required: [true, "O status é obrigatório"]
  }
});

export default mongoose.model("User", userSchema);
