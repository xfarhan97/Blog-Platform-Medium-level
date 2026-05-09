import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import "@/models/User";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug, status: "published" })
    .populate("author", "name avatar")
    .lean() as any;

  if (!post) notFound();

  const comments = await Comment.find({ post: post._id })
    .populate("author", "name avatar")
    .sort({ createdAt: 1 })
    .lean();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const liked = userId ? post.likes.map(String).includes(userId) : false;
  const isAuthor = userId && post.author._id.toString() === userId;

  return (
    <article className="max-w-2xl mx-auto">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="truncate text-gray-600">{post.title}</span>
      </div>

      {/* ── Header ── */}
      <header className="space-y-6 mb-10">
        {post.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((t: string) => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-normal text-[#0f0f0f] leading-[1.15]"
          style={{ fontFamily: "var(--font-serif)" }}>
          {post.title}
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

        {/* Author + meta row */}
        <div className="flex items-center gap-3 py-5 border-y border-[#e8e8e5]">
          <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-semibold text-sm shrink-0">
            {post.author.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{post.author.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="ml-2 text-gray-300">· Updated {new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAuthor && (
              <Link href={`/dashboard/edit/${post._id}`}
                className="btn-outline !py-1.5 !px-3 !text-xs gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            )}
            <LikeButton
              postId={post._id.toString()}
              initialLikes={post.likes.length}
              initialLiked={liked}
              isLoggedIn={!!session}
            />
          </div>
        </div>
      </header>

      {/* ── Cover image ── */}
      {post.coverImage && (
        <div className="relative w-full h-72 sm:h-[440px] rounded-3xl overflow-hidden mb-12">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      {/* ── Content ── */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* ── Footer ── */}
      <div className="mt-14 pt-8 border-t border-[#e8e8e5] flex items-center justify-between">
        <LikeButton
          postId={post._id.toString()}
          initialLikes={post.likes.length}
          initialLiked={liked}
          isLoggedIn={!!session}
        />
        <Link href="/" className="btn-ghost text-xs gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to stories
        </Link>
      </div>

      {/* ── Comments ── */}
      <div className="mt-14">
        <CommentSection
          postId={post._id.toString()}
          initialComments={comments.map((c: any) => ({
            ...c,
            _id: c._id.toString(),
            author: { ...c.author, _id: c.author._id.toString() },
          }))}
          isLoggedIn={!!session}
        />
      </div>
    </article>
  );
}
