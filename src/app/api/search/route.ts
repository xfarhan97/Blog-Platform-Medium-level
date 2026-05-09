import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q) return NextResponse.json([]);

  await connectDB();
  const posts = await Post.find(
    { $text: { $search: q }, status: "published" },
    { score: { $meta: "textScore" } }
  )
    .populate("author", "name")
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();

  return NextResponse.json(posts);
}
