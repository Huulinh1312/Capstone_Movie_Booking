import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @IsString() tenPhim!: string;
  @IsString() @IsOptional() maNhom?: string;
  @IsString() @IsOptional() trailer?: string;
  @IsString() @IsOptional() moTa?: string;
  @IsString() @IsOptional() hinhAnh?: string;
  @IsString() @IsOptional() ngayKhoiChieu?: string;
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  })
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  danhGia?: number;
}
