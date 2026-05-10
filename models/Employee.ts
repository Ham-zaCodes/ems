import mongoose, { Schema } from "mongoose";

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  position: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  joinDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
