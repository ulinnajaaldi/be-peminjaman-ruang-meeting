import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";

export const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      logger.error("Invalid credentials!");
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      logger.error("Invalid credentials!");
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    logger.info("Login successful!");
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    logger.error("Error logging in!", error.message);
    res.status(400).json({ error: "Connection error!" });
  }
};

export const register = async (req, res) => {
  const { username, email, password, fullname, role = "User" } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        fullname,
        role,
      },
    });

    logger.info("User created successfully!");
    res.status(201).json({ message: "User created successfully!", data: user });
  } catch (error) {
    logger.error("Error creating user!", error.message);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already in use!" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.user.id,
      },
    });

    if (!user) {
      logger.error("User not found!");
      return res.status(404).json({ error: "User not found!" });
    }

    logger.info("User fetched successfully!");
    res.status(200).json({
      message: "User fetched successfully!",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Error fetching user!", error.message);
    res.status(400).json({ error: "Connection error!" });
  }
};
