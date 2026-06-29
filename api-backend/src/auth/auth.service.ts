import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const payload = { sub: user.id, email: user.email, perfil: user.perfil };

    return {
      access_token: await this.jwtService.signAsync(payload),
      perfil: user.perfil,
    };
  }
}
