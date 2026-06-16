import { useState, useEffect } from "react";
import api from "../../lib/axios";

type Track = "web_design" | "sales_marketing" | "social_media" | "digital_marketing";

interface PublishedEntry {
  id: string;
  track: Track;
  title: string;
  outcome: string;
  tools_used: string[];
  submission_type: "code" | "file" | "link";
  repo_url: string;
  live_url: string;
  file_urls: string[];
  created_at: string;
  intern: { name: string };
}

const TRACKS: { value: Track | "all"; label: string; icon: string }[] = [
  { value: "all",               label: "All",               icon: "🌐" },
  { value: "web_design",        label: "Web Design",        icon: "🎨" },
  { value: "sales_marketing",   label: "Sales & Marketing", icon: "📈" },
  { value: "social_media",      label: "Social Media",      icon: "📱" },
  { value: "digital_marketing", label: "Digital Marketing", icon: "🚀" },
];

const TRACK_COLOR: Record<Track, string> = {
  web_design:        "bg-purple-100 text-purple-700",
  sales_marketing:   "bg-blue-100 text-blue-700",
  social_media:      "bg-pink-100 text-pink-700",
  digital_marketing: "bg-orange-100 text-orange-700",
};

export default function PublicPortfolioView() {
  const [entries, setEntries]     = useState<PublishedEntry[]>([]);
  const [filter, setFilter]       = useState<Track | "all">("all");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<PublishedEntry | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchPublished(); }, [filter]);

  async function fetchPublished() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter !== "all") params.track = filter;
      const { data } = await api.get<PublishedEntry[]>("/api/portfolio/submissions/published", { params });
      setEntries(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  const visible = entries.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.intern.name.toLowerCase().includes(search.toLowerCase()) ||
    e.outcome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Intern Portfolio</h1>
          <p className="text-gray-500 text-[14px] mt-1">Browse verified work from Emerson Professional interns.</p>

          {/* Search */}
          <div className="relative mt-5 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, intern or outcome…"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4B1E91] transition"
            />
          </div>
        </div>
      </div>

      {/* Track filters */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {TRACKS.map((t) => (
              <button key={t.value} onClick={() => setFilter(t.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-[12px] uppercase tracking-wider whitespace-nowrap transition ${
                  filter === t.value
                    ? "bg-[#4B1E91] text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#4B1E91] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-[15px] font-medium text-gray-500">No published portfolios yet</p>
            <p className="text-[13px] mt-1">Check back soon — new work is being reviewed.</p>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-gray-400 mb-5">{visible.length} portfolio {visible.length === 1 ? "entry" : "entries"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)} className="text-left group">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full">

                    {/* Thumbnail */}
                    <div className="h-40 bg-gradient-to-br from-[#4B1E91]/10 to-[#4B1E91]/5 flex items-center justify-center overflow-hidden">
                      {e.file_urls?.[0] && e.file_urls[0].match(/\.(jpg|jpeg|png|webp|gif)$/i)
                        ? <img src={e.file_urls[0]} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <span className="text-5xl opacity-30">
                            {e.track === "web_design" ? "🎨" : e.track === "sales_marketing" ? "📈" : e.track === "social_media" ? "📱" : "🚀"}
                          </span>
                      }
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TRACK_COLOR[e.track]}`}>
                          {e.track.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] text-gray-400">{new Date(e.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-bold text-gray-900 text-[15px] leading-snug mb-1 group-hover:text-[#4B1E91] transition-colors">
                        {e.title}
                      </p>
                      <p className="text-[12px] text-gray-500 font-medium mb-2">{e.intern?.name}</p>
                      <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2">{e.outcome}</p>

                      {/* Tools */}
                      {e.tools_used?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {e.tools_used.slice(0, 3).map((t) => (
                            <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                          {e.tools_used.length > 3 && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{e.tools_used.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Detail modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TRACK_COLOR[selected.track]}`}>
                {selected.track.replace(/_/g, " ")}
              </span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <div className="p-6">
              <h2 className="font-black text-gray-900 text-2xl tracking-tight mb-1">{selected.title}</h2>
              <p className="text-[13px] text-gray-400 font-medium mb-6">{selected.intern?.name}</p>

              {/* Thumbnail */}
              {selected.file_urls?.[0] && selected.file_urls[0].match(/\.(jpg|jpeg|png|webp|gif)$/i) && (
                <img src={selected.file_urls[0]} alt={selected.title} className="w-full rounded-2xl mb-6 max-h-64 object-cover" />
              )}

              {[
                { label: "Outcome / Results", value: selected.outcome },
              ].map(({ label, value }) => (
                <div key={label} className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{label}</p>
                  <p className="text-[14px] text-gray-700 leading-relaxed">{value}</p>
                </div>
              ))}

              {/* Tools */}
              {selected.tools_used?.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Tools Used</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.tools_used.map((t) => (
                      <span key={t} className="bg-[#4B1E91]/10 text-[#4B1E91] text-[12px] font-medium px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* All screenshots */}
              {selected.file_urls?.length > 1 && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Files</p>
                  <div className="flex flex-wrap gap-3">
                    {selected.file_urls.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer"
                        className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 hover:opacity-80 transition block">
                        {url.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                          ? <img src={url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-2xl">📄</div>}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(selected.repo_url || selected.live_url) && (
                <div className="flex gap-3 pt-2">
                  {selected.repo_url && (
                    <a href={selected.repo_url} target="_blank" rel="noreferrer"
                      className="flex-1 py-3 rounded-xl border border-[#4B1E91] text-[#4B1E91] font-bold text-[13px] text-center hover:bg-[#4B1E91] hover:text-white transition uppercase tracking-wider">
                      View Code →
                    </a>
                  )}
                  {selected.live_url && (
                    <a href={selected.live_url} target="_blank" rel="noreferrer"
                      className="flex-1 py-3 rounded-xl bg-[#4B1E91] text-white font-bold text-[13px] text-center hover:bg-[#3d1778] transition uppercase tracking-wider">
                      Live Site →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
