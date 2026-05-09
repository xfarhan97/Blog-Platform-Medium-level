import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Comment } from "@/models/Comment";
import { authOptions } from "../../../auth/[...nextauth]/route";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  await connectDB();
  const comments = await Comment.find({ post: params.id })
    .populate("author", "name avatar")
    .sort({ createdAt: 1 });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { body } = await req.json();
  if (!body) return NextResponse.json({ error: "Missing body" }, { status: 400 });

  await connectDB();
  const comment = await Comment.create({
    post: params.id,
    author: (session.user as any).id,
    body,
  });
  await comment.populate("author", "name avatar");
  return NextResponse.json(comment, { status: 201 });
}
