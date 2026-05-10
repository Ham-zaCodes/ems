import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Department from "@/models/Department";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const departments = await Department.find().sort({ name: 1 });
  return NextResponse.json(departments);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const dept = await Department.create(body);
  return NextResponse.json(dept, { status: 201 });
}
