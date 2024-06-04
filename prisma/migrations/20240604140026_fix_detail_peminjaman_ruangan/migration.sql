/*
  Warnings:

  - Added the required column `people` to the `detail_peminjaman_ruangans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detail_peminjaman_ruangans" ADD COLUMN     "people" TEXT NOT NULL;
