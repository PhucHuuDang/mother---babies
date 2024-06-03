import { Document, Schema, model } from "mongoose";

interface IAuthentication {
  password: string;
  salt?: string;
  sessionToken?: string;
}

interface IUser extends Document {
  username: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  authentication: IAuthentication;
}

const AuthenticationSchema = new Schema<IAuthentication>({
  password: { type: String, required: true, select: false },
  salt: { type: String, select: false },
  sessionToken: { type: String, select: false },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  phone: { type: String },
  address: { type: String },
  authentication: { type: AuthenticationSchema, required: true },
});

export const UserModel = model<IUser>("User", UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionOToken = (token: string) =>
  UserModel.findOne({ "authentication.sessionToken": token });

export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
