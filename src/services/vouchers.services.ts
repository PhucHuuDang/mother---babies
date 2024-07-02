import { VoucherModel } from "../schema";

export const getAllVouchers = () => VoucherModel.find();

export const getVoucherById = (id: string) => VoucherModel.findById;

export const createVoucher = (values: Record<string, any>) =>
  new VoucherModel(values).save().then((voucher) => voucher.toObject());

export const deleteVoucherById = (id: string) =>
  VoucherModel.findByIdAndDelete({ _id: id });

export const updateVoucherById = (id: string, values: Record<string, any>) =>
  VoucherModel.findByIdAndUpdate(id, values);
