import express from "express";
import { RequestCategory } from "../schema";
import {
  createNewCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  getProductByCatogoryID,
  updateCategoryById,
} from "../services";

export const getCategories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, description } = req.body as RequestCategory;
    const { id } = req.user as any;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const existCategory = await getCategoryByName(name);

    if (existCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    await createNewCategory({
      name,
      description,
      createdBy: id,
    });

    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = await getProductByCatogoryID(categoryId);
    if (product) {
      return res
        .status(400)
        .json({ message: "Category is in use by a product" });
    }

    await deleteCategoryById(categoryId);

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { categoryId } = req.params;
    const { name, description, createdBy } = req.body as RequestCategory;
    const { id } = req.user as any;

    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    let updatedBy = "";
    if (createdBy.toString() !== id) {
      updatedBy = id;
    }

    await updateCategoryById(categoryId, {
      name,
      description,
      updatedBy,
    });

    return res
      .status(200)
      .json({ message: "Category updated successfully", id: categoryId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};