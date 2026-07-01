import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsuarioCreateInput) {
    // 1. Verifica se o e-mail já existe
    const emailExists = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (emailExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // 2. Verifica se o CPF já existe (se foi fornecido)
    if (data.cpf) {
      const cpfExists = await this.prisma.usuario.findFirst({
        where: { cpf: data.cpf },
      });

      if (cpfExists) {
        throw new ConflictException('Este CPF já está cadastrado.');
      }
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
  // Exemplo de como devem estar os métodos no UsersService
  async findById(id: number) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }
}
