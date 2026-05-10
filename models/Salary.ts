import mongoose, { Schema } from "mongoose";

const SalarySchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  status: { type: String, enum: ["paid", "pending"], default: "pending" },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Salary || mongoose.model("Salary", SalarySchema);
