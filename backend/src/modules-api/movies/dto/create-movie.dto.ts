import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @IsString() tenPhim!: string;
  @IsString() @IsOptional() maNhom?: string;
  @IsString() @IsOptional() trailer?: string;
  @IsString() @IsOptional() moTa?: string;
  @IsString() @IsOptional() hinhAnh?: string;
  @IsString() @IsOptional() ngayKhoiChieu?: string;
  @IsInt() @Min(0) @Max(10) @IsOptional() danhGia?: number;
}
