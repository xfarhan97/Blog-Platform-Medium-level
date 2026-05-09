import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();
  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json({ error: "Email taken" }, { status: 409 });

  const user = await User.create({
    name,
    email,
    password,
    role: role === "author" ? "author" : "reader",
  });

  return NextResponse.json(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    { status: 201 }
  );
}
