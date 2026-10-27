export default function Modal({ title, children, onClose, wide = false }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#171c25] p-6 shadow-2xl ${wide ? "max-w-3xl" : "max-w-lg"}`}>
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-black text-white">{title}</h2><button onClick={onClose} className="rounded-full bg-white/10 px-3 py-1 text-slate-300 hover:bg-red-500 hover:text-white" aria-label="Đóng">×</button></div>
      {children}
    </div>
  </div>;
}
