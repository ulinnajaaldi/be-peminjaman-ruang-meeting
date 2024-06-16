import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";

export const createRuangan = async (req, res) => {
  const { name, slug, description, images, facilities, capacity } = req.body;

  try {
    const existingRuangan = await prisma.ruangan.findFirst({
      where: {
        name: name,
      },
    });

    if (existingRuangan) {
      return res
        .status(400)
        .json({ error: "A ruangan with this name already exists." });
    }

    const ruangan = await prisma.ruangan.create({
      data: {
        name,
        slug,
        description,
        images: JSON.stringify(images),
        facilities,
        capacity,
      },
    });

    logger.info("Ruangan created successfully!");
    res
      .status(201)
      .json({ message: "Ruangan created successfully!", data: ruangan });
  } catch (error) {
    logger.error("Error creating ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAllRuangan = async (req, res) => {
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
      {
        facilities: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  try {
    const ruangan = await prisma.ruangan.findMany({
      where: searchCondition,
      take: limit,
      skip: skip,
    });

    const totalRuangan = await prisma.ruangan.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalRuangan / limit);

    const ruanganWithParsedImages = ruangan.map((ruanganItem) => ({
      ...ruanganItem,
      images: JSON.parse(ruanganItem.images),
    }));

    logger.info("Ruangan fetched successfully!");
    res.status(200).json({
      message: "Ruangan fetched successfully!",
      current_page: page - 0,
      totalPages: totalPages,
      totalData: totalRuangan,
      data: ruanganWithParsedImages,
    });
  } catch (error) {
    logger.error("Error fetching ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getRuanganBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const ruangan = await prisma.ruangan.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!ruangan) {
      logger.error("Ruangan not found!");
      return res.status(404).json({ error: "Ruangan not found!" });
    }

    logger.info("Ruangan fetched successfully!");
    res.status(200).json({
      message: "Ruangan fetched successfully!",
      data: {
        ...ruangan,
        images: JSON.parse(ruangan.images),
      },
    });
  } catch (error) {
    logger.error("Error fetching ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getRuanganDetail = async (req, res) => {
  const { slug } = req.params;

  try {
    const ruangan = await prisma.ruangan.findFirst({
      where: {
        slug: slug,
      },
      include: {
        DetailPeminjamanRuangan: {
          select: {
            date: true,
            startHour: true,
            endHour: true,
            people: true,
            ProsessPinjam: {
              select: {
                status: true,
              },
            },
          },
          where: {
            date: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!ruangan) {
      logger.error("Ruangan not found!");
      return res.status(404).json({ error: "Ruangan not found!" });
    }

    ruangan.DetailPeminjamanRuangan = ruangan.DetailPeminjamanRuangan.filter(
      (detail) => detail.ProsessPinjam.status === "Disetujui"
    );

    logger.info("Ruangan fetched successfully!");
    res.status(200).json({
      message: "Ruangan fetched successfully!",
      data: {
        ...ruangan,
        images: JSON.parse(ruangan.images),
      },
    });
  } catch (error) {
    logger.error("Error fetching details ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getDetailPeminjamanRuangan = async (req, res) => {
  const { ruanganId, date } = req.query;

  try {
    const detailPeminjamanRuangan =
      await prisma.detailPeminjamanRuangan.findMany({
        where: {
          ruanganId: ruanganId,
          date: new Date(date),
          ProsessPinjam: {
            status: "Disetujui",
          },
        },
        select: {
          idProsessPinjam: true,
          date: true,
          startHour: true,
          endHour: true,
          people: true,
          necessity: true,
          employeeName: true,
          employeeDivision: true,
          employeeEmail: true,
        },
      });

    logger.info("Detail peminjaman ruangan fetched successfully!");
    res.status(200).json({
      message: "Detail peminjaman ruangan fetched successfully!",
      data: detailPeminjamanRuangan,
    });
  } catch (error) {
    logger.error("Error fetching detail peminjaman ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateRuangan = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, images, facilities, capacity } = req.body;

  try {
    const ruangan = await prisma.ruangan.update({
      where: {
        id: id,
      },
      data: {
        name,
        slug,
        description,
        images: JSON.stringify(images),
        facilities,
        capacity,
      },
    });

    logger.info("Ruangan updated successfully!");
    res
      .status(200)
      .json({ message: "Ruangan updated successfully!", data: ruangan });
  } catch (error) {
    logger.error("Error updating ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteRuangan = async (req, res) => {
  const { slug } = req.params;

  try {
    const ruangan = await prisma.ruangan.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!ruangan) {
      logger.error("Ruangan not found!");
      return res.status(404).json({ error: "Ruangan not found!" });
    }

    await prisma.ruangan.delete({
      where: {
        id: ruangan.id,
      },
    });

    logger.info("Ruangan deleted successfully!");
    res.status(200).json({ message: "Ruangan deleted successfully!" });
  } catch (error) {
    logger.error("Error deleting ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};
