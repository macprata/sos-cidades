import { Injectable } from '@nestjs/common';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';

@Injectable()
export class DenunciasService {
  create(createDenunciaDto: CreateDenunciaDto) {
    return {
      mensagem: 'Denúncia recebida com sucesso pela prefeitura!',
      protocolo: Math.floor(Math.random() * 1000000),
      dados: createDenunciaDto,
      status: 'Registrada',
    };
  }

  findAll() {
    return `This action returns all denuncias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} denuncia`;
  }

  update(id: number, updateDenunciaDto: UpdateDenunciaDto) {
    // Dando um console.log apenas para o Linter parar de reclamar de variável sem uso
    console.log(updateDenunciaDto);
    return `This action updates a #${id} denuncia`;
  }

  remove(id: number) {
    return `This action removes a #${id} denuncia`;
  }
}
