import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DenunciasModule } from './denuncias/denuncias.module';

@Module({
  imports: [DenunciasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
