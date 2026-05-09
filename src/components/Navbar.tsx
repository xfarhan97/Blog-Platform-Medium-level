"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isAuthor = (session?.user as any)?.role === "author";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e8e8e5]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-[60px] flex items-center gap-5">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5 mr-auto">
          <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <span className="text-[1.1rem] font-semibold tracking-tight text-[#0f0f0f]"
            style={{ fontFamily: "var(--font-serif)" }}>
            Inkwell
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-sm transition-all duration-200 ${
            focused ? "border-gray-400 bg-white shadow-sm w-56" : "border-[#e8e8e5] bg-[#f9f9f8] w-48"
          }`}>
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search stories…"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none w-full text-sm"
          />
        </form>

        {/* Actions */}
        {session ? (
          <div className="flex items-center gap-2">
            {isAuthor && (
              <Link href="/dashboard/new"
                className="hidden sm:flex btn-dark !py-2 !px-4 text-xs gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Write
              </Link>
            )}

            {/* Avatar dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center text-xs font-bold hover:opacity-80 transition-opacity"
              >
                {session.user?.name?.[0]?.toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-52 card shadow-xl border border-[#e8e8e5] py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-[#e8e8e5]">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                  </div>
                  {isAuthor && (
                    <>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link href="/dashboard/new" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        New story
                      </Link>
                    </>
                  )}
                  <div className="border-t border-[#e8e8e5] mt-1 pt-1">
                    <button onClick={() => { signOut(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost text-sm font-medium">Sign in</Link>
            <Link href="/register" className="btn-dark !py-2 !px-4 text-xs">Get started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
