import { ReviewModel } from "../schema";

export const getReviews = () => ReviewModel.find();

export const getReviewById = (id: string) => ReviewModel.findById(id).exec();

export const getReviewByUserId = (userId: string) =>
  ReviewModel.find({ userId });

export const getReviewByProductId = (productId: string) =>
  ReviewModel.find({ productId });

export const createReview = async (values: Record<string, any>) => {
  try {
    const newReview = await new ReviewModel(values).save();
    // Populate userId field after saving
    await newReview.populate("userId", "username");

    return newReview.toObject();
  } catch (error) {
    throw new Error(`Error creating review: ${error.message}`);
  }
};

export const deleteReviewById = (id: string) =>
  ReviewModel.findByIdAndDelete({ _id: id });

export const updateReviewById = (id: string, values: Record<string, any>) => {
  return ReviewModel.findByIdAndUpdate(id, values);
};
