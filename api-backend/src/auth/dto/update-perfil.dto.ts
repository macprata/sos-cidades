import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePerfilDto {
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha?: string;
}
