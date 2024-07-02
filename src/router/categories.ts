import express from "express";
import { adminOrStaff, protect } from "../middlewares";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controller/catogories.controller";

export default (router: express.Router) => {
  router
    .route("/categories")
    .get(protect, adminOrStaff, getCategories)
    .post(protect, adminOrStaff, createCategory);

  router
    .route("/categories/:id")
    .get(protect, getCategory)
    .put(protect, adminOrStaff, updateCategory)
    .delete(protect, adminOrStaff, deleteCategory);
};
