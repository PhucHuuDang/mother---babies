import express from "express";
import { RequestProduct } from "../schema";
import { getCategoryById, getUserById } from "../services";
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
      return res.status(200).json({ message: "Product's list is empty" });
    }

    return res.status(200).json({ products, total: totalPages, page, limit });
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

    // Calulate average rating of the product
    const totalRating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    const reviewsWithMember = await Promise.all(
      product.reviews.map(async (review) => {
        const user = await getUserById(review.userId.toString());
        return { ...review, userName: user ? user.username : "" };
      })
    );

    const updateProduct = {
      ...product,
      reviews: reviewsWithMember,
    };

    return res.status(200).json({ product: updateProduct, totalRating });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
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

// Middleware check category existence
export const checkCategoryExistence = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { category } = req.body as RequestProduct;
  const existCategory = await getCategoryById(category.toString());
  if (!existCategory) {
    return res.status(400).json({ message: "Category is not found" });
  }
  next();
};

// Middleware check existence of user
export const checkUserExistence = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { createdBy } = req.body as RequestProduct;
  const existUser = await getUserById(createdBy.toString());
  if (!existUser) {
    return res.status(400).json({ message: "User is not found" });
  }
  next();
};

// function create and update product with validation
export const createdProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    validateProductFields(req.body as RequestProduct);
    await checkCategoryExistence(req, res, () => {});

    const { name, price, stoke, description, image, category } =
      req.body as RequestProduct;
    const { id: userId } = req.user as any;

    const existCategory = await getCategoryById(category.toString());
    const existUser = await getUserById(userId);

    const newProduct = await createProduct({
      name,
      price,
      stoke,
      description,
      image,
      category: existCategory._id,
      createdBy: existUser._id,
    });

    return res.status(200).json({
      message: "Product created successfully",
      productId: newProduct._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    validateProductFields(req.body as RequestProduct);
    await checkCategoryExistence(req, res, () => {});
    await checkUserExistence(req, res, () => {});

    const { id } = req.params;
    const { name, price, stoke, description, image, category, createdBy } =
      req.body as RequestProduct;

    const existCategory = await getCategoryById(category.toString());

    await updateProductById(id, {
      name,
      price,
      stoke,
      description,
      image,
      category: existCategory._id,
      createdBy: createdBy,
    });

    return res
      .status(200)
      .json({ message: "Product updated successfully", id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
