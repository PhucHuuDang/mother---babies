import { PostModel } from "../schema/posts.schema";

export const getAllPost = () => PostModel.find();

export const getPostById = (id: string) => PostModel.findById(id);

export const getPostByUserId = (userId: string) => PostModel.find({ userId });

export const createPost = (values: Record<string, any>) =>
  new PostModel(values).save().then((post) => post.toObject());

export const deletePostById = (id: string) =>
  PostModel.findByIdAndDelete({ _id: id });

export const updatePostById = (id: string, values: Record<string, any>) =>
  PostModel.findByIdAndUpdate(id, values);
