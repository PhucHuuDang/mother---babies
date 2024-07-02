import express from "express";
import {
  deleteUser,
  findUser,
  getAllUsers,
  updateUser,
} from "../controller/users.controller";
import { admin, protect, user } from "../middlewares";

export default (router: express.Router) => {
  router.route("/users").get(protect, admin, getAllUsers);
  router
    .route("/users/:id")
    .get(protect, findUser)
    .put(protect, user, updateUser)
    .delete(protect, admin, deleteUser);
};
