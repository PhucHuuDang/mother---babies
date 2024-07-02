import express from "express";
import {
  createdProduct,
  findProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../controller/products.controller";
import { admin, adminOrStaff, protect, staff } from "../middlewares";

export default (router: express.Router) => {
  router
    .route("/products")
    .get(getAllProducts)
    .post(protect, adminOrStaff, createdProduct);
  router
    .route("/products/:id")
    .get(findProduct)
    .delete(protect, adminOrStaff, deleteProduct)
    .put(protect, adminOrStaff, updateProduct);
};
