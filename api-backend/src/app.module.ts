import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DenunciasModule } from './denuncias/denuncias.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [DenunciasModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
