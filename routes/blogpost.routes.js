import { Router } from "express";
import {
  getAllBlogPosts,
  createBlogPost,
  getBlogPostById,
  updateBlogPostById,
  deleteBlogPostById,
} from "../controllers/blogpost.controller.js";

const blogPostRouter = Router();

blogPostRouter.get("/", getAllBlogPosts);
blogPostRouter.post("/", createBlogPost);
blogPostRouter.get("/:id", getBlogPostById);
blogPostRouter.put("/:id", updateBlogPostById);
blogPostRouter.delete("/:id", deleteBlogPostById);

export default blogPostRouter;
