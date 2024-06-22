import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import prisma from "../prisma.js";
import { logger } from "../utils/logger.js";
import { transporter } from "../utils/nodemailer.js";

export const createProsesPinjam = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const prosesPinjam = await prisma.prosessPinjam.create({
      data: {
        userId,
        status,
      },
    });

    logger.info("Proses peminjaman created!");
    res
      .status(201)
      .json({ message: "Proses peminjaman created!", prosesPinjam });
  } catch (error) {
    logger.error("Error creating proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAllProsesPinjam = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const status = req.query.status || "";

  const searchCondition = {
    OR: [
      {
        status: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
    AND: [
      {
        status: {
          contains: status,
          mode: "insensitive",
        },
      },
    ],
  };

  try {
    const prosesPinjam = await prisma.prosessPinjam.findMany({
      where: searchCondition,
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        DetailPeminjamanRuangan: {
          include: {
            SaprasPeminjaman: {
              select: {
                quantity: true,
                Sapras: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            Ruangan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const totalProsesPinjam = await prisma.prosessPinjam.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalProsesPinjam / limit);

    logger.info("Proses peminjaman fetched successfully!");
    res.status(200).json({
      message: "Proses peminjaman fetched successfully!",
      current_page: page - 0,
      totalPages: totalPages,
      totalData: totalProsesPinjam,
      data: prosesPinjam.map((prosesPinjam) => ({
        id: prosesPinjam.id,
        status: prosesPinjam.status,
        createdAt: prosesPinjam.createdAt,
        updatedAt: prosesPinjam.updatedAt,
        detailPeminjamanRuangan: prosesPinjam.DetailPeminjamanRuangan.map(
          (detailPeminjamanRuangan) => ({
            ruangan: detailPeminjamanRuangan.Ruangan.name,
            employeeName: detailPeminjamanRuangan.employeeName,
            employeeDivision: detailPeminjamanRuangan.employeeDivision,
            date: detailPeminjamanRuangan.date,
            startHour: detailPeminjamanRuangan.startHour,
            endHour: detailPeminjamanRuangan.endHour,
            people: detailPeminjamanRuangan.people,
            necessity: detailPeminjamanRuangan.necessity,
            additional: detailPeminjamanRuangan.additional,
            saprasPeminjaman: detailPeminjamanRuangan.SaprasPeminjaman.map(
              (saprasPeminjaman) => ({
                quantity: saprasPeminjaman.quantity,
                name: saprasPeminjaman.Sapras.name,
              })
            ),
          })
        ),
      })),
    });
  } catch (error) {
    logger.error("Error fetching proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getProsesPinjamById = async (req, res) => {
  const { id } = req.params;

  try {
    const prosesPinjam = await prisma.prosessPinjam.findUnique({
      where: {
        id: id,
      },
      include: {
        DetailPeminjamanRuangan: {
          include: {
            SaprasPeminjaman: {
              select: {
                quantity: true,
                Sapras: {
                  select: {
                    name: true,
                    images: true,
                  },
                },
              },
            },
            Ruangan: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!prosesPinjam) {
      logger.error("Proses peminjaman not found!");
      return res.status(404).json({ error: "Proses peminjaman not found!" });
    }

    logger.info("Proses peminjaman fetched successfully!");
    res.status(200).json({
      message: "Proses peminjaman fetched successfully!",
      data: {
        id: prosesPinjam.id,
        status: prosesPinjam.status,
        createdAt: prosesPinjam.createdAt,
        updatedAt: prosesPinjam.updatedAt,
        detailPeminjamanRuangan: prosesPinjam.DetailPeminjamanRuangan.map(
          (detailPeminjamanRuangan) => ({
            ruangan: detailPeminjamanRuangan.Ruangan.name,
            ruanganImage: JSON.parse(detailPeminjamanRuangan.Ruangan.images),
            ruanganSlug: detailPeminjamanRuangan.Ruangan.slug,
            employeeName: detailPeminjamanRuangan.employeeName,
            employeeDivision: detailPeminjamanRuangan.employeeDivision,
            employeeNik: detailPeminjamanRuangan.employeeNik,
            employeePhone: detailPeminjamanRuangan.employeePhone,
            employeeEmail: detailPeminjamanRuangan.employeeEmail,
            date: detailPeminjamanRuangan.date,
            startHour: detailPeminjamanRuangan.startHour,
            endHour: detailPeminjamanRuangan.endHour,
            people: detailPeminjamanRuangan.people,
            necessity: detailPeminjamanRuangan.necessity,
            additional: detailPeminjamanRuangan.additional,
            saprasPeminjaman: detailPeminjamanRuangan.SaprasPeminjaman.map(
              (saprasPeminjaman) => ({
                quantity: saprasPeminjaman.quantity,
                name: saprasPeminjaman.Sapras.name,
                image: saprasPeminjaman.Sapras.images,
              })
            ),
          })
        ),
      },
    });
  } catch (error) {
    logger.error("Error fetching proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateProsesPinjam = async (req, res) => {
  const { id } = req.params;
  const { userId, status } = req.body;

  try {
    const prosesPinjam = await prisma.prosessPinjam.update({
      where: {
        id: id,
      },
      data: {
        userId,
        status,
      },
    });

    logger.info("Proses peminjaman updated!");
    res
      .status(200)
      .json({ message: "Proses peminjaman updated!", prosesPinjam });
  } catch (error) {
    logger.error("Error updating proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteProsesPinjam = async (req, res) => {
  const { id } = req.params;

  try {
    const existingRecord = await prisma.prosessPinjam.findUnique({
      where: {
        id: id,
      },
      include: {
        DetailPeminjamanRuangan: true,
      },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Delete referencing records in saprasPeminjaman
    await prisma.saprasPeminjaman.deleteMany({
      where: {
        idProsessPinjam: id,
      },
    });

    // Delete referencing records in detailPeminjamanRuangan
    await prisma.detailPeminjamanRuangan.deleteMany({
      where: {
        idProsessPinjam: id,
      },
    });

    await prisma.prosessPinjam.delete({
      where: {
        id: id,
      },
    });

    logger.info("Proses peminjaman deleted!");
    res.status(200).json({ message: "Proses peminjaman deleted!" });
  } catch (error) {
    logger.error("Error deleting proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const checkProsesPinjam = async (req, res) => {
  const { idRuangan, date, startHour, endHour } = req.body;

  try {
    const prosesPinjam = await prisma.prosessPinjam.findMany({
      where: {
        status: "Disetujui",
        DetailPeminjamanRuangan: {
          some: {
            AND: [
              {
                idRuangan: idRuangan,
              },
              {
                date: date,
              },
              {
                OR: [
                  {
                    startHour: {
                      lte: startHour,
                    },
                    endHour: {
                      gte: startHour,
                    },
                  },
                  {
                    startHour: {
                      lte: endHour,
                    },
                    endHour: {
                      gte: endHour,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    });

    if (prosesPinjam.length > 0) {
      logger.info("Proses peminjaman found!");
      return res.status(200).json({
        message: "Sudah ada yang meminjam pada jam tersebut!",
        data: false,
      });
    }

    logger.info("Proses peminjaman not found!");
    res
      .status(200)
      .json({ message: "Ruangan tersedia di jam tersebut", data: true });
  } catch (error) {
    logger.error("Error checking proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const createPeminjamanRuangan = async (req, res) => {
  const { status = "Menunggu Persetujuan", detailPeminjamanRuangan } = req.body;

  const saprasPeminjaman = detailPeminjamanRuangan.saprasPeminjaman || [];

  try {
    const peminjamanRuangan = await prisma.prosessPinjam.create({
      data: {
        status,
        DetailPeminjamanRuangan: {
          create: {
            idRuangan: detailPeminjamanRuangan.idRuangan,
            employeeName: detailPeminjamanRuangan.employeeName,
            employeeDivision: detailPeminjamanRuangan.employeeDivision,
            employeeNik: detailPeminjamanRuangan.employeeNik,
            employeePhone: detailPeminjamanRuangan.employeePhone,
            employeeEmail: detailPeminjamanRuangan.employeeEmail,
            date: detailPeminjamanRuangan.date,
            startHour: detailPeminjamanRuangan.startHour,
            endHour: detailPeminjamanRuangan.endHour,
            people: detailPeminjamanRuangan.people,
            necessity: detailPeminjamanRuangan.necessity,
            additional: detailPeminjamanRuangan.additional,
            SaprasPeminjaman: {
              create: saprasPeminjaman.map((sapras) => ({
                idSapras: sapras.idSapras,
                quantity: sapras.quantity,
              })),
            },
          },
        },
      },
      include: {
        DetailPeminjamanRuangan: {
          include: {
            SaprasPeminjaman: true,
            Ruangan: true,
          },
        },
      },
    });

    logger.info("Peminjaman ruangan created!");

    const detail = peminjamanRuangan.DetailPeminjamanRuangan[0];
    const formattedDate = format(new Date(detail.date), "EEEE, dd MMMM yyyy", {
      locale: idLocale,
    });

    await transporter.sendMail({
      from: '"Tribun Solo 📰" <ulinnajaaldi.tech@gmail.com>',
      to: detailPeminjamanRuangan.employeeEmail,
      subject: "Peminjaman Ruangan",
      text: `Peminjaman ruangan ${detail.Ruangan.name} pada hari ${formattedDate} berhasil dibuat, silahkan tunggu konfirmasi dari admin!`,
      html: `<p>Peminjaman ruangan <b>${detail.Ruangan.name}</b> pada hari <b>${formattedDate}</b> berhasil dibuat, silahkan tunggu konfirmasi dari admin!</p>`,
    });

    await transporter.sendMail({
      from: '"Tribun Solo 📰 Peminjaman Ruang" <ulinnajaaldi.tech@gmail.com>',
      to: "<ulinnajaaldi.tech@gmail.com>",
      subject: "Peminjaman Ruangan",
      text: `Peminjaman ruang baru oleh ${detail.employeeName} pada tanggal ${formattedDate}, jam ${detail.startHour}-${detail.endHour} di ruangan ${detail.Ruangan.name} telah dibuat. Silahkan cek di dashboard admin untuk menyetujui atau menolak peminjaman!`,
      html: `<p>Peminjaman ruang baru oleh <b>${detail.employeeName}</b> pada tanggal <b>${formattedDate}</b>, jam <b>${detail.startHour}-${detail.endHour}</b> di ruangan <b>${detail.Ruangan.name}</b> telah dibuat. Silahkan cek di dashboard admin untuk menyetujui atau menolak peminjaman!</p>
             <p><a href=${process.env.PUBLIC_URL} style="color: white; background-color: blue; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>`,
    });

    res
      .status(201)
      .json({ message: "Peminjaman ruangan created!", peminjamanRuangan });
  } catch (error) {
    logger.error("Error creating peminjaman ruangan!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getPeminjamanBasedOnUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.user.id,
      },
      select: {
        username: true,
        ProsessPinjam: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            DetailPeminjamanRuangan: {
              include: {
                SaprasPeminjaman: {
                  select: {
                    quantity: true,
                    Sapras: {
                      select: {
                        name: true,
                        images: true,
                      },
                    },
                  },
                },
                Ruangan: {
                  select: {
                    name: true,
                    images: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      logger.error("User not found!");
      return res.status(404).json({ error: "User not found!" });
    }

    logger.info("Detail peminjaman fetched successfully!");
    res.status(200).json({
      message: "Detail peminjaman fetched successfully!",
      data: {
        detail: user.ProsessPinjam.map((prosesPinjam) => ({
          id: prosesPinjam.id,
          status: prosesPinjam.status,
          createdAt: prosesPinjam.createdAt,
          detailPeminjamanRuangan: prosesPinjam.DetailPeminjamanRuangan.map(
            (detailPeminjamanRuangan) => ({
              ruangan: detailPeminjamanRuangan.Ruangan.name,
              ruanganImage: JSON.parse(detailPeminjamanRuangan.Ruangan.images),
              date: detailPeminjamanRuangan.date,
              startHour: detailPeminjamanRuangan.startHour,
              endHour: detailPeminjamanRuangan.endHour,
              people: detailPeminjamanRuangan.people,
              necessity: detailPeminjamanRuangan.necessity,
              additional: detailPeminjamanRuangan.additional,
              saprasPeminjaman: detailPeminjamanRuangan.SaprasPeminjaman.map(
                (saprasPeminjaman) => ({
                  quantity: saprasPeminjaman.quantity,
                  sapras: saprasPeminjaman.Sapras,
                })
              ),
            })
          ),
        })),
      },
    });
  } catch (error) {
    logger.error("Error fetching detail peminjaman", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const acceptProsesPinjam = async (req, res) => {
  const { id } = req.params;

  try {
    const prosesPinjam = await prisma.prosessPinjam.update({
      where: {
        id: id,
      },
      data: {
        status: "Disetujui",
      },
      include: {
        DetailPeminjamanRuangan: {
          include: {
            Ruangan: true,
          },
        },
      },
    });

    const detail = prosesPinjam.DetailPeminjamanRuangan[0];
    if (!detail) {
      throw new Error("DetailPeminjamanRuangan not found");
    }

    const formattedDate = format(new Date(detail.date), "EEEE, dd MMMM yyyy", {
      locale: idLocale,
    });

    await transporter.sendMail({
      from: '"Tribun Solo 📰" <ulinnajaaldi.tech@gmail.com>',
      to: detail.employeeEmail,
      subject: `Peminjaman Ruang ${detail.Ruangan.name} Disetujui!`,
      text: `Peminjaman ruangan pada tanggal ${formattedDate}, jam ${detail.startHour}-${detail.endHour} di ruangan ${detail.Ruangan.name} telah disetujui!`,
      html: `<p>Peminjaman ruangan pada tanggal <b>${formattedDate}</b>, jam <b>${detail.startHour}-${detail.endHour}</b> di ruangan <b>${detail.Ruangan.name}</b> telah disetujui!</p>`,
    });

    logger.info("Proses peminjaman accepted!");

    res
      .status(200)
      .json({ message: "Proses peminjaman accepted!", prosesPinjam });
  } catch (error) {
    logger.error("Error accepting proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const rejectProsesPinjam = async (req, res) => {
  const { id } = req.params;

  try {
    const prosesPinjam = await prisma.prosessPinjam.update({
      where: {
        id: id,
      },
      data: {
        status: "Ditolak",
      },
      include: {
        DetailPeminjamanRuangan: {
          include: {
            Ruangan: true,
          },
        },
      },
    });

    const detail = prosesPinjam.DetailPeminjamanRuangan[0];
    if (!detail) {
      throw new Error("DetailPeminjamanRuangan not found");
    }

    const formattedDate = format(new Date(detail.date), "EEEE, dd MMMM yyyy", {
      locale: idLocale,
    });

    await transporter.sendMail({
      from: '"Tribun Solo 📰" <ulinnajaaldi.tech@gmail.com>',
      to: detail.employeeEmail,
      subject: `Peminjaman Ruang ${detail.Ruangan.name} Ditolak!`,
      text: `Peminjaman ruangan pada tanggal ${formattedDate}, jam ${detail.startHour}-${detail.endHour} di ruangan ${detail.Ruangan.name} telah ditolak!, Silahkan hubungi admin untuk keterangan lebih lanjut!`,
      html: `<p>Peminjaman ruangan pada tanggal <b>${formattedDate}</b>, jam <b>${detail.startHour}-${detail.endHour}</b> di ruangan <b>${detail.Ruangan.name}</b> telah ditolak!, Silahkan hubungi admin untuk keterangan lebih lanjut!</p>`,
    });

    logger.info("Proses peminjaman rejected!");
    res
      .status(200)
      .json({ message: "Proses peminjaman rejected!", prosesPinjam });
  } catch (error) {
    logger.error("Error rejecting proses peminjaman!", error.message);
    res.status(400).json({ error: error.message });
  }
};
