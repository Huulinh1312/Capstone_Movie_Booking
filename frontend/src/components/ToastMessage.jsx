import React from "react";

const ToastMessage = ({ visible, type = "success", message }) => {
  if (!visible) return null;

  const baseStyle =
    "fixed right-4 top-4 z-50 max-w-sm rounded-3xl border px-5 py-4 shadow-2xl transition-all duration-300 sm:right-6 sm:top-6";
  const colorStyle =
    type === "success"
      ? "border-emerald-400/30 bg-emerald-500/95 text-white"
      : "border-rose-400/30 bg-rose-500/95 text-white";

  return (
    <div className={`${baseStyle} ${colorStyle}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg">
          {type === "success" ? "✓" : "⚠"}
        </div>
        <div className="text-sm leading-5">{message}</div>
      </div>
    </div>
  );
};

export default ToastMessage;
