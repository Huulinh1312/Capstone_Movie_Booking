import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() taiKhoan!: string;
  @IsString() @MinLength(6) matKhau!: string;
  @IsEmail() email!: string;
  @IsString() hoTen!: string;
  @IsString() @IsOptional() soDt?: string;
  @IsString() @IsOptional() maNhom?: string;
  @IsString() @IsOptional() maLoaiNguoiDung?: string;
}
