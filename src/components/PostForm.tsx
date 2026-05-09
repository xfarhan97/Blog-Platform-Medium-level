"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface Props {
  initial?: {
    _id?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    tags?: string[];
    status?: string;
  };
}

export default function PostForm({ initial = {} }: Props) {
  const router = useRouter();
  const isEdit = !!initial._id;
  const [form, setForm] = useState({
    title: initial.title || "",
    excerpt: initial.excerpt || "",
    content: initial.content || "",
    coverImage: initial.coverImage || "",
    tags: initial.tags?.join(", ") || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    return data.url as string;
  }

  async function handleSubmit(status: string) {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.excerpt.trim()) return setError("Excerpt is required.");
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
    };
    const url = isEdit ? `/api/posts/${initial._id}` : "/api/posts";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      return setError(d.error);
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1">
        <textarea
          placeholder="Your story title…"
          value={form.title}
          onChange={(e) => { setForm({ ...form, title: e.target.value }); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
          rows={1}
          className="w-full bg-transparent border-none outline-none resize-none text-3xl sm:text-4xl font-normal text-[#0f0f0f] placeholder-gray-200 leading-tight overflow-hidden"
          style={{ fontFamily: "var(--font-serif)" }}
        />
        <div className="h-px bg-[#e8e8e5]" />
      </div>

      {/* Excerpt */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Excerpt</label>
        <textarea
          placeholder="A short description to hook your readers…"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="field resize-none"
        />
      </div>

      {/* Cover image */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Cover Image</label>
        <div className="flex gap-2">
          <input
            placeholder="Paste image URL…"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="field flex-1"
          />
          <label className={`btn-outline cursor-pointer shrink-0 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {uploading ? "Uploading…" : "Upload"}
            <input type="file" accept="image/*" className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, coverImage: await uploadImage(file) });
              }} />
          </label>
        </div>
        {form.coverImage && (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-[#e8e8e5]">
            <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setForm({ ...form, coverImage: "" })}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Tags</label>
        <input
          placeholder="technology, design, culture…"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="field"
        />
        {form.tags && (
          <div className="flex gap-1.5 flex-wrap pt-1">
            {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Content</label>
        <RichEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#e8e8e5]">
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={() => handleSubmit("draft")} disabled={saving} className="btn-outline">
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button type="button" onClick={() => handleSubmit("published")} disabled={saving} className="btn-dark">
            {saving ? "Publishing…" : isEdit ? "Update & publish" : "Publish story"}
          </button>
        </div>
      </div>
    </div>
  );
}
