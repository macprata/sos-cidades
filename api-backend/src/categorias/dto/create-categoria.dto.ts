import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Iluminação Pública',
    description: 'Nome da categoria de denúncia',
  })
  nome: string;

  @ApiProperty({
    example: 'Problemas com lâmpadas queimadas ou postes',
    required: false,
  })
  descricao?: string;
}
