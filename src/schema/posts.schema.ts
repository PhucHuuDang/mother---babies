import { Schema, model, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  productID: Schema.Types.ObjectId[];
}

export interface RequestPost {
  title: string;
  content: string;
  author?: Schema.Types.ObjectId;
  productID?: Schema.Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productID: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
});

export const PostModel = model<IPost>("Post", postSchema);
