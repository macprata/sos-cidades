import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realizar login e obter o token JWT' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.senha);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar os dados do perfil logado' })
  async getPerfil(@Request() req) {
    const idExtraido = req.user.sub || req.user.id || req.user.userId;
    const usuarioId = Number(idExtraido);

    return this.authService.getPerfil(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('perfil')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar senha ou e-mail do perfil logado' })
  async updatePerfil(@Request() req, @Body() body: UpdatePerfilDto) {
    // CORREÇÃO: Capturando o ID com segurança e convertendo para número
    const idExtraido = req.user.id || req.user.sub || req.user.userId;
    const usuarioId = Number(idExtraido);

    return this.authService.updatePerfil(usuarioId, body);
  }
}
