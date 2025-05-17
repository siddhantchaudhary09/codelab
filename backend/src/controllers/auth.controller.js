import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(200).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: { email, password: hashedPassword, name, role: "USER" },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        newUser,
      },
    });
  } catch (error) {
    console.log("error in registering ", error);
    res.status(400).json("Error in creating User");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({
      success: true,
      message: "User logged successfully",
      user: {
        user,
      },
    });
  } catch (error) {
    console.log("error in logging in ", error);
    res.status(500).json("Error in logging in User");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("error in logging out ", error);
    res
      .status(500)
      .json({ success: false, message: "Error in logout in User" });
  }
};

export const profile = async (req, res) => {
  try {
    console.log(req.user);

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user: req.user,
    });
  } catch (error) {
    console.log("Error in checking user", error);

    return res.status(500).json({
      error: "Error in checking user",
    });
  }
};
