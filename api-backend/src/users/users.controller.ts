import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importe o Guarda

@ApiTags('usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data as any);
  }

  // --- NOVA ROTA PROTEGIDA ---
  @Get()
  @UseGuards(JwtAuthGuard) // <-- O SEGURANÇA NA PORTA
  @ApiBearerAuth() // <-- AVISA O SWAGGER QUE PRECISA DO CADEADO
  @ApiOperation({ summary: 'Listar todos os usuários (Requer Token)' })
  findAll() {
    return this.usersService.findAll();
  }
}
