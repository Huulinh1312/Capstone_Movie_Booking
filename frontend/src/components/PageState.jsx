export function LoadingState({ label = "Đang tải dữ liệu..." }) {
  return <div className="flex min-h-52 items-center justify-center rounded-2xl border border-white/10 bg-[#111827] text-sm text-slate-400"><span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />{label}</div>;
}

export function EmptyState({ title = "Chưa có dữ liệu", description = "Nội dung sẽ được cập nhật sớm." }) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-[#111827] p-12 text-center"><div className="text-4xl">◌</div><h2 className="mt-4 font-bold text-white">{title}</h2><p className="mt-2 text-sm text-slate-400">{description}</p></div>;
}
