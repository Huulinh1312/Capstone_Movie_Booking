import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { MoviesService } from './movies.service';
import { Role } from '../../common/decorators/role.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';

const uploadDirectory = join(process.cwd(), 'uploads');
if (!existsSync(uploadDirectory)) mkdirSync(uploadDirectory, { recursive: true });
const movieImageUpload = {
  storage: diskStorage({
    destination: uploadDirectory,
    filename: (_request: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname).toLowerCase()}`;
      callback(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      callback(new Error('Chỉ chấp nhận file JPG, PNG hoặc WEBP'), false);
      return;
    }
    callback(null, true);
  },
};

@Controller('QuanLyPhim')
@ApiTags('QuanLyPhim')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Public()
  @Get('LayDanhSachPhim')
  @ApiOperation({ summary: 'Lấy danh sách phim' })
  @ApiQuery({ name: 'maNhom', required: false, example: 'GP01', description: 'Mã nhóm phim' })
  @ApiResponse({ status: 200, description: 'Danh sách phim' })
  findAll(@Query('maNhom') groupCode?: string) {
    return this.moviesService.findAll(groupCode);
  }

  @Public()
  @Get('LayThongTinPhim')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết phim' })
  @ApiQuery({ name: 'maPhim', required: true, type: Number, example: 1 })
  findOne(@Query('maPhim', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Public()
  @Get('LayDanhSachBanner')
  @ApiOperation({ summary: 'Lấy danh sách banner' })
  getBanners() { return this.moviesService.getBanners(); }

  @Public()
  @Get('LayDanhSachPhimPhanTrang')
  @ApiOperation({ summary: 'Lấy danh sách phim phân trang' })
  @ApiQuery({ name: 'MaNhom', required: false, example: 'GP01' })
  @ApiQuery({ name: 'soTrang', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, type: Number, example: 10 })
  findPaginated(@Query('MaNhom') groupCode = 'GP01', @Query('soTrang') page = '1', @Query('soPhanTuTrenTrang') size = '10') {
    return this.moviesService.findPaginated(groupCode, Number(page), Number(size));
  }

  @Public()
  @Get('LayDanhSachPhimTheoNgay')
  @ApiOperation({ summary: 'Lấy danh sách phim theo khoảng ngày' })
  @ApiQuery({ name: 'maNhom', required: false, example: 'GP01' })
  @ApiQuery({ name: 'tuNgay', required: true, example: '2026-01-01' })
  @ApiQuery({ name: 'denNgay', required: true, example: '2026-12-31' })
  @ApiQuery({ name: 'soTrang', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, type: Number, example: 10 })
  findByDate(@Query('maNhom') groupCode = 'GP01', @Query('tuNgay') from: string, @Query('denNgay') to: string, @Query('soTrang') page = '1', @Query('soPhanTuTrenTrang') size = '10') {
    return this.moviesService.findByDate(groupCode, new Date(from), new Date(to), Number(page), Number(size));
  }

  @Post('ThemPhimUploadHinh')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Thêm phim mới kèm hình ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['file', 'tenPhim', 'maNhom'], properties: { file: { type: 'string', format: 'binary' }, tenPhim: { type: 'string', example: 'Avengers' }, maNhom: { type: 'string', example: 'GP01' }, trailer: { type: 'string', example: 'https://youtube.com/watch?v=demo' }, moTa: { type: 'string', example: 'Mô tả phim' }, ngayKhoiChieu: { type: 'string', example: '2026-10-24' }, danhGia: { type: 'integer', example: 5 } } } })
  @UseInterceptors(FileInterceptor('file', movieImageUpload))
  create(@Body() body: CreateMovieDto, @UploadedFile() file?: Express.Multer.File) {
    return this.moviesService.create({ name: body.tenPhim, groupCode: body.maNhom, trailer: body.trailer, description: body.moTa, image: file ? `/uploads/${file.filename}` : body.hinhAnh, rating: Number(body.danhGia || 5), releaseDate: body.ngayKhoiChieu ? new Date(body.ngayKhoiChieu) : undefined });
  }

  @Post('QuanLyPhim')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Thêm phim theo form upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', movieImageUpload))
  createMovie(@Body() body: CreateMovieDto, @UploadedFile() file?: Express.Multer.File) { return this.create(body, file); }

  @Post('CapNhatPhimUpload')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Cập nhật phim kèm hình ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['maPhim', 'tenPhim'], properties: { file: { type: 'string', format: 'binary' }, maPhim: { type: 'integer', example: 1 }, tenPhim: { type: 'string', example: 'Avengers Updated' }, maNhom: { type: 'string', example: 'GP01' }, trailer: { type: 'string' }, moTa: { type: 'string' }, danhGia: { type: 'integer', example: 5 } } } })
  @UseInterceptors(FileInterceptor('file', movieImageUpload))
  update(@Body() body: CreateMovieDto & { maPhim: number }, @UploadedFile() file?: Express.Multer.File) {
    return this.moviesService.update(Number(body.maPhim), { name: body.tenPhim, groupCode: body.maNhom, trailer: body.trailer, description: body.moTa, image: file ? `/uploads/${file.filename}` : body.hinhAnh, rating: Number(body.danhGia || 5) });
  }

  @Delete('XoaPhim')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Xóa phim' })
  @ApiQuery({ name: 'MaPhim', required: true, type: Number, example: 1 })
  remove(@Query('MaPhim', ParseIntPipe) id: number) { return this.moviesService.remove(id); }

  @Delete('XP')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Xóa phim (tên route rút gọn)' })
  @ApiQuery({ name: 'MaPhim', required: true, type: Number, example: 1 })
  removeAlias(@Query('MaPhim', ParseIntPipe) id: number) { return this.moviesService.remove(id); }
}
