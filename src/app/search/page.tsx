import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || "";
  let posts: any[] = [];

  if (q) {
    await connectDB();
    posts = await Post.find(
      { $text: { $search: q }, status: "published" },
      { score: { $meta: "textScore" } }
    )
      .populate("author", "name")
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Search</p>
        <h1 className="text-3xl font-normal text-[#0f0f0f]" style={{ fontFamily: "var(--font-serif)" }}>
          {q ? `Results for "${q}"` : "Find stories"}
        </h1>
        {q && (
          <p className="text-gray-400 text-sm">
            {posts.length} {posts.length === 1 ? "story" : "stories"} found
          </p>
        )}
      </div>

      {q && posts.length === 0 && (
        <div className="card p-14 text-center space-y-3">
          <p className="text-3xl">🔍</p>
          <p className="text-gray-500">No stories found for &quot;{q}&quot;</p>
          <p className="text-gray-400 text-sm">Try different keywords or browse all stories</p>
          <Link href="/" className="btn-outline inline-flex mt-2 text-xs">Browse all</Link>
        </div>
      )}

      {posts.length > 0 && (
        <div className="card divide-y divide-[#e8e8e5] overflow-hidden">
          {posts.map((post: any) => (
            <Link key={post._id.toString()} href={`/blog/${post.slug}`}>
              <article className="flex items-center gap-4 p-5 hover:bg-[#f9f9f8] transition-colors group">
                {post.coverImage && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex gap-1.5 flex-wrap">
                    {post.tags?.slice(0, 2).map((t: string) => (
                      <span key={t} className="tag !text-[10px] !py-0.5">{t}</span>
                    ))}
                  </div>
                  <h2 className="font-semibold text-[#0f0f0f] group-hover:text-gray-500 transition-colors truncate text-sm">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-xs truncate">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
