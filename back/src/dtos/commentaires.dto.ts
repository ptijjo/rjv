import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(500)
  public contenu: string;
}

export class UpdateCommentaireDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  public contenu?: string;
}
