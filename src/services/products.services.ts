import { IProduct, IReview, ProductModel } from "../schema";

export const getProducts = async (
  query: string = "",
  page: number = 1,
  limit: number = 10
) => {
  let filter: any = {};
  if (query) {
    const regex = new RegExp(query, "i");
    filter = { $or: [{ name: regex }, { price: regex }, {}] };
  }

  const skip = (page - 1) * limit;
  const products = await ProductModel.find(filter)
    .populate("category", "name")
    .populate("createdBy", "username")
    .populate("updatedBy", "username")
    .skip(skip)
    .limit(limit)
    .lean<IProduct[]>();

  const total = await ProductModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return { products, totalPages, page, limit };
};

export const getProductById = async (id: string) => {
  const product = await ProductModel.findById(id)
    .populate("category", "name")
    .populate("createdBy", "username")
    .populate("updatedBy", "username")
    .populate("reviews.userId", "username")
    .lean<IProduct>()
    .exec();
  return product;
};

export const getProductsByName = async (name: string) => {
  const product = await ProductModel.find({ name })
    .populate("category", "name")
    .populate("createdBy", "username")
    .populate("updatedBy", "username")
    .lean<IProduct>();
  return product;
};

export const getProductByCatogoryID = (id: string) =>
  ProductModel.find({ category: id }).lean<IProduct>().exec();

export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject());

export const deleteProductById = (id: string) =>
  ProductModel.findByIdAndDelete({ _id: id });

export const updateProductById = (id: string, values: Record<string, any>) =>
  ProductModel.findByIdAndUpdate(id, values);

export const addReviewInProduct = async (id: string, value: IReview) => {
  const product = await ProductModel.findByIdAndUpdate(id, {
    $push: { reviews: value },
  });

  return product;
};

export const updateProductByReviewID = async (
  productId: string,
  reviewID: string,
  updateReview: IReview
) => {
  const product = await ProductModel.findOneAndUpdate(
    {
      _id: productId,
      "reviews._id": reviewID,
    },
    {
      $set: {
        "reviews.$.content": updateReview.content,
        "reviews.$.rating": updateReview.rating,
      },
    },
    { new: true }
  );
  return product;
};

export const deleteProductByReviewId = async (id: string, reviewId: string) => {
  const product = await ProductModel.findByIdAndUpdate(
    id,
    {
      $pull: { reviews: { _id: reviewId } },
    },
    { new: true }
  );

  return product;
};
