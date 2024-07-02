import { Schema, model, Document } from "mongoose";

export interface IVoucher extends Document {
  code: string;
  discount: number;
  expirationDate: Date;
  createdBy: Schema.Types.ObjectId;
}

export const voucherSchema = new Schema<IVoucher>({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const VoucherModel = model<IVoucher>("Voucher", voucherSchema);
