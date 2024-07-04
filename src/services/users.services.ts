import { IUser, UserModel } from "../schema";

export const getUsers = async (
  query: string = "",
  page: number = 1,
  limit: number = 10
) => {
  let filter: any = {};
  if (query) {
    const regex = new RegExp(query, "i"); // 'i' để không phân biệt chữ hoa chữ thường
    filter = { $or: [{ email: regex }, { username: regex }] };
  }

  const skip = (page - 1) * limit;
  const users = await UserModel.find(filter)
    .skip(skip)
    .limit(limit)
    .select("-password")
    .lean<IUser[]>();

  const total = await UserModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return { users, totalPages, page, limit };
};

export const getUserByEmail = async (email: string) =>
  await UserModel.findOne({ email });

export const getUserByUsername = async (username: string) =>
  await UserModel.findOne({ username }).select("-password").lean<IUser>();

export const getUserById = async (id: string) =>
  await UserModel.findById(id).select("-password").lean<IUser>();

export const getUserByVoucherId = async (id: string) => {
  const user = await UserModel.find({
    vouchers: { $elemMatch: { _id: id } },
  });

  return user;
};

export const createUser = async (values: Record<string, any>) =>
  await new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = async (id: string) =>
  await UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = async (id: string, values: Record<string, any>) =>
  await UserModel.findByIdAndUpdate(id, values);

export const updatePassword = async (id: string, password: string) => {
  return await UserModel.findByIdAndUpdate(id, { password });
};

export const updatePoints = async (id: string, points: number) => {
  return await UserModel.findByIdAndUpdate(id, { points });
};

export const addReportFromUser = async (
  id: string,
  value: Record<string, any>
) => {
  return await UserModel.findByIdAndUpdate(id, {
    $push: { reports: value },
  });
};

export const updateReportFromUser = async (
  id: string,
  reportId: string,
  value: Record<string, any>
) => {
  return await UserModel.findByIdAndUpdate(
    { _id: id, "reports._id": reportId },
    {
      $set: {
        "reports.$.status": value.status,
        "reports.$.reviewedBy": value.reviewedBy,
        "reports.$.reviewedAt": value.reviewedAt,
      },
    },
    { new: true }
  );
};

export const deleteReportFromUser = async (id: string, reportID: string) => {
  return await UserModel.findByIdAndUpdate(
    id,
    {
      $pull: { reports: { _id: reportID } },
    },
    { new: true }
  );
};

export const addVoucherFromUser = async (
  id: string,
  value: Record<string, any>
) => {
  return await UserModel.findByIdAndUpdate(id, {
    $push: { vouchers: value },
  });
};

export const updateVoucherFromUser = async (
  id: string,
  voucherID: string,
  value: Record<string, any>
) => {
  return await UserModel.findByIdAndUpdate(
    { _id: id, "vouchers._id": voucherID },
    {
      $set: {
        "vouchers.$.code": value.code,
        "vouchers.$.status": value.status,
        "vouchers.$.discount": value.discount,
      },
    },
    { new: true }
  );
};

export const deleteVoucherFromUser = async (id: string, voucherID: string) => {
  return await UserModel.findByIdAndUpdate(
    id,
    {
      $pull: { vouchers: { _id: voucherID } },
    },
    { new: true }
  );
};
