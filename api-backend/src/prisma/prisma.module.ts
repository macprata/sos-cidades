import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Isso é fundamental para injetar nos outros serviços
})
export class PrismaModule {}
