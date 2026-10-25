// custom hook để lấy danh sách phim

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { movieApi } from "../api/movieApi"

export const useMovieList = (maNhom = 'GP01') => {
    return useQuery({
        // queryKey: định danh duy nhất để lưu trong cache
        queryKey: ['movieList', maNhom],
        // queryFn: hàm thực hiện gọi API để lấy dữ liệu
        queryFn: async () => {
            const response = await movieApi.getMovieList(maNhom)
            return response.data.content
        }
    })
}

// Hook lấy danh sách phim phân trang (cho Admin)
export const useMovieListPhanTrang = (soTrang = 1, soPhanTuTrenTrang = 10) => {
    return useQuery({
        queryKey: ['movieListPhanTrang', soTrang, soPhanTuTrenTrang],
        queryFn: async () => {
            const response = await movieApi.getMovieListPhanTrang('GP01', soTrang, soPhanTuTrenTrang)
            return response.data.content // { currentPage, count, totalPages, totalCount, items }
        }
    })
}

export const useMovieDetail = (maPhim) => {
    return useQuery({
        queryKey: ['movieDetail', maPhim],
        queryFn: async () => {
            const response = await movieApi.getMovieDetail(maPhim)
            return response.data.content
        },
        enabled: maPhim !== undefined && maPhim !== null && maPhim !== "" // chỉ gọi API khi maPhim có giá trị hợp lệ
    })
}

// Hook thêm phim mới (cho Admin)
export const useAddMovie = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (movieData) => movieApi.addMovieWithImage(movieData),
        onSuccess: () => {
            // sau khi thêm phim thành công, invalidate cache để gọi lại API
            queryClient.invalidateQueries({ queryKey: ['movieListPhanTrang'] })
        }
    })
}

// Hook xóa phim (cho Admin)
export const useDeleteMovie = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (maPhim) => movieApi.deleteMovie(maPhim),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movieListPhanTrang'] })
        }
    })
}