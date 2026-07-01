import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Administrador SOS Cidades',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'admin@soscidades.com.br',
    description: 'E-mail para login',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '00000000000',
    required: false,
    description: 'CPF opcional',
  })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({ example: 'SenhaForte123!', description: 'Senha de acesso' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({
    example: 'ADMINISTRADOR',
    enum: ['ADMINISTRADOR', 'PREFEITURA', 'CIDADAO'],
    description: 'Nível de acesso no sistema',
  })
  @IsEnum(['ADMINISTRADOR', 'PREFEITURA', 'CIDADAO'])
  @IsNotEmpty()
  perfil: 'ADMINISTRADOR' | 'PREFEITURA' | 'CIDADAO';

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
