import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  hoTen?: string;

  @IsString()
  @IsOptional()
  soDt?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
