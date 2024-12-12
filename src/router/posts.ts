import express from "express";
import {
  createdPost,
  deletePost,
  findPost,
  getPosts,
  updatePost,
} from "../controller/posts.controller";
import { protect, userOrStaff } from "../middlewares";
export default (router: express.Router) => {
  router.route("/posts").get(getPosts).post(protect, userOrStaff, createdPost);
  router
    .route("/posts/:id")
    .get(findPost)
    .put(protect, userOrStaff, updatePost)
    .delete(protect, userOrStaff, deletePost);
};
