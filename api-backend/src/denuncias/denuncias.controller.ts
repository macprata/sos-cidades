import {
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DenunciasService } from './denuncias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('denuncias')
@ApiBearerAuth()
@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly denunciasService: DenunciasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        descricao: { type: 'string' },
        categoriaId: { type: 'integer' },
        usuarioId: { type: 'integer' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        cep: { type: 'string' },
        logradouro: { type: 'string' },
        numero: { type: 'string' },
        complemento: { type: 'string' },
        bairro: { type: 'string' },
        cidade: { type: 'string' },
        estado: { type: 'string' },
        pontoReferencia: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @Req() req,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // O ID do usuário logado está dentro do token que o JwtAuthGuard já validou
    const usuarioId = req.user.id;

    return this.denunciasService.create(body, file, usuarioId);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.denunciasService.findAll(Number(page), Number(limit));
  }

  @Get('minhas')
  @UseGuards(JwtAuthGuard)
  async getMinhasDenuncias(@Req() req) {
    const usuarioId = req.user.id;
    return this.denunciasService.findMinhasDenuncias(usuarioId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const usuarioId = req.user.id; // Extraído de forma segura do token JWT

    const denuncia = await this.denunciasService.findOne(id, usuarioId);

    // Se o banco não encontrar nada (ou se a denúncia for de outro usuário), retornamos um erro 404
    if (!denuncia) {
      throw new NotFoundException(
        'Protocolo não encontrado ou você não tem permissão para visualizá-lo.',
      );
    }

    return denuncia;
  }

  @Post(':id/movimentacoes')
  @UseGuards(JwtAuthGuard)
  async criarMovimentacao(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body('mensagem') mensagem: string,
  ) {
    const usuarioId = req.user.id;
    return this.denunciasService.adicionarMovimentacao(id, usuarioId, mensagem);
  }
}
