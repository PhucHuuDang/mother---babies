import express from "express";

import authentication from "./authentication";
import categories from "./categories";
import product from "./product";
import report from "./report";
import reviews from "./reviews";
import users from "./users";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  product(router);
  reviews(router);
  categories(router);
  report(router);
  return router;
};
