"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
}

export default function LikeButton({ postId, initialLikes, initialLiked, isLoggedIn }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [pop, setPop] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (!isLoggedIn) return router.push("/login");
    setPop(true);
    setTimeout(() => setPop(false), 400);
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    const data = await res.json();
    setLikes(data.likes);
    setLiked(data.liked);
  }

  return (
    <button onClick={toggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-medium transition-all duration-200 ${
        liked
          ? "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"
          : "bg-white border-[#e8e8e5] text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}>
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${pop ? "scale-150" : "scale-100"}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {likes} {likes === 1 ? "like" : "likes"}
    </button>
  );
}
