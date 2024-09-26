import BlogPost from "../models/blogpost.model.js";

export const getAllBlogPosts = async (req, res) => {
  try {
    const blogposts = await BlogPost.findAll();
    return res.status(200).json(blogposts);
  } catch (error) {
    console.error("Error fetching blogposts:", error);
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
    console.error("Error creating blogpost:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const blogposts = await BlogPost.findByPk(req.params.id);

    return res.status(200).json(blogposts);
  } catch (error) {
    console.error("Error fetching blogposts:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogpost = await BlogPost.findByPk(id);

    if (!blogpost) {
      return res.status(404).json({ message: "BlogPost not found" });
    }

    await blogpost.update(req.body);

    return res.status(200).json(blogpost);
  } catch (error) {
    console.error("Error updating blogpost:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogpost = await BlogPost.findByPk(id);

    if (!blogpost) {
      return res.status(404).json({ message: "BlogPost not found" });
    }

    await blogpost.destroy();

    return res.status(200).json({ message: "BlogPost deleted successfully" });
  } catch (error) {
    console.error("Error deleting blogpost:", error);
    return res.status(500).json({ message: error.message });
  }
};
