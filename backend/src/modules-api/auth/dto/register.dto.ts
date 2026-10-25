import { IsEmail, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsString() taiKhoan!: string;
  @IsString() @MinLength(6) matKhau!: string;
  @IsEmail() email!: string;
  @IsString() hoTen!: string;
  @IsString() soDt!: string;
}
