import { Router } from "express";
import {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlogById,
  deleteBlogById,
} from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/", createBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id", updateBlogById);
blogRouter.delete("/:id", deleteBlogById);

export default blogRouter;
