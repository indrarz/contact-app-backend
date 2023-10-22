-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorhp" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
