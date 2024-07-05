import express from "express";
import { protect, userOrStaff } from "../middlewares";
import {
  commentFeedback,
  deletedReview,
  updateReview,
} from "../controller/reviews.controller";
export default (router: express.Router) => {
  router
    .route("/reviews/:productId")
    .post(protect, userOrStaff, commentFeedback);
  router
    .route("/reviews/:productId/:reviewID")
    .delete(protect, userOrStaff, deletedReview)
    .put(protect, userOrStaff, updateReview);
};
