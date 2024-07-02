import express from "express";

import authentication from "./authentication";
import users from "./users";
import product from "./product";
import reviews from "./reviews";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  product(router);
  reviews(router);
  return router;
};
