import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DenunciasModule } from './denuncias/denuncias.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriasModule } from './categorias/categorias.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    PrismaModule,
    DenunciasModule,
    UsersModule,
    AuthModule,
    CategoriasModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
