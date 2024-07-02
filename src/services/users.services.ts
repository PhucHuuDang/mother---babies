import { UserModel } from "../schema";

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
  const users = await UserModel.find(filter).skip(skip).limit(limit);
  const total = await UserModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  console.log(users);

  return { users, totalPages, page, limit };
};

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserById = (id: string) =>
  UserModel.findById(id).select("-password");

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

export const updatePassword = (id: string, password: string) => {
  return UserModel.findByIdAndUpdate(id, { password });
};
