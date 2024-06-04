import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";

export const createSaprasPeminjaman = async (req, res) => {
  const newSaprasPeminjaman = req.body;

  try {
    const saprasPeminjaman = await prisma.saprasPeminjaman.create({
      data: newSaprasPeminjaman,
    });

    logger.info("Sapras peminjaman created successfully!");
    res.status(201).json({ data: saprasPeminjaman });
  } catch (error) {
    logger.error("Error creating sapras peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAllSaprasPeminjaman = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const searchCondition = {
    OR: [
      {
        idSapras: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        idProsessPinjam: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        idRuangan: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  try {
    const saprasPeminjaman = await prisma.saprasPeminjaman.findMany({
      where: searchCondition,
      take: limit,
      skip: skip,
    });

    const totalSaprasPeminjaman = await prisma.saprasPeminjaman.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalSaprasPeminjaman / limit);

    logger.info("Sapras peminjaman fetched successfully!");
    res.status(200).json({
      message: "Sapras peminjaman fetched successfully!",
      current_page: page - 0,
      totalPages: totalPages,
      totalData: totalSaprasPeminjaman,
      data: saprasPeminjaman,
    });
  } catch (error) {
    logger.error("Error fetching sapras peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateSaprasPeminjaman = async (req, res) => {
  const { idSapras, idRuangan, idProsessPinjam } = req.params;
  const saprasPeminjaman = req.body;

  try {
    const updatedSaprasPeminjaman = await prisma.saprasPeminjaman.update({
      where: { idSapras, idRuangan, idProsessPinjam },
      data: saprasPeminjaman,
    });

    logger.info("Sapras peminjaman updated successfully!");
    res.status(200).json({ data: updatedSaprasPeminjaman });
  } catch (error) {
    logger.error("Error updating sapras peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSaprasPeminjaman = async (req, res) => {
  const { idSapras, idRuangan, idProsessPinjam } = req.params;

  try {
    await prisma.saprasPeminjaman.delete({
      where: { idSapras, idRuangan, idProsessPinjam },
    });

    logger.info("Sapras peminjaman deleted successfully!");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting sapras peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};
