-- CreateTable
CREATE TABLE "Interacao" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "statusAnterior" TEXT,
    "statusNovo" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "denunciaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Interacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "denuncias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
