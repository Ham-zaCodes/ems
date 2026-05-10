import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Salary from "@/models/Salary";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const salary = await Salary.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(salary);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await Salary.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
