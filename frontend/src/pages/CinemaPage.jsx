import { useEffect, useState } from "react";
import { cinemaApi } from "../api/cinemaApi";

export default function CinemaPage() {
  const [systems, setSystems] = useState([]); const [selected, setSelected] = useState(""); const [cinemas, setCinemas] = useState([]); const [error, setError] = useState("");
  useEffect(() => { cinemaApi.getHeThongRap().then(({ data }) => { const list = Array.isArray(data) ? data : [data].filter(Boolean); setSystems(list); if (list[0]) setSelected(list[0].code); }).catch((e) => setError(e.response?.data?.message || "Không tải được hệ thống rạp")); }, []);
  useEffect(() => { if (selected) cinemaApi.getCumRapTheoHeThong(selected).then(({ data }) => setCinemas(Array.isArray(data) ? data : [data].filter(Boolean))).catch(() => setCinemas([])); }, [selected]);
  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-12"><h1 className="text-4xl font-black">Hệ thống rạp</h1>{error && <p className="mt-3 text-red-300">{error}</p>}<div className="mt-8 flex flex-wrap gap-3">{systems.map((s) => <button key={s.code} onClick={() => setSelected(s.code)} className={`rounded-xl px-5 py-3 ${selected === s.code ? "bg-red-600" : "bg-slate-800"}`}>{s.name}</button>)}</div><div className="mt-8 grid gap-5 md:grid-cols-2">{cinemas.map((c) => <article className="rounded-2xl bg-slate-900 p-5" key={c.id}><h2 className="text-xl font-bold">{c.name}</h2><p className="mt-2 text-slate-400">{c.address}</p><h3 className="mt-5 font-semibold">Phòng chiếu</h3>{c.rooms?.map((r) => <p className="mt-1 text-slate-300" key={r.id}>{r.name} · {r.code}</p>)}</article>)}</div></main>;
}
