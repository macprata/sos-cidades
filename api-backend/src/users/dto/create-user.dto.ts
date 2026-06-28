import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Administrador SOS Cidades',
    description: 'Nome completo do usuário',
  })
  nome: string;

  @ApiProperty({
    example: 'admin@soscidades.com.br',
    description: 'E-mail para login',
  })
  email: string;

  @ApiProperty({
    example: '000.000.000-00',
    required: false,
    description: 'CPF opcional',
  })
  cpf?: string;

  @ApiProperty({ example: 'SenhaForte123!', description: 'Senha de acesso' })
  senha: string;

  @ApiProperty({
    example: 'ADMINISTRADOR',
    enum: ['ADMINISTRADOR', 'PREFEITURA', 'CIDADAO'],
    description: 'Nível de acesso no sistema',
  })
  perfil: 'ADMINISTRADOR' | 'PREFEITURA' | 'CIDADAO';

  @ApiProperty({ example: true, required: false, default: true })
  ativo?: boolean;
}
