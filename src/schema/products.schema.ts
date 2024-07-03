import { Document, Schema, model } from "mongoose";
import { IReview, reviewSchema } from "./reviews.schema";

export interface IProduct extends Document {
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string[];
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  reviews: IReview[];
  category: Schema.Types.ObjectId;
}

export interface RequestProduct {
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string[];
  createdBy?: Schema.Types.ObjectId;
  category: string;
}

export const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  image: [{ type: String, required: true }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [reviewSchema],
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

export const ProductModel = model<IProduct>("Product", productSchema);
