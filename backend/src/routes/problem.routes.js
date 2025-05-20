import express from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getSolvedProblems,
  updateProblem,
} from "../controllers/problem.controller.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const problemRoutes = express.Router();

problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);
problemRoutes.get("get-all-problems", getAllProblems);
problemRoutes.get("/get-problem/:id", getProblemById);
problemRoutes.put(
  "update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem
);
problemRoutes.delete(
  "delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem
);
problemRoutes.get("get-solved-problems", authMiddleware, getSolvedProblems);

export default problemRoutes;
