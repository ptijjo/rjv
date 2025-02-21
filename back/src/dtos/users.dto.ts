import { Role } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public password?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(16)
  @IsNotEmpty()
  public pseudo: string;

  @IsOptional()
  @IsString()
  public googleId?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(9)
  @MaxLength(32)
  public password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  public pseudo?: string;

  @IsOptional()
  @IsString()
  public avatar?: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Role))
  public role?: string;
}
