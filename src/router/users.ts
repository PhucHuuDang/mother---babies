import express from "express";
import {
  deleteUser,
  findUser,
  getAllUsers,
  updateUser,
} from "../controller/users.controller";
import { adminOrStaff, protect, user } from "../middlewares";
import { changePassword } from "../controller/authentication.controller";

export default (router: express.Router) => {
  router.route("/users").get(protect, adminOrStaff, getAllUsers);
  router
    .route("/users/:id")
    .get(protect, findUser)
    .put(protect, user, updateUser)
    .delete(protect, adminOrStaff, deleteUser);

  router.route("/users/:id/change-password").put(protect, changePassword);
};
