import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Salary from "@/models/Salary";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const employee = searchParams.get("employee") || "";
  const status = searchParams.get("status") || "";

  const query: any = {};
  if (employee) query.employee = employee;
  if (status) query.status = status;

  const total = await Salary.countDocuments(query);
  const salaries = await Salary.find(query)
    .populate("employee", "name email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ year: -1, month: -1 });

  return NextResponse.json({ salaries, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const salary = await Salary.create(body);
  return NextResponse.json(salary, { status: 201 });
}
