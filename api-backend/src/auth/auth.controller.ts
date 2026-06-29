import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('autenticacao')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Realizar login e obter token JWT de acesso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@soscidades.com.br' },
        senha: { type: 'string', example: 'SenhaForte123!' },
      },
    },
  })
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.login(signInDto.email, signInDto.senha);
  }
}
