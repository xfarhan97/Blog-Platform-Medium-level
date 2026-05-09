import mongoose, { Schema, models } from "mongoose";
import { IComment } from "@/types";

const CommentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
