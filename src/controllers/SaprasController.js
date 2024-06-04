import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";

export const createSapras = async (req, res) => {
  const { name, description, images, ammount } = req.body;

  try {
    const existingSapras = await prisma.sapras.findFirst({
      where: {
        name: name,
      },
    });

    if (existingSapras) {
      return res
        .status(400)
        .json({ error: "A sapras with this name already exists." });
    }

    const sapras = await prisma.sapras.create({
      data: {
        name,
        description,
        images,
        ammount,
      },
    });

    logger.info("Sapras created successfully!");
    res
      .status(201)
      .json({ message: "Sapras created successfully!", data: sapras });
  } catch (error) {
    logger.error("Error creating sapras!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAllSapras = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const searchCondition = {
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  try {
    const sapras = await prisma.sapras.findMany({
      where: searchCondition,
      take: limit,
      skip: skip,
    });

    const saprasCount = await prisma.sapras.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(saprasCount / limit);

    logger.info("Sapras fetched successfully!");
    res.status(200).json({
      message: "Sapras fetched successfully!",
      current_page: page - 0,
      totalPages: totalPages,
      totalData: saprasCount,
      data: sapras,
    });
  } catch (error) {
    logger.error("Error fetching sapras!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getSapras = async (req, res) => {
  const { id } = req.params;

  try {
    const sapras = await prisma.sapras.findUnique({
      where: {
        id: id,
      },
    });

    if (!sapras) {
      logger.error("Sapras not found!");
      return res.status(404).json({ error: "Sapras not found!" });
    }

    logger.info("Sapras fetched successfully!");
    res.status(200).json({
      message: "Sapras fetched successfully!",
      data: sapras,
    });
  } catch (error) {
    logger.error("Error fetching sapras!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateSapras = async (req, res) => {
  const { id } = req.params;
  const { name, description, images, ammount } = req.body;

  try {
    const sapras = await prisma.sapras.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        images,
        ammount,
      },
    });

    logger.info("Sapras updated successfully!");
    res.status(200).json({
      message: "Sapras updated successfully!",
      data: sapras,
    });
  } catch (error) {
    logger.error("Error updating sapras!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSapras = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.sapras.delete({
      where: {
        id: id,
      },
    });

    logger.info("Sapras deleted successfully!");
    res.status(200).json({ message: "Sapras deleted successfully!" });
  } catch (error) {
    logger.error("Error deleting sapras!", error.message);
    res.status(400).json({ error: error.message });
  }
};
