import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js";
import fs from "fs";

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("category", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "category",
      "title"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

export const addBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const newBlog = new Blog({
      title,
      description,
      category,
      image: req.file?.path,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error creating blog", error });
  }
};

export const editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const updateData = {
      title: req.body.title || blog.title,
      description: req.body.description || blog.description,
      category: req.body.category || blog.category,
    };

    if (req.file) {
      if (blog.image) fs.unlinkSync(blog.image);
      updateData.image = req.file.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error updating blog", error });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image) fs.unlinkSync(blog.image);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
