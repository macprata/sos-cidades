import { Injectable } from '@nestjs/common';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DenunciasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.denuncia.create({ data });
  }

  async findAll() {
    return await this.prisma.denuncia.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} denuncia`;
  }

  update(id: number, updateDenunciaDto: UpdateDenunciaDto) {
    // Dando um console.log apenas para o Linter parar de reclamar de variável sem uso
    console.log(updateDenunciaDto);
    return `This action updates a #${id} denuncia`;
  }

  remove(id: number) {
    return `This action removes a #${id} denuncia`;
  }
}
