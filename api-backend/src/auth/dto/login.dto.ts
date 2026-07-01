import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@soscidades.com.br',
    description: 'E-mail cadastrado no sistema',
  })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'SenhaForte123!',
    description: 'Senha de acesso',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;
}
