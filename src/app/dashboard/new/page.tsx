import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import PostForm from "@/components/PostForm";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "author") redirect("/login");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard"
          className="btn-ghost gap-1.5 !px-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </Link>
        <div className="h-4 w-px bg-[#e8e8e5]" />
        <p className="text-sm text-gray-400">New story</p>
      </div>
      <PostForm />
    </div>
  );
}
