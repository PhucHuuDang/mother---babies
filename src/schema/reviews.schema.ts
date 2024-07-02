import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  userId: Schema.Types.ObjectId;
  rating: number;
  content: string;
}

export interface RequestFeedback {
  comment: string;
  rating: number;
}

export const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  content: { type: String, required: true },
});

export const ReviewModel = model<IReview>("Review", reviewSchema);
