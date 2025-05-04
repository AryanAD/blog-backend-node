import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  addCategory,
  editCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import upload from "../utils/multerConfig.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", upload.single("image"), addCategory);
categoryRouter.put("/:id", upload.single("image"), editCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
