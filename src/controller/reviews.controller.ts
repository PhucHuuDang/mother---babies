import express from "express";
import { IReview, RequestFeedback } from "../schema";
import {
  createReview,
  deleteProductByReviewId,
  deleteReviewById,
  getProductById,
  getReviewById,
  addReviewInProduct,
  updateReviewById,
  updateProductByReviewID,
} from "../services";

export const commentFeedback = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { productId } = req.params;
    const { comment, rating } = req.body as RequestFeedback;
    const { id: userId } = req.user as any;

    const existProduct = await getProductById(productId);
    if (!existProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!comment || !rating) {
      return res
        .status(400)
        .json({ message: "Comment and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const newComment = await createReview({
      userId,
      rating,
      content: comment,
      username: userId.username,
    });

    // Update product with new review
    await addReviewInProduct(productId, newComment);

    return res
      .status(201)
      .json({ message: "Comment successfully", review: newComment._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletedReview = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { reviewID, productId } = req.params;
    const { id: userId } = req.user as any;

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check review exist
    const review = await getReviewById(reviewID);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    console.log("review", review);
    console.log("userId", userId);

    // Check user is owner of review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // Remove review from product
    await deleteProductByReviewId(productId, reviewID);
    // Delete review from database
    await deleteReviewById(reviewID);

    return res.status(200).json({ message: "Deleted review successful" }).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReview = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { reviewID, productId } = req.params;
    const { id: userId } = req.user as any;
    const { comment, rating } = req.body as RequestFeedback;

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check review exist
    const review = await getReviewById(reviewID);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check user is owner of review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!comment || !rating) {
      return res
        .status(400)
        .json({ message: "Comment and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const updateReview = {
      userId,
      rating,
      content: comment,
    };

    // Update review in product
    await updateProductByReviewID(productId, reviewID, updateReview as IReview);

    // Update review in database
    await updateReviewById(reviewID, {
      userId,
      rating,
      content: comment,
    });

    return res.status(200).json({ message: "Updated review successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
