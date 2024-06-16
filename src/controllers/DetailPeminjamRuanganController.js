import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";

export const createDetailPeminjamanRuangan = async (req, res) => {
  const newDetailPeminjamanRuangan = req.body;

  try {
    const detailPeminjamanRuangan = await prisma.detailPeminjamanRuangan.create(
      {
        data: newDetailPeminjamanRuangan,
      }
    );

    logger.info("Detail peminjaman ruangan created successfully!");
    res.status(201).json({ data: detailPeminjamanRuangan });
  } catch (error) {
    logger.error("Error creating detail peminjaman ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAllDetailPeminjamanRuangan = async (req, res) => {
  const date = req.query.date;
  const idRuangan = req.query.idRuangan;

  try {
    const detailPeminjamanRuangan =
      await prisma.detailPeminjamanRuangan.findMany({
        where: {
          date: date,
          idRuangan: idRuangan,
        },
      });

    if (!detailPeminjamanRuangan) {
      logger.error("Detail peminjaman ruangan not found!");
      return res
        .status(404)
        .json({ message: "Detail peminjaman ruangan not found!", data: {} });
    }

    logger.info("Detail peminjaman ruangan fetched successfully!");
    res.status(200).json({ data: detailPeminjamanRuangan });
  } catch (error) {
    logger.error(
      "Error fetching detail all peminjaman ruangan!",
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

export const getDetailPeminjamanRuangan = async (req, res) => {
  const { idRuangan } = req.params;

  try {
    const detailPeminjamanRuangan =
      await prisma.detailPeminjamanRuangan.findUnique({
        where: {
          idRuangan: idRuangan,
        },
      });

    if (!detailPeminjamanRuangan) {
      logger.error("Detail peminjaman ruangan not found!");
      return res
        .status(404)
        .json({ message: "Detail peminjaman ruangan not found!", data: {} });
    }

    logger.info("Detail peminjaman ruangan fetched successfully!");
    res.status(200).json({ data: detailPeminjamanRuangan });
  } catch (error) {
    logger.error("Error fetching detail peminjaman ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateDetailPeminjamanRuangan = async (req, res) => {
  const { idRuangan, idProsessPinjam } = req.params;

  const updatedDetailPeminjamanRuangan = req.body;

  try {
    const detailPeminjamanRuangan = await prisma.detailPeminjamanRuangan.update(
      {
        where: { idRuangan, idProsessPinjam },
        data: updatedDetailPeminjamanRuangan,
      }
    );

    logger.info("Detail peminjaman ruangan updated successfully!");
    res.status(200).json({ data: detailPeminjamanRuangan });
  } catch (error) {
    logger.error("Error updating detail peminjaman ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteDetailPeminjamanRuangan = async (req, res) => {
  const { idRuangan, idProsessPinjam } = req.params;

  try {
    await prisma.detailPeminjamanRuangan.delete({
      where: { idRuangan, idProsessPinjam },
    });

    logger.info("Detail peminjaman ruangan deleted successfully!");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting detail peminjaman ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};
