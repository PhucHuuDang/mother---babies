import { Schema, model, Document } from "mongoose";

interface IVoucher extends Document {
  code: string;
  discount: number;
  expirationDate: Date;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const voucherSchema = new Schema<IVoucher>({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Voucher = model<IVoucher>("Voucher", voucherSchema);

export default Voucher;
