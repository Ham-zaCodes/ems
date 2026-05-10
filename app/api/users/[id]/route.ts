import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const { name, email, role, password } = await req.json();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    user.name = name;
    user.email = email;
    user.role = role;
    if (password) user.password = password; // pre-save hook will hash it
    await user.save();
    const { password: _, ...safe } = user.toObject();
    return NextResponse.json(safe);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await connectDB();
    const { id } = await params;
    if (session.id === id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
