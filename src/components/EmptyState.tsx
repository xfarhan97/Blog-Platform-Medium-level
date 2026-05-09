"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function EmptyState() {
  const { data: session } = useSession();
  const isAuthor = (session?.user as any)?.role === "author";

  const href = session ? (isAuthor ? "/dashboard/new" : "/") : "/register";
  const label = session ? (isAuthor ? "Write the first story" : "No stories yet") : "Be the first author";

  return (
    <div className="text-center py-24 space-y-3">
      <p className="text-4xl">✍️</p>
      <p className="text-gray-500">No stories published yet.</p>
      {(isAuthor || !session) && (
        <Link href={href} className="btn-dark inline-flex mt-2">{label}</Link>
      )}
    </div>
  );
}
