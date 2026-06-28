import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service';

describe('DenunciasController', () => {
  let controller: DenunciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DenunciasController],
      providers: [DenunciasService],
    }).compile();

    controller = module.get<DenunciasController>(DenunciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
