import express from "express";
import {
  deleteReport,
  findReport,
  getReports,
  updateReport,
} from "../controller/report.controller";
import { adminOrStaff, protect, user } from "../middlewares";
import { createReport } from "../services";

export default (router: express.Router) => {
  router
    .route("/report")
    .get(protect, adminOrStaff, getReports)
    .post(protect, adminOrStaff, createReport);
  router
    .route("/report/:id")
    .get(protect, user, findReport)
    .delete(protect, adminOrStaff, deleteReport)
    .put(protect, adminOrStaff, updateReport);
};
