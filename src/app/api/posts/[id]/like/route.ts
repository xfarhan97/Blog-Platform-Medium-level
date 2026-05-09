import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { authOptions } from "../../../auth/[...nextauth]/route";

type Params = { params: { id: string } };

export async function POST(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const userId = (session.user as any).id;
  const post = await Post.findById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const liked = post.likes.map(String).includes(userId);
  if (liked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return NextResponse.json({ likes: post.likes.length, liked: !liked });
}
