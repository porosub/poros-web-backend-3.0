import Joi from "joi";
import BlogPost from "../models/blogpost.model.js";

export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    return res
      .status(200)
      .json({ message: "Fetch all BlogPost successfully", data: blogPosts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const { isValid, error } = validateBlogPost(req.body);
    if (!isValid) {
      return res.status(400).json({ message: error });
    }

    const newBlogPost = await BlogPost.create(req.body);
    return res.status(201).json({
      message: "Created post successfully",
      data: newBlogPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.id);
    return res
      .status(200)
      .json({ message: "Fetch all BlogPost successfully", data: blogPosts });
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

    const { isValid, error } = validateBlogPost(req.body);
    if (!isValid) {
      return res.status(400).json({ message: error });
    }

    const updatedBlogPost = await BlogPost.update(req.body, {
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Updated post successfully",
      data: updatedBlogPost,
    });
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

// tes

const validateBlogPost = (blogPostInput) => {
  const blogPostValidationSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    content: Joi.string().required(),
  });

  const { error } = blogPostValidationSchema.validate(blogPostInput, {
    abortEarly: false,
  });

  if (error) {
    return {
      isValid: false,
      error: error.details.map((detail) => detail.message).join(", "),
    };
  } else {
    return { isValid: true, error: null };
  }
};
