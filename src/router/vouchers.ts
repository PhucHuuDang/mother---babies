import express from "express";
import { adminOrStaff, protect } from "../middlewares";
import {
  createdVoucher,
  deleteVoucher,
  findVouchers,
  getVouchers,
  updateVoucher,
} from "../controller/vouchers.controller";
export default (router: express.Router) => {
  router
    .route("/vouchers")
    .get(protect, getVouchers)
    .post(protect, adminOrStaff, createdVoucher);
  router
    .route("/vouchers/:id")
    .get(protect, findVouchers)
    .put(protect, adminOrStaff, updateVoucher)
    .delete(protect, adminOrStaff, deleteVoucher);
};
