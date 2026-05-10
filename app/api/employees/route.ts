import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const department = searchParams.get("department") || "";
  const status = searchParams.get("status") || "";

  const query: any = {};
  if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { position: { $regex: search, $options: "i" } }];
  if (department) query.department = department;
  if (status) query.status = status;

  const total = await Employee.countDocuments(query);
  const employees = await Employee.find(query)
    .populate("department", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return NextResponse.json({ employees, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const employee = await Employee.create(body);
  return NextResponse.json(employee, { status: 201 });
}
