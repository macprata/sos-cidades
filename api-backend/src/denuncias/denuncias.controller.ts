import {
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
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
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.denunciasService.create(body, file);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.denunciasService.findAll(Number(page), Number(limit));
  }
}
