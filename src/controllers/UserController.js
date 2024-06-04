import bcrypt from "bcryptjs";

import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";

export const createUser = async (req, res) => {
  const { username, email, password, fullname, role } = req.body;

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
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const role = req.query.role || "";

  const searchCondition = {
    OR: [
      {
        username: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        fullname: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
    role: {
      contains: role,
    },
  };

  try {
    const users = await prisma.user.findMany({
      take: limit,
      skip: skip,
      where: searchCondition,
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        role: true,
      },
    });

    const userCount = await prisma.user.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(userCount / limit);

    logger.info("All users fetched successfully!");
    res.status(200).json({
      message: "All users fetched successfully!",
      current_page: page - 0,
      totalPages: totalPages,
      totalData: userCount,
      data: users,
    });
  } catch (error) {
    logger.error("Error fetching users!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
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
    res.status(400).json({ error: error.message });
  }
};

export const getUserByIdWithPassword = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
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
        password: user.password,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Error fetching user!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, fullname, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username,
        email,
        password: hashedPassword,
        fullname,
        role,
      },
    });

    logger.info("User updated successfully!");

    res.status(200).json({ message: "User updated successfully!", data: user });
  } catch (error) {
    logger.error("Error updating user!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    logger.info("User deleted successfully!");

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    logger.error("Error deleting user!", error.message);
    res.status(400).json({ error: error.message });
  }
};
