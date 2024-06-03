import { Document, Schema, model } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  stoke: number;
  description: string;
  image: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stoke: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
