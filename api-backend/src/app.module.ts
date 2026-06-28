import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DenunciasModule } from './denuncias/denuncias.module'; // Seu módulo original
import { UsersModule } from './users/users.module'; // O galho de usuários
import { AuthModule } from './auth/auth.module'; // O galho de autenticação (que estava faltando!)
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, DenunciasModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
