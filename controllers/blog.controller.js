import Blog from "../models/blog.model.js";

export const getAllBlogs = async (req, res) => {
  try {
    // Query the database for all blog entries
    const blogs = await Blog.findAll();

    // Send the blogs back in the response
    return res.status(200).json(blogs);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createBlog = (req, res) => {};

export const getBlogById = (req, res) => {};

export const updateBlogById = (req, res) => {};

export const deleteBlogById = (req, res) => {};
