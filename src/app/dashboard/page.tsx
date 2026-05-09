import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import "@/models/User";
import { authOptions } from "@/lib/auth";
import DeletePostButton from "@/components/DeletePostButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "author") redirect("/login");

  await connectDB();
  const posts = await Post.find({ author: (session.user as any).id })
    .sort({ createdAt: -1 })
    .lean() as any[];

  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");
  const totalLikes = posts.reduce((acc, p) => acc + p.likes.length, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Author Dashboard</p>
          <h1 className="text-3xl font-normal text-[#0f0f0f]" style={{ fontFamily: "var(--font-serif)" }}>
            Welcome back, {session.user?.name?.split(" ")[0]}
          </h1>
        </div>
        <Link href="/dashboard/new" className="btn-dark gap-2 self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New story
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total stories", value: posts.length, icon: "📝" },
          { label: "Published", value: published.length, icon: "🌐" },
          { label: "Drafts", value: drafts.length, icon: "📄" },
          { label: "Total likes", value: totalLikes, icon: "❤️" },
        ].map((s) => (
          <div key={s.label} className="card p-5 space-y-2">
            <span className="text-xl">{s.icon}</span>
            <p className="text-2xl font-bold text-[#0f0f0f]">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Published stories ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Published</span>
          <div className="flex-1 h-px bg-[#e8e8e5]" />
          <span className="text-xs text-gray-400">{published.length}</span>
        </div>

        {published.length === 0 ? (
          <div className="card p-10 text-center space-y-3">
            <p className="text-3xl">🌐</p>
            <p className="text-gray-500 text-sm">No published stories yet.</p>
            <Link href="/dashboard/new" className="btn-dark inline-flex text-xs">Write & publish</Link>
          </div>
        ) : (
          <div className="card divide-y divide-[#e8e8e5] overflow-hidden">
            {published.map((post) => (
              <PostRow key={post._id.toString()} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ── Drafts ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Drafts</span>
          <div className="flex-1 h-px bg-[#e8e8e5]" />
          <span className="text-xs text-gray-400">{drafts.length}</span>
        </div>

        {drafts.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400 text-sm">No drafts saved.</p>
          </div>
        ) : (
          <div className="card divide-y divide-[#e8e8e5] overflow-hidden">
            {drafts.map((post) => (
              <PostRow key={post._id.toString()} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PostRow({ post }: { post: any }) {
  return (
    <div className="flex items-center gap-4 p-4 sm:p-5 hover:bg-[#f9f9f8] transition-colors group">
      {/* Thumbnail */}
      {post.coverImage ? (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-xl bg-[#f3f3f1] border border-[#e8e8e5] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-[#0f0f0f] truncate text-sm">{post.title}</p>
          <span className={post.status === "published" ? "badge-published" : "badge-draft"}>
            <span className={`w-1.5 h-1.5 rounded-full ${post.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
            {post.status}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span className="flex items-center gap-1 text-rose-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            {post.likes.length}
          </span>
          {post.tags?.slice(0, 2).map((t: string) => (
            <span key={t} className="tag !text-[10px] !py-0.5">{t}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {post.status === "published" && (
          <Link href={`/blog/${post.slug}`}
            className="btn-ghost !text-xs gap-1.5" target="_blank">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View
          </Link>
        )}
        <Link href={`/dashboard/edit/${post._id}`}
          className="btn-ghost !text-xs gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>
        <DeletePostButton id={post._id.toString()} />
      </div>
    </div>
  );
}
