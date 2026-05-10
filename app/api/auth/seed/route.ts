import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Department from "@/models/Department";
import Employee from "@/models/Employee";

async function seed() {
  await connectDB();
  const existing = await User.findOne({ email: "admin@ems.com" });
  if (existing) return { message: "Already seeded. Login: admin@ems.com / admin123" };

  await User.create({ name: "Admin", email: "admin@ems.com", password: "admin123", role: "admin" });

  const depts = await Department.insertMany([
    { name: "Engineering", description: "Software development" },
    { name: "HR", description: "Human resources" },
    { name: "Finance", description: "Finance and accounting" },
    { name: "Marketing", description: "Marketing and sales" },
  ]);

  await Employee.insertMany([
    { name: "Alice Johnson", email: "alice@ems.com", phone: "1234567890", position: "Senior Developer", department: depts[0]._id, joinDate: new Date("2022-01-15") },
    { name: "Bob Smith", email: "bob@ems.com", phone: "0987654321", position: "HR Manager", department: depts[1]._id, joinDate: new Date("2021-06-01") },
    { name: "Carol White", email: "carol@ems.com", phone: "1122334455", position: "Accountant", department: depts[2]._id, joinDate: new Date("2023-03-10") },
  ]);

  return { message: "Seeded successfully. Login: admin@ems.com / admin123" };
}

export async function GET() {
  const result = await seed();
  return NextResponse.json(result);
}

export async function POST() {
  const result = await seed();
  return NextResponse.json(result);
}
