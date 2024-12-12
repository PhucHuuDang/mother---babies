import { IPost, PostModel } from "../schema/posts.schema";

export const getAllPost = async (
  query: string = "",
  page: number = 1,
  limit: number = 10
) => {
  let filter: any = {};
  if (query) {
    const regex = new RegExp(query, "i");
    filter = { $or: [{ title: regex }] };
  }

  const skip = (page - 1) * limit;
  const posts = await PostModel.find(filter)
    .populate("author", "username")
    .populate("productID", "name")
    .skip(skip)
    .limit(limit)
    .lean<IPost[]>();

  const total = await PostModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return { posts, totalPages, page, limit };
};

export const getPostById = async (id: string) => {
  const post = await PostModel.findById(id)
    .populate("author", "username")
    .populate("productID", "name")
    .lean<IPost>()
    .exec();
  return post;
};

export const getPostByUserId = async (userId: string) => {
  const post = await PostModel.find({ author: userId })
    .populate("author", "username")
    .populate("productID", "name")
    .lean<IPost>()
    .exec();
  return post;
};

export const createPost = async (values: Record<string, any>) =>
  await new PostModel(values).save().then((post) => post.toObject());

export const deletePostById = async (id: string) =>
  await PostModel.findByIdAndDelete({ _id: id });

export const updatePostById = async (id: string, values: Record<string, any>) =>
  await PostModel.findByIdAndUpdate(id, values);
