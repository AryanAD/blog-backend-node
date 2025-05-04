import Category from "../models/category.model.js";
import fs from "fs";
import path from "path";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { title } = req.body;

    const newCategory = new Category({
      title,
      image: req.file ? req.file.path : undefined,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "Category title must be unique" });
    }
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (req.file) {
      if (category.image) {
        try {
          fs.unlinkSync(category.image);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      updateData.image = req.file.path;
    } else if (req.body.removeImage === "true") {
      if (category.image) {
        try {
          fs.unlinkSync(category.image);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      updateData.image = undefined;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "Category title must be unique" });
    }
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete associated image file
    if (category.image) {
      try {
        fs.unlinkSync(category.image);
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
