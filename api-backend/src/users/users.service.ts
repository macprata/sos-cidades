import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Função robusta para criar usuário com senha criptografada
  async create(data: Prisma.UsuarioCreateInput) {
    // 1. Verifica se o email já existe
    const userExists = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // 2. Criptografa a senha (10 rounds de salt é o padrão de mercado)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);

    // 3. Salva no banco com a senha segura
    const user = await this.prisma.usuario.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });

    // 4. Remove a senha do objeto de retorno por segurança
    const { senha, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }
  async findAll() {
    return this.prisma.usuario.findMany();
  }
}
