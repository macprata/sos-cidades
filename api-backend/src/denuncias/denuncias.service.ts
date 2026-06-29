import { Injectable } from '@nestjs/common';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class DenunciasService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(data: any, file: Express.Multer.File) {
    const fileUrl = await this.s3Service.uploadFile(
      file,
      `denuncias/${Date.now()}-${file.originalname}`,
    );

    return this.prisma.denuncia.create({
      data: {
        descricao: data.descricao,
        midiaUrl: fileUrl,
        categoriaId: Number(data.categoriaId),
        usuarioId: Number(data.userId),
        // Adicione estas linhas abaixo:
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      },
    });
  }

  async findAll() {
    return await this.prisma.denuncia.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} denuncia`;
  }

  update(id: number, updateDenunciaDto: UpdateDenunciaDto) {
    console.log(updateDenunciaDto);
    return `This action updates a #${id} denuncia`;
  }

  remove(id: number) {
    return `This action removes a #${id} denuncia`;
  }
}
