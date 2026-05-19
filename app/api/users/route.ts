import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Department from "@/models/Department"; // ← ADD THIS
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const users = await User.find()
      .select("-password")
      .populate("department", "name") // ← ADD THIS (fetches department name)
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();

    const existing = await User.findOne({ email: body.email });
    if (existing)
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });

    const user = await User.create(body);

    // ← ADD THIS: increment department's employee count
    if (body.department) {
      await Department.findByIdAndUpdate(body.department, {
        $inc: { employeeCount: 1 },
      });
    }

    const { password: _, ...safe } = user.toObject();
    return NextResponse.json(safe, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
