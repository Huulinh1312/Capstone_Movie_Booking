import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class BookingSeatDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maGhe!: number;
}

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maLichChieu!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingSeatDto)
  danhSachVe!: BookingSeatDto[];
}
