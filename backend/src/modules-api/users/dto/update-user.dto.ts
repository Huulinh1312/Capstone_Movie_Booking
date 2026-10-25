import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString() taiKhoan!: string;
  @IsString() @IsOptional() @MinLength(6) matKhau?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() hoTen?: string;
  @IsString() @IsOptional() soDt?: string;
  @IsString() @IsOptional() maNhom?: string;
  @IsString() @IsOptional() maLoaiNguoiDung?: string;
}
