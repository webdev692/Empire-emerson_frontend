import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, ShieldX, ShieldOff, Loader2 } from "lucide-react";
import api from "../lib/axios";

interface VerifyResult {
  intern_name:        string;
  program_name:       string;
  issue_date:         string;
  certificate_number: string;
  status:             "active" | "revoked" | "invalid";
}

type PageState = "loading" | "verified" | "revoked" | "invalid" | "not_found";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const CertificateVerify: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [state, setState]   = useState<PageState>(() => certificateId ? "loading" : "invalid");
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    if (!certificateId) return;

    api.get<{ success: boolean; data: VerifyResult }>(`/api/verify/${certificateId}`)
      .then(({ data }) => {
        const d = data.data;
        if (d.status === "invalid") { setState("invalid"); return; }
        setResult(d);
        setState(d.status === "revoked" ? "revoked" : "verified");
      })
      .catch((err) => {
        setState(err.response?.status === 404 ? "not_found" : "invalid");
      });
  }, [certificateId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0118] px-5 py-14">

      {/* Logo / branding */}
      <p className="mb-10 font-black text-[#C9A84C] text-xl tracking-widest uppercase">
        Emerson Empire · EPDG
      </p>

      {/* Card */}
      <div className="w-full max-w-md bg-[#1E0A4A] border border-[#4B1E91] rounded-3xl p-8 text-center space-y-5">

        {state === "loading" && (
          <>
            <Loader2 size={40} className="mx-auto text-[#4B1E91] animate-spin" />
            <p className="text-[#F5F0E8]/70 text-sm">Verifying certificate…</p>
          </>
        )}

        {state === "verified" && result && (
          <>
            <div className="flex justify-center">
              <div className="bg-green-500/15 p-4 rounded-full">
                <ShieldCheck size={40} className="text-green-400" />
              </div>
            </div>
            <div>
              <p className="font-black text-green-400 text-2xl tracking-tight">Verified</p>
              <p className="text-[#F5F0E8]/60 text-sm mt-1">This certificate is authentic and unrevoked.</p>
            </div>

            <div className="bg-[#0D0118] border border-[#4B1E91] rounded-2xl p-5 text-left space-y-3">
              <Row label="Intern name"   value={result.intern_name}        />
              <Row label="Programme"     value={result.program_name}       />
              <Row label="Issue date"    value={fmtDate(result.issue_date)} />
              <Row label="Certificate #" value={result.certificate_number} mono />
            </div>
          </>
        )}

        {state === "revoked" && result && (
          <>
            <div className="flex justify-center">
              <div className="bg-orange-500/15 p-4 rounded-full">
                <ShieldOff size={40} className="text-orange-400" />
              </div>
            </div>
            <div>
              <p className="font-black text-orange-400 text-2xl tracking-tight">Certificate Revoked</p>
              <p className="text-[#F5F0E8]/60 text-sm mt-1">
                This certificate was revoked and is no longer valid.
              </p>
            </div>
            <div className="bg-[#0D0118] border border-[#4B1E91] rounded-2xl p-5 text-left space-y-3">
              <Row label="Intern name"   value={result.intern_name}        />
              <Row label="Programme"     value={result.program_name}       />
              <Row label="Certificate #" value={result.certificate_number} mono />
            </div>
          </>
        )}

        {(state === "invalid" || state === "not_found") && (
          <>
            <div className="flex justify-center">
              <div className="bg-red-500/15 p-4 rounded-full">
                <ShieldX size={40} className="text-red-400" />
              </div>
            </div>
            <div>
              <p className="font-black text-red-400 text-2xl tracking-tight">Not Valid</p>
              <p className="text-[#F5F0E8]/60 text-sm mt-1">
                {state === "not_found"
                  ? "No certificate was found with this ID."
                  : "This certificate could not be verified. It may have been tampered with."}
              </p>
            </div>
          </>
        )}
      </div>

      <p className="mt-8 text-[#F5F0E8]/30 text-xs text-center">
        Certificate verification powered by Emerson Professional Development Group
      </p>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <p className="text-[#F5F0E8]/50 text-xs uppercase tracking-wider">{label}</p>
    <p className={`mt-0.5 text-white text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
  </div>
);

export default CertificateVerify;
