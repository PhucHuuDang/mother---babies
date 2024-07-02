import { ReviewModel } from "../schema";

export const getReviews = () => ReviewModel.find();

export const getReviewById = (id: string) => ReviewModel.findById;

export const getReviewByUserId = (userId: string) =>
  ReviewModel.find({ userId });

export const getReviewByProductId = (productId: string) =>
  ReviewModel.find({ productId });

export const createReview = (values: Record<string, any>) =>
  new ReviewModel(values).save().then((review) => review.toObject());

export const deleteReviewById = (id: string) =>
  ReviewModel.findByIdAndDelete({ _id: id });

export const updateReviewById = (id: string, values: Record<string, any>) => {
  return ReviewModel.findByIdAndUpdate(id, values);
};
