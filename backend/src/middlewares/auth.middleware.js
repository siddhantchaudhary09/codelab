import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in middleware:", error);
    return res.status(500).json({
      message: "Internal server error in auth middleware",
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const user = req?.user;

    if (!user || user?.role != "ADMIN") {
      return res.status(500).json({
        message: "Forbidden- You do not have permission to create problems",
      });
    }
    next();
  } catch (error) {
    console.log("error in admin check", error);
    res.status(500).json({ message: "Error checking in admin role" });
  }
};
