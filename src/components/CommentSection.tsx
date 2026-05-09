"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Comment {
  _id: string;
  body: string;
  author: { name: string };
  createdAt: string;
}

interface Props {
  postId: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
}

export default function CommentSection({ postId, initialComments, isLoggedIn }: Props) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) return router.push("/login");
    setLoading(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setLoading(false);
    if (res.ok) {
      const comment = await res.json();
      setComments([...comments, comment]);
      setBody("");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-normal text-[#0f0f0f]" style={{ fontFamily: "var(--font-serif)" }}>
          Responses
        </h2>
        <span className="text-sm text-gray-400">({comments.length})</span>
        <div className="flex-1 h-px bg-[#e8e8e5]" />
      </div>

      {/* Form */}
      <form onSubmit={submit} className="card p-5 space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={isLoggedIn ? "Share your thoughts on this story…" : "Sign in to leave a response"}
          disabled={!isLoggedIn}
          rows={3}
          className="field resize-none disabled:bg-[#f9f9f8] disabled:cursor-not-allowed"
          required
        />
        <div className="flex items-center justify-between">
          {!isLoggedIn && (
            <p className="text-xs text-gray-400">
              <a href="/login" className="underline text-gray-600">Sign in</a> to respond
            </p>
          )}
          <div className="ml-auto">
            <button type="submit" disabled={!isLoggedIn || loading || !body.trim()} className="btn-dark !py-2 !px-4 !text-xs">
              {loading ? "Posting…" : "Post response"}
            </button>
          </div>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No responses yet. Start the conversation.
          </div>
        )}
        {comments.map((c) => (
          <div key={c._id} className="card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {c.author.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.author.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed pl-11">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
