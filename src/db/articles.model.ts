import { Schema, model, Document } from "mongoose";

interface IArticle extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags: string[];
  recommendedProducts: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }],
  recommendedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Article = model<IArticle>("Article", articleSchema);

export default Article;
