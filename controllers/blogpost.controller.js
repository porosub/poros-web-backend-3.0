import BlogPost from "../models/blogpost.model.js";

export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    return res.status(200).json(blogPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const newBlogPost = await BlogPost.create({
      title,
      category,
      content,
    });

    return res.status(201).json(newBlogPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.id);

    return res.status(200).json(blogPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findByPk(id);

    if (!blogPost) {
      return res.status(404).json({ message: "BlogPost not found" });
    }

    await blogPost.update(req.body);

    return res.status(200).json(blogPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findByPk(id);

    if (!blogPost) {
      return res.status(404).json({ message: "BlogPost not found" });
    }

    await blogPost.destroy();

    return res.status(200).json({ message: "BlogPost deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return res.status(500).json({ message: error.message });
  }
};
