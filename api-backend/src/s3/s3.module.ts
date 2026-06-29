import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service], // <--- IMPORTANTE: Isso libera o serviço para outros módulos!
})
export class S3Module {}
