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

  async create(data: any, file: Express.Multer.File, usuarioId: number) {
    console.log(' Passo 1: Entrou no Service');

    try {
      let fileUrl: string | null = null;

      if (file) {
        console.log(' Passo 2: Iniciando upload para o S3...');
        fileUrl = await this.s3Service.uploadFile(
          file,
          `denuncias/${Date.now()}-${file.originalname}`,
        );
        console.log(' Passo 3: Upload S3 concluído ->', fileUrl);
      } else {
        console.log(' Passo 2/3: Nenhuma imagem anexada, pulando S3.');
      }

      console.log(' Passo 4: Tentando salvar no banco de dados via Prisma...');
      const novaDenuncia = await this.prisma.denuncia.create({
        data: {
          descricao: data.descricao,
          midiaUrl: fileUrl,

          categoriaId: Number(data.categoriaId),
          usuarioId: usuarioId,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),

          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          pontoReferencia: data.pontoReferencia,
        },
      });

      console.log(
        ' Passo 5: Sucesso! Denúncia salva no banco:',
        novaDenuncia.id,
      );
      return novaDenuncia;
    } catch (error) {
      console.error('❌ ERRO FATAL DETECTADO:', error);
      throw error;
    }
  }
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.denuncia.findMany({ skip, take: Number(limit) }),
      this.prisma.denuncia.count(),
    ]);

    return { data, total, page, limit };
  }

  // No denuncias.service.ts
  async findOne(id: number, usuarioId: number) {
    return this.prisma.denuncia.findFirst({
      where: {
        id,
        usuarioId, // Garante que o usuário só veja as denúncias dele
      },
      include: {
        categoria: true, // Traz os dados da categoria junto
      },
    });
  }

  update(id: number, updateDenunciaDto: UpdateDenunciaDto) {
    console.log(updateDenunciaDto);
    return `This action updates a #${id} denuncia`;
  }

  remove(id: number) {
    return `This action removes a #${id} denuncia`;
  }
  async findMinhasDenuncias(usuarioId: number) {
    return this.prisma.denuncia.findMany({
      where: { usuarioId },
      orderBy: { dataCriacao: 'desc' }, // Traz as mais recentes primeiro
      take: 4, // Limita diretamente no banco de dados
    });
  }
}
