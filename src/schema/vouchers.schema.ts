import { Schema, model, Document } from "mongoose";

export interface IVoucher extends Document {
  code: string;
  discount: number;
  expirationDate: Date;
  status: "active" | "inactive" | "draft" | "expired";
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
}

export interface RequestVoucher {
  code: string;
  discount: number;
  expirationDate: Date;
  createdBy?: string;
  status: "active" | "inactive" | "draft" | "expired";
}

export const voucherSchema = new Schema<IVoucher>({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "draft", "expired"],
    default: "draft",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const VoucherModel = model<IVoucher>("Voucher", voucherSchema);
