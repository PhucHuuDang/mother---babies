import { CategoryModel } from "../schema";

export const getAllCategories = () => CategoryModel.find();

export const getCategoryById = (id: string) => CategoryModel.findById(id);
export const getCategoryByName = (name: string) =>
  CategoryModel.findOne({ name });

export const createNewCategory = (values: Record<string, any>) =>
  new CategoryModel(values).save().then((category) => category.toObject());

export const deleteCategoryById = (id: string) =>
  CategoryModel.findByIdAndDelete({ _id: id });

export const updateCategoryById = (id: string, values: Record<string, any>) =>
  CategoryModel.findByIdAndUpdate(id, values);
