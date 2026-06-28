import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto'; // 1. Importe o DTO aqui

@ApiTags('usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário (Cidadão, Prefeitura ou Admin)',
  })
  create(@Body() data: CreateUserDto) {
    // 2. Troque o tipo Prisma.UsuarioCreateInput por CreateUserDto
    return this.usersService.create(data as any);
  }
}
