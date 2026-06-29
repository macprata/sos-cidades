import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data });
  }

  findAll() {
    return this.prisma.categoria.findMany({ where: { ativo: true } });
  }
}
