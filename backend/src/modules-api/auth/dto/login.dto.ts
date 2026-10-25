import { IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsString() taiKhoan!: string;
  @IsString() @MinLength(6) matKhau!: string;
}
