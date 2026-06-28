import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importante!

@Module({
  imports: [PrismaModule], // Conecta com o banco
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos para usar na autenticação depois
})
export class UsersModule {}
