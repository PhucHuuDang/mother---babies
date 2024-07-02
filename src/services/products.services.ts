import { ProductModel } from "../schema";

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
  const products = await ProductModel.find(filter).skip(skip).limit(limit);
  const total = await ProductModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return { products, totalPages, page, limit };
};

export const getProductById = (id: string) => ProductModel.findById(id);

export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject());

export const deleteProductById = (id: string) =>
  ProductModel.findByIdAndDelete({ _id: id });

export const updateProductById = (id: string, values: Record<string, any>) =>
  ProductModel.findByIdAndUpdate(id, values);