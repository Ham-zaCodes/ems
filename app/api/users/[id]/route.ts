import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Department from "@/models/Department";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();

    const user = await User.findById(params.id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Decrement department count before deleting
    if (user.department) {
      await Department.findByIdAndUpdate(user.department, {
        $inc: { employeeCount: -1 },
      });
    }

    await user.deleteOne();
    return NextResponse.json({ message: "User deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
