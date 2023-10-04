/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Contact";

-- CreateTable
CREATE TABLE "db_contactapps" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorhp" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "db_contactapps_pkey" PRIMARY KEY ("id")
);
