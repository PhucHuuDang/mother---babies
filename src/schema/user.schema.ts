import { Schema, model } from "mongoose";
import { IVoucher, voucherSchema } from "./vouchers.schema";

export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  role: "admin" | "user" | "staff";
  phone?: string;
  avatar?: string;
  password: string;
  points?: number;
  voucher?: IVoucher[];
}

export interface RequestUser {
  email?: string;
  username: string;
  passport?: string;
  phone: string;
  avatar: string;
  role?: "admin" | "user" | "staff";
  points: number;
  voucher: IVoucher[];
}

export const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  phone: { type: String },
  avatar: { type: String },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  voucher: [voucherSchema],
});

export const UserModel = model<IUser>("User", UserSchema);
