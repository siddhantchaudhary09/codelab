import express from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

//routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", authMiddleware, logout);
authRoutes.get("/profile", authMiddleware, profile);
export default authRoutes;
