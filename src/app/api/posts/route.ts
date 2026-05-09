import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import slugify from "slugify";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "published";
  const authorId = searchParams.get("author");

  const filter: any = { status };
  if (authorId) filter.author = authorId;

  const posts = await Post.find(filter)
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "author")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, content, excerpt, coverImage, tags, status } = await req.json();
  if (!title || !content || !excerpt)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();
  const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();

  const post = await Post.create({
    title,
    slug,
    content,
    excerpt,
    coverImage,
    tags: tags || [],
    status: status || "draft",
    author: (session.user as any).id,
  });

  return NextResponse.json(post, { status: 201 });
}
