-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pass" TEXT NOT NULL DEFAULT '-',
    "id_number" TEXT NOT NULL,
    "qr" TEXT NOT NULL DEFAULT '-',
    "phone" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" INTEGER NOT NULL,
    "number" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL DEFAULT '-',
    "id_qrcode" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "clientes_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qrcode" (
    "id" INTEGER NOT NULL,
    "qrcode" VARCHAR NOT NULL,
    "path" TEXT NOT NULL,
    "impresso" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "qrcode_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qrcodes" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "jpeg_name" TEXT,
    "fast_id" INTEGER,
    "nome_associado" TEXT,
    "impresso" TEXT,

    CONSTRAINT "qrcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cams" (
    "id" SERIAL NOT NULL,
    "xaddr" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "pass" TEXT NOT NULL,

    CONSTRAINT "cams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_number_key" ON "Client"("id_number");

-- CreateIndex
CREATE UNIQUE INDEX "Client_qr_key" ON "Client"("qr");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_pk2" ON "clientes"("id_qrcode");

-- CreateIndex
CREATE UNIQUE INDEX "qrcodes_pk" ON "qrcodes"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "qrcodes_pk2" ON "qrcodes"("fast_id");
