import { Types } from "mongoose";

export type Role = "author" | "reader";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  createdAt: Date;
}

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: Types.ObjectId | IUser;
  status: "draft" | "published";
  likes: Types.ObjectId[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  author: Types.ObjectId | IUser;
  body: string;
  createdAt: Date;
}
