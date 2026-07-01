import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
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

  // --- NOVOS MÉTODOS PARA O PERFIL ---

  async getPerfil(usuarioId: number) {
    // Presume-se que você tenha um método findById ou findOne no UsersService
    const user = await this.usersService.findById(usuarioId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Removemos a senha antes de retornar os dados
    const { senha, ...dadosPerfil } = user;
    return dadosPerfil;
  }

  async updatePerfil(
    usuarioId: number,
    data: { email?: string; senha?: string },
  ) {
    const dadosAtualizacao: any = {};

    if (data.email) {
      dadosAtualizacao.email = data.email;
    }

    if (data.senha) {
      const saltRounds = 10;
      // Reutilizando o bcrypt que você já importou
      dadosAtualizacao.senha = await bcrypt.hash(data.senha, saltRounds);
    }

    // Presume-se que você tenha um método update no UsersService
    const userUpdated = await this.usersService.update(
      usuarioId,
      dadosAtualizacao,
    );

    const { senha, ...dadosPerfil } = userUpdated;
    return dadosPerfil;
  }
}
