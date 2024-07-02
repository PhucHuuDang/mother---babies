import express from "express";
import { RequestFeedback } from "../schema";
import { createReview, getProductById } from "../services";
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

    await createReview({
      userId,
      rating,
      content: comment,
    });

    return res.status(201).json({ message: "Comment successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
