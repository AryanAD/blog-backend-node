import { Router } from "express";
import {
  getBlogs,
  getBlogById,
  addBlog,
  editBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import upload from "../utils/multerConfig.js";

const blogRouter = Router();

blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/", upload.single("image"), addBlog);
blogRouter.put("/:id", upload.single("image"), editBlog);
blogRouter.delete("/:id", deleteBlog);

export default blogRouter;
