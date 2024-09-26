import Blog from "../models/blog.model.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createBlog = (req, res) => {};

export const getBlogById = (req, res) => {};

export const updateBlogById = (req, res) => {};

export const deleteBlogById = (req, res) => {};
