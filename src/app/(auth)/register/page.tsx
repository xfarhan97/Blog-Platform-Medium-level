"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "reader" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      return setError(data.error);
    }
    router.push("/login");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-[#0f0f0f] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-normal text-[#0f0f0f]" style={{ fontFamily: "var(--font-serif)" }}>
            Join Inkwell
          </h1>
          <p className="text-gray-400 text-sm">Create your free account today</p>
        </div>

        <div className="card p-7 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Full name</label>
              <input placeholder="Jane Doe" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field" required />
            </div>

            {/* Role picker */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">I want to</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "reader", label: "Read stories", icon: "📖" },
                  { value: "author", label: "Write stories", icon: "✍️" },
                ].map((r) => (
                  <button key={r.value} type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border text-sm font-medium transition-all ${
                      form.role === r.value
                        ? "bg-[#0f0f0f] text-white border-[#0f0f0f]"
                        : "bg-white text-gray-600 border-[#e8e8e5] hover:border-gray-300"
                    }`}>
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-xs">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-dark w-full mt-1">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0f0f0f] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
