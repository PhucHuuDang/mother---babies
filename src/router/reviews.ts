import express from "express";
import { protect, userOrStaff } from "../middlewares";
import { commentFeedback } from "../controller/reviews.controller";
export default (router: express.Router) => {
  router.route("/reviews/:watchID").post(protect, userOrStaff, commentFeedback);
  router
    .route("/reviews/:watchID/:reviewID")
    .delete(protect, userOrStaff, commentFeedback)
    .put(protect, userOrStaff, commentFeedback);
};
