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

export const createBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const newBlog = await Blog.create({
      title,
      category,
      content,
    });

    return res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blogs = await Blog.findByPk(req.params.id);

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.update(req.body);

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.destroy();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: error.message });
  }
};
