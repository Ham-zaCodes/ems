import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Department from "@/models/Department";
import Salary from "@/models/Salary";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const [totalEmployees, activeEmployees, totalDepartments, salarySummary] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: "active" }),
    Department.countDocuments(),
    Salary.aggregate([{ $group: { _id: null, total: { $sum: "$amount" }, paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } } } }]),
  ]);

  return NextResponse.json({
    totalEmployees,
    activeEmployees,
    totalDepartments,
    totalSalaryPaid: salarySummary[0]?.paid || 0,
    totalSalary: salarySummary[0]?.total || 0,
  });
}
