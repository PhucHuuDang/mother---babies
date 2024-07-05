import express from "express";

import authentication from "./authentication";
import categories from "./categories";
import posts from "./posts";
import product from "./product";
import report from "./report";
import reviews from "./reviews";
import users from "./users";
import vouchers from "./vouchers";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  product(router);
  reviews(router);
  categories(router);
  report(router);
  posts(router);
  vouchers(router);
  return router;
};
