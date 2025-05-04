import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT as envPORT } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import blogRouter from "./routes/blog.routes.js";

import connectToDatabase from "./database/mongodb.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/blogs", blogRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Blogs API! 📖");
});

const PORT = envPORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is up and running on port ${PORT} 🚀`);
  await connectToDatabase();
});
