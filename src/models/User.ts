import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["author", "reader"], default: "reader" },
    avatar: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
