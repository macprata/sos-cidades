import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DenunciasModule } from './denuncias/denuncias.module'; // Seu módulo original
import { UsersModule } from './users/users.module'; // O galho de usuários
import { AuthModule } from './auth/auth.module'; // O galho de autenticação (que estava faltando!)
import { PrismaModule } from './prisma/prisma.module';
import { CategoriasModule } from './categorias/categorias.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [PrismaModule, DenunciasModule, UsersModule, AuthModule, CategoriasModule, S3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
