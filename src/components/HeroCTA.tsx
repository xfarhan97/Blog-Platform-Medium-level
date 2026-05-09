"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeroCTA() {
  const { data: session } = useSession();
  const isAuthor = (session?.user as any)?.role === "author";

  function scrollToStories() {
    const el = document.getElementById("stories");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const btnClass =
    "inline-flex items-center gap-2 bg-white text-[#0f0f0f] px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-gray-100 transition-colors";

  if (session) {
    return (
      <div className="flex items-center justify-center gap-3 pt-2">
        {isAuthor ? (
          <Link href="/dashboard/new" className={btnClass}>
            Write a story
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : (
          <button onClick={scrollToStories} className={btnClass}>
            Browse stories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Link href="/register" className={btnClass}>
        Start reading free
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
      <Link href="/login"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-4 py-3 text-sm transition-colors">
        Sign in
      </Link>
    </div>
  );
}
