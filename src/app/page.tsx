import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import "@/models/User";
import HeroCTA from "@/components/HeroCTA";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60;

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
    </svg>
  );
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const s = size === "md" ? "w-9 h-9 text-sm" : "w-6 h-6 text-[10px]";
  return (
    <div className={`${s} rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-semibold shrink-0`}>
      {name[0].toUpperCase()}
    </div>
  );
}

function PostMeta({ author, date, likes }: { author: string; date: Date; likes: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <Avatar name={author} />
      <span className="font-medium text-gray-600">{author}</span>
      <span className="text-gray-300">·</span>
      <span>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      <span className="ml-auto flex items-center gap-1 text-rose-400">
        <HeartIcon className="w-3 h-3" />
        {likes}
      </span>
    </div>
  );
}

export default async function HomePage() {
  await connectDB();
  const posts = await Post.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .lean() as any[];

  const featured = posts[0];
  const grid = posts.slice(1, 5);
  const remaining = posts.slice(5);

  return (
    <div className="space-y-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] px-8 sm:px-16 py-20 text-white text-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative space-y-5 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 border border-gray-700 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New stories every day
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal leading-[1.1] text-white"
            style={{ fontFamily: "var(--font-serif)" }}>
            Ideas that move<br />
            <em>the world forward</em>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Thoughtful writing on technology, design, culture, and the ideas shaping our future.
          </p>
          <HeroCTA />
        </div>
      </section>

      {posts.length === 0 && <EmptyState />}

      {/* ── Featured ── */}
      {featured && (
        <section id="stories" className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Featured Story</span>
            <div className="flex-1 h-px bg-[#e8e8e5]" />
          </div>
          <Link href={`/blog/${featured.slug}`}>
            <article className="card-hover overflow-hidden group grid sm:grid-cols-5 gap-0">
              {featured.coverImage ? (
                <div className="relative sm:col-span-2 h-56 sm:h-auto overflow-hidden">
                  <Image src={featured.coverImage} alt={featured.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : (
                <div className="sm:col-span-2 h-56 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="sm:col-span-3 p-8 sm:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {featured.tags?.map((t: string) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#0f0f0f] group-hover:text-gray-600 transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                </div>
                <PostMeta author={featured.author.name} date={featured.createdAt} likes={featured.likes.length} />
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* ── Grid ── */}
      {grid.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Latest Stories</span>
            <div className="flex-1 h-px bg-[#e8e8e5]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {grid.map((post: any) => (
              <Link key={post._id.toString()} href={`/blog/${post.slug}`}>
                <article className="card-hover overflow-hidden group flex flex-col h-full">
                  {post.coverImage ? (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={post.coverImage} alt={post.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags?.slice(0, 2).map((t: string) => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <h2 className="font-normal text-lg text-[#0f0f0f] group-hover:text-gray-500 transition-colors leading-snug flex-1"
                      style={{ fontFamily: "var(--font-serif)" }}>
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <PostMeta author={post.author.name} date={post.createdAt} likes={post.likes.length} />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── All remaining stories ── */}
      {remaining.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">All Stories</span>
            <div className="flex-1 h-px bg-[#e8e8e5]" />
            <span className="text-xs text-gray-400">{remaining.length} more</span>
          </div>
          <div className="card divide-y divide-[#e8e8e5]">
            {remaining.map((post: any) => (
              <Link key={post._id.toString()} href={`/blog/${post.slug}`}>
                <article className="flex items-center gap-5 p-5 hover:bg-[#f9f9f8] transition-colors group">
                  {post.coverImage && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-medium text-[#0f0f0f] group-hover:text-gray-500 transition-colors truncate">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{post.author.name}</span>
                      <span>·</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-rose-400 shrink-0">
                    <HeartIcon className="w-3 h-3" />
                    {post.likes.length}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
