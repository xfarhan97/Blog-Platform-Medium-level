import mongoose, { Schema, models } from "mongoose";
import { IPost } from "@/types";

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [String],
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", excerpt: "text", tags: "text" });

export const Post = models.Post || mongoose.model<IPost>("Post", PostSchema);
