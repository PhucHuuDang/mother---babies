import express from "express";
import { deleteUser, getAllUsers } from "../controller/users";
import { isAuthenticaed, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticaed, getAllUsers);
  router.delete("/users/:id", isAuthenticaed, isOwner, deleteUser);
};
