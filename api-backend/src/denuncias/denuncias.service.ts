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

  async findOne(id: number, usuarioId: number) {
    const denuncia = await this.prisma.denuncia.findFirst({
      where: {
        id,
        usuarioId,
      },
      include: {
        categoria: true,
        movimentacoes: {
          include: { usuario: { select: { nome: true } } },
          orderBy: { dataCriacao: 'desc' },
        },
      },
    });

    if (!denuncia) return null;

    // Assina a URL se existir
    const midiaUrlSegura = denuncia.midiaUrl
      ? await this.s3Service.gerarUrlTemporaria(denuncia.midiaUrl)
      : null;

    return { ...denuncia, midiaUrl: midiaUrlSegura };
  }

  async adicionarMovimentacao(
    denunciaId: number,
    usuarioId: number,
    mensagem: string,
  ) {
    // 1. Verifica se a denúncia existe e se pertence ao usuário para garantir a segurança
    const denuncia = await this.prisma.denuncia.findFirst({
      where: { id: denunciaId, usuarioId: usuarioId },
    });

    if (!denuncia) {
      // Importe NotFoundException do '@nestjs/common' no topo do arquivo se ainda não tiver
      throw new (await import('@nestjs/common')).NotFoundException(
        'Denúncia não encontrada.',
      );
    }

    // 2. Grava a movimentação na sua tabela
    return this.prisma.movimentacao.create({
      data: {
        mensagem,
        denunciaId,
        usuarioId, // Mapeado exatamente para a coluna da sua tabela
      },
      include: {
        usuario: {
          // Traz o nome de quem fez a movimentação para exibir no frontend
          select: { nome: true },
        },
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
    // 1. Busca as denúncias com o relacionamento da categoria
    const denuncias = await this.prisma.denuncia.findMany({
      where: { usuarioId },
      include: {
        categoria: true,
      },
      orderBy: { dataCriacao: 'desc' },
    });

    // 2. Transforma as URLs para versões temporárias assinadas (segurança privada)
    const denunciasComUrlsSeguras = await Promise.all(
      denuncias.map(async (denuncia) => {
        return {
          ...denuncia,
          midiaUrl: denuncia.midiaUrl
            ? await this.s3Service.gerarUrlTemporaria(denuncia.midiaUrl)
            : null,
        };
      }),
    );

    return denunciasComUrlsSeguras;
  }
}
