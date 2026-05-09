import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { authOptions } from "../../auth/[...nextauth]/route";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  await connectDB();
  const post = await Post.findById(params.id).populate("author", "name avatar");
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const post = await Post.findById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.author.toString() !== (session.user as any).id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  Object.assign(post, body);
  await post.save();
  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const post = await Post.findById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.author.toString() !== (session.user as any).id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await post.deleteOne();
  return NextResponse.json({ success: true });
}
