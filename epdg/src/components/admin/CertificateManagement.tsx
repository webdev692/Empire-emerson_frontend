import { useState } from "react";
import { Award, Download, Search } from "lucide-react";

interface CertificateItem {
  id: number;
  learner: string;
  program: string;
  issued: string;
  status: "issued" | "pending" | "revoked";
}

const initialCertificates: CertificateItem[] = [];

const statusStyle = (status: CertificateItem["status"]) => {
  switch (status) {
    case "issued": return "bg-green-500/15 text-green-200";
    case "pending": return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "revoked": return "bg-red-500/15 text-red-200";
    default: return "bg-white/10 text-white";
  }
};

const CertificateManagement: React.FC = () => {
  const [query, setQuery] = useState("");

  const filteredCertificates = initialCertificates.filter((certificate) => {
    return [certificate.learner, certificate.program].some((value) => value.toLowerCase().includes(query.toLowerCase()));
  });

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Certificate management</p>
            <h1 className="mt-2 text-3xl font-semibold">Issue and track learner certificates</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Maintain trust by managing issued credentials and revocations.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-5 py-3 text-sm font-semibold text-white">
            <Award size={16} /> Create certificate
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F0E8]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search certificates"
              className="w-full rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-12 py-3 text-white outline-none"
            />
          </div>
          <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-sm text-[#F5F0E8]">
            {filteredCertificates.length} certificates found
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4">
        <table className="min-w-full text-left text-sm text-white">
          <thead>
            <tr className="text-xs uppercase tracking-[0.3em] text-[#F5F0E8]">
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#F5F0E8]/50 text-sm">
                  No certificates found. They will appear here once issued.
                </td>
              </tr>
            ) : filteredCertificates.map((certificate) => (
              <tr key={certificate.id} className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A]">
                <td className="px-4 py-4 font-semibold">{certificate.learner}</td>
                <td className="px-4 py-4 text-[#F5F0E8]">{certificate.program}</td>
                <td className="px-4 py-4 text-[#F5F0E8]">{certificate.issued}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(certificate.status)}`}>
                    {certificate.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-3 py-2 text-xs text-white">
                    <Download size={14} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: "Verified learners",    count: initialCertificates.filter((c) => c.status === "issued").length  },
          { label: "Certificates pending", count: initialCertificates.filter((c) => c.status === "pending").length },
          { label: "Revoked certificates", count: initialCertificates.filter((c) => c.status === "revoked").length },
        ].map(({ label, count }) => (
          <div key={label} className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">{label}</p>
            <p className="mt-4 text-2xl font-semibold">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateManagement;
