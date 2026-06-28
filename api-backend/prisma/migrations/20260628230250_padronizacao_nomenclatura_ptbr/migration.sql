/*
  Warnings:

  - You are about to drop the column `criadoEm` on the `categorias` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `denuncias` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `denuncias` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `denuncias` table. All the data in the column will be lost.
  - You are about to drop the column `midiaUrl` on the `denuncias` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `denuncias` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `data_atualizacao` to the `categorias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria_id` to the `denuncias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_atualizacao` to the `denuncias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_atualizacao` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMINISTRADOR', 'PREFEITURA', 'CIDADAO');

-- DropForeignKey
ALTER TABLE "denuncias" DROP CONSTRAINT "denuncias_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "denuncias" DROP CONSTRAINT "denuncias_usuarioId_fkey";

-- AlterTable
ALTER TABLE "categorias" DROP COLUMN "criadoEm",
ADD COLUMN     "data_atualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "denuncias" DROP COLUMN "atualizadoEm",
DROP COLUMN "categoriaId",
DROP COLUMN "criadoEm",
DROP COLUMN "midiaUrl",
DROP COLUMN "usuarioId",
ADD COLUMN     "categoria_id" INTEGER NOT NULL,
ADD COLUMN     "data_atualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "midia_url" TEXT,
ADD COLUMN     "usuario_id" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "criadoEm",
DROP COLUMN "role",
ADD COLUMN     "data_atualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "perfil" "Perfil" NOT NULL DEFAULT 'CIDADAO';

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
