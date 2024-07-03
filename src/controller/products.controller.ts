import express from "express";
import { ICategory, IProduct, IReview, IUser, RequestProduct } from "../schema";
import {
  getCategoryById,
  getCategoryByName,
  getUserById,
  getUserByUsername,
} from "../services";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../services/products.services";

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const query = (req.query.query as string) || "";
    const { products, totalPages } = await getProducts(query, page, limit);

    if (products.length === 0 || !products) {
      return res
        .status(200)
        .json({ message: "Product's list is empty", products: [] });
    }

    const formattedProducts = products.map((product: IProduct) => ({
      ...product,
      category: (product.category as unknown as ICategory).name,
      createdBy: (product.createdBy as unknown as IUser).username,
      updatedBy: product.updatedBy
        ? (product.updatedBy as unknown as IUser).username
        : undefined,
    }));

    return res
      .status(200)
      .json({ products: formattedProducts, total: totalPages, page, limit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const findProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(200).json({ message: "Product not found" });
    }

    const reviews = product.reviews || [];

    // Calculate average rating of the product
    const totalRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    const updateProduct = {
      ...product,
      category: (product.category as unknown as ICategory).name,
      createdBy: (product.createdBy as unknown as IUser).username,
      updatedBy: product.updatedBy
        ? (product.updatedBy as unknown as IUser).username
        : undefined,
    };
    console.log(updateProduct);

    return res.status(200).json({ product: updateProduct, totalRating });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    // Delete product from database
    await deleteProductById(id);

    return res.status(200).json({ message: "Deleted successful" }).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Hàm validation
const validateProductFields = ({
  name,
  price,
  stoke,
  description,
  image,
  category,
}: RequestProduct) => {
  if (!name || !price || !stoke || !description || !image || !category) {
    throw new Error("Missing required fields");
  }

  if (typeof price !== "number" || typeof stoke !== "number") {
    throw new Error("Price and stoke must be numbers");
  }
};

// function create and update product with validation
export const createdProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, price, stoke, description, image, category } =
      req.body as RequestProduct;
    const { id: userId } = req.user as any;

    if (!name || !price || !stoke || !description || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existCategory = await getCategoryById(category);
    const existUser = await getUserById(userId);

    if (!existCategory) {
      return res.status(400).json({ message: "Category is not found" });
    }

    if (!existUser) {
      return res.status(400).json({ message: "User is not found" });
    }

    const newProduct = await createProduct({
      name,
      price,
      stoke,
      description,
      image,
      category: existCategory._id || "",
      createdBy: existUser._id || "",
    });

    return res.status(200).json({
      message: "Product created successfully",
      productId: newProduct._id || "",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product name is already taken" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { name, price, stoke, description, image, category, createdBy } =
      req.body as RequestProduct;

    if (
      !name ||
      !price ||
      !stoke ||
      !description ||
      !image ||
      !category ||
      !createdBy
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { id: userId } = req.user as any;

    const existCategory = await getCategoryByName(category);
    if (!existCategory) {
      return res.status(400).json({ message: "Category is not found" });
    }

    const user = await getUserByUsername(createdBy.toString());
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    let updatedBy = user._id;
    if (userId !== user._id.toString()) {
      updatedBy = userId;
    }

    await updateProductById(id, {
      name,
      price,
      stoke,
      description,
      image,
      category: existCategory._id,
      createdBy: user._id,
      updatedBy: updatedBy,
    });

    return res
      .status(200)
      .json({ message: "Product updated successfully", id });
  } catch (error) {
    if (error.codeName === "DuplicateKey") {
      return res.status(400).json({ message: "Product name is already taken" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
