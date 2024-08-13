/*
  Warnings:

  - A unique constraint covering the columns `[qrcode]` on the table `qrcode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "qrcode" ALTER COLUMN "qrcode" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "qrcode_qrcode_key" ON "qrcode"("qrcode");
