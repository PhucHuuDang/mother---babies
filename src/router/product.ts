import express from "express";
import {
  createdProduct,
  findProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../controller/products.controller";
import { admin, protect, staff } from "../middlewares";

export default (router: express.Router) => {
  router
    .route("/products")
    .get(getAllProducts)
    .post(protect, staff, admin, createdProduct);
  router
    .route("/products/:id")
    .get(findProduct)
    .delete(protect, admin, staff, deleteProduct)
    .put(protect, admin, staff, updateProduct);
};
