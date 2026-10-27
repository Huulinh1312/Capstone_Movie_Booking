export default function Modal({ title, eyebrow = "CINEVERSE ADMIN", children, onClose, wide = false, tone = "red" }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a]/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
    <div className={`relative max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-[#111827] shadow-[0_25px_100px_rgba(0,0,0,.65)] ${wide ? "max-w-3xl" : "max-w-lg"}`}>
      <div className={`h-1.5 w-full rounded-t-3xl ${tone === "amber" ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-red-500 to-rose-400"}`} />
      <div className="p-6 sm:p-8"><div className="mb-7 flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.25em] text-red-300">{eyebrow}</p><h2 className="mt-2 text-2xl font-black text-white">{title}</h2></div><button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-400 hover:bg-red-500 hover:text-white" aria-label="Đóng">×</button></div>{children}</div>
    </div>
  </div>;
}

export function ConfirmDialog({ title, message, confirmLabel = "Xác nhận", onConfirm, onClose, busy = false, danger = true }) {
  return <Modal title={title} eyebrow="XÁC NHẬN THAO TÁC" onClose={onClose} tone={danger ? "red" : "amber"}><div className="flex gap-4 rounded-2xl border border-white/10 bg-[#0b0f19] p-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${danger ? "bg-red-500/15 text-red-300" : "bg-amber-500/15 text-amber-300"}`}>{danger ? "!" : "?"}</div><p className="text-sm leading-6 text-slate-300">{message}</p></div><div className="mt-7 flex justify-end gap-3"><button onClick={onClose} disabled={busy} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">Hủy</button><button onClick={onConfirm} disabled={busy} className={`rounded-xl px-5 py-3 text-sm font-black text-white disabled:opacity-50 ${danger ? "bg-red-500 hover:bg-red-400" : "bg-amber-500 text-black hover:bg-amber-400"}`}>{busy ? "Đang xử lý..." : confirmLabel}</button></div></Modal>;
}
