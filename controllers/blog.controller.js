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

export const createBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    // Create a new blog entry
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
    // Query the database for all blog entries
    const blogs = await Blog.findByPk(req.params.id);

    // Send the blogs back in the response
    return res.status(200).json(blogs);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog by its primary key (ID)
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update the blog entry with the new data from the request body
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

    // Find the blog by its primary key (ID)
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog
    await blog.destroy();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: error.message });
  }
};
