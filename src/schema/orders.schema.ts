import { Schema, model, Document } from "mongoose";
import { IProduct, productSchema } from "./products.schema";

interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  products: IProduct[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "transfer" | "online";
  isOrder: boolean;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: { productSchema },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  isOrder: { type: Boolean, required: true },
});

export const OrderModel = model<IOrder>("Order", orderSchema);
