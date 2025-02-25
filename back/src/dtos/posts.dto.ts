import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  public description: string;

  @IsOptional()
  @IsString()
  public media?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  public description?: string;
}
