/*
  Warnings:

  - You are about to drop the `Interacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interacao" DROP CONSTRAINT "Interacao_denunciaId_fkey";

-- DropForeignKey
ALTER TABLE "Interacao" DROP CONSTRAINT "Interacao_usuarioId_fkey";

-- DropTable
DROP TABLE "Interacao";

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "statusAnterior" TEXT,
    "statusNovo" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "denunciaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "denuncias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
