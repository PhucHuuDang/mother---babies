import { Schema, model, Document } from "mongoose";
import { IProduct, productSchema } from "./products.schema";

interface IPost extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  productID: IProduct[];
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
  author: { type: Schema.Types.ObjectId, ref: "User" },
  productID: { productSchema },
});

export const PostModel = model<IPost>("Post", postSchema);
