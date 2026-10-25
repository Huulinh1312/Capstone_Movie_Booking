import axiosInstance from "./axiosInstance";

export const movieApi = {
  // Lấy danh sách phim
  getMovieList: (maNhom = "GP01") => {
    return axiosInstance.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`);
  },
  // Lấy danh sách phim phân trang (cho Admin)
  getMovieListPhanTrang: (
    maNhom = "GP01",
    soTrang = 1,
    soPhanTuTrenTrang = 10,
  ) => {
    return axiosInstance.get(
      `/QuanLyPhim/LayDanhSachPhimPhanTrang?MaNhom=${maNhom}&soTrang=${soTrang}&soPhanTuTrenTrang=${soPhanTuTrenTrang}`,
    );
  },
  // Lấy chi tiết phim
  getMovieDetail: (maPhim) => {
    return axiosInstance.get(`/QuanLyPhim/LayThongTinPhim?maPhim=${maPhim}`);
  },
  // Thêm phim mới (upload hình)
  addMovieWithImage: async (movieData) => {
    try {
      const res = await axiosInstance.post(
        "/QuanLyPhim/ThemPhimUploadHinh",
        movieData,
      );
      return res;
    } catch (error) {
      console.log("Response:", error.response?.data);
      throw error;
    }
  },
  // Cập nhật phim (upload hình)
  updateMovieWithImage: (formData) => {
  return axiosInstance.post(
    "/QuanLyPhim/CapNhatPhimUpload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
},

  // Xóa phim
  deleteMovie: (maPhim) => {
    return axiosInstance.delete(`/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`);
  },
  // lấy danh sách banner
  getBanners: () => {
    return axiosInstance.get("/QuanLyPhim/LayDanhSachBanner");
  },
};
