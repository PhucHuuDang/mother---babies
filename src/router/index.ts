import express from "express";

import authentication from "./authentication";
import users from "./users";
import product from "./product";
import reviews from "./reviews";
import categories from "./categories";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  product(router);
  reviews(router);
  categories(router);
  return router;
};
