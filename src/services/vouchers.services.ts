import { IVoucher, VoucherModel } from "../schema";

export const getAllVouchers = async (
  query: string = "",
  page: number = 1,
  limit: number = 10
) => {
  let filter: any = {};
  if (query) {
    const regex = new RegExp(query, "i");
    filter = {
      $or: [{ code: regex }, { discount: regex }, { expirationDate: regex }],
    };

    const skip = (page - 1) * limit;
    const vouchers = await VoucherModel.find(filter)
      .populate("createdBy", "username")
      .skip(skip)
      .limit(limit)
      .lean<IVoucher[]>();

    const total = await VoucherModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return { vouchers, totalPages, page, limit };
  }
};

export const getVoucherById = async (id: string) => {
  const voucher = await VoucherModel.findById(id)
    .populate("createdBy", "username")
    .lean<IVoucher>()
    .exec();
  return voucher;
};

export const getVoucherByCode = async (code: string) => {
  const voucher = await VoucherModel.findOne({ code })
    .populate("createdBy", "username")
    .lean<IVoucher>()
    .exec();
  return voucher;
};

export const createVoucher = async (values: Record<string, any>) =>
  await new VoucherModel(values).save().then((voucher) => voucher.toObject());

export const deleteVoucherById = async (id: string) =>
  await VoucherModel.findByIdAndDelete({ _id: id });

export const updateVoucherById = async (
  id: string,
  values: Record<string, any>
) => await VoucherModel.findByIdAndUpdate(id, values);
