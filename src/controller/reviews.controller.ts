import express from "express";
export const commentFeedback = (
  req: express.Request,
  res: express.Response
) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
