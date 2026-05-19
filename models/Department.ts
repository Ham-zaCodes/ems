import mongoose, { Schema } from "mongoose";

const DepartmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  employeeCount: { type: Number, default: 0 }, // ← ADD THIS
}, { timestamps: true });

export default mongoose.models.Department || mongoose.model("Department", DepartmentSchema);
