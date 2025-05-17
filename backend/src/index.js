import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 8000;
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("HELLO");
});
app.use("/api/v1/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
