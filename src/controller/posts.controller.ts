import express from "express";
import {
  createPost,
  deletePostById,
  getAllPost,
  getPostById,
  updatePostById,
} from "../services";
import { IPost, RequestPost } from "../schema/posts.schema";
import { IUser } from "../schema";

export const getPosts = async (req: express.Request, res: express.Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const query = (req.query.query as string) || "";

    const { posts, totalPages } = await getAllPost(query, page, limit);

    if (posts.length === 0 || !posts) {
      return res
        .status(200)
        .json({ message: "Post's list is empty", posts: [] });
    }

    const formattedPosts = posts.map((post: IPost) => ({
      ...post,
      author: (post.author as unknown as IUser).username,
    }));

    return res
      .status(200)
      .json({ posts: formattedPosts, total: totalPages, page, limit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const findPost = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      return res.status(200).json({ message: "Post not found" });
    }

    const formattedPost = {
      ...post,
      author: (post.author as unknown as IUser).username,
    };

    return res.status(200).json({ post: formattedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createdPost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, content, productID } = req.body as RequestPost;

    if (!title || !content || !productID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const post = await createPost({
      title,
      content,
      productID,
    });

    return res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { title, content, productID } = req.body as RequestPost;
    const { id: userId } = req.user as any;

    if (!title || !content || !productID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedPost = await updatePostById(id, {
      title,
      content,
      productID,
    });

    return res.status(200).json({ message: "Post updated", updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user as any;

    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await deletePostById(id);

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
