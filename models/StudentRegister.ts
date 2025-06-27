import mongoose from "mongoose";

const StudentRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  // Add other fields as needed
}, { collection: "student_register" });

export default mongoose.models.StudentRegister ||
  mongoose.model("StudentRegister", StudentRegisterSchema);