-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prosess_pinjams" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prosess_pinjams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ruangans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "facilities" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ruangans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_peminjaman_ruangans" (
    "idRuangan" TEXT NOT NULL,
    "idProsessPinjam" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeDivision" TEXT NOT NULL,
    "employeeNik" TEXT NOT NULL,
    "employeePhone" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startHour" TEXT NOT NULL,
    "endHour" TEXT NOT NULL,
    "necessity" TEXT NOT NULL,
    "additional" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detail_peminjaman_ruangans_pkey" PRIMARY KEY ("idRuangan","idProsessPinjam")
);

-- CreateTable
CREATE TABLE "sapras" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "ammount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sapras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sapras_peminjamans" (
    "idSapras" TEXT NOT NULL,
    "idRuangan" TEXT NOT NULL,
    "idProsessPinjam" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sapras_peminjamans_pkey" PRIMARY KEY ("idSapras","idRuangan","idProsessPinjam")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "detail_peminjaman_ruangans" ADD CONSTRAINT "detail_peminjaman_ruangans_idRuangan_fkey" FOREIGN KEY ("idRuangan") REFERENCES "ruangans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_peminjaman_ruangans" ADD CONSTRAINT "detail_peminjaman_ruangans_idProsessPinjam_fkey" FOREIGN KEY ("idProsessPinjam") REFERENCES "prosess_pinjams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sapras_peminjamans" ADD CONSTRAINT "sapras_peminjamans_idSapras_fkey" FOREIGN KEY ("idSapras") REFERENCES "sapras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sapras_peminjamans" ADD CONSTRAINT "sapras_peminjamans_idRuangan_idProsessPinjam_fkey" FOREIGN KEY ("idRuangan", "idProsessPinjam") REFERENCES "detail_peminjaman_ruangans"("idRuangan", "idProsessPinjam") ON DELETE RESTRICT ON UPDATE CASCADE;
