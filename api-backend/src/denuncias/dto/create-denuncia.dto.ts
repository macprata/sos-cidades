// Exemplo de campos necessários no seu DTO
export class CreateDenunciaDto {
  categoriaId!: string;
  descricao!: string;
  cep!: string;
  logradouro!: string;
  numero!: string;
  complemento!: string;
  bairro!: string;
  cidade!: string;
  estado!: string;
  pontoReferencia!: string;
  latitude!: number;
  longitude!: number;
}
