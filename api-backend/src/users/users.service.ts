import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsuarioCreateInput) {
    const userExists = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);

    const user = await this.prisma.usuario.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });

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
