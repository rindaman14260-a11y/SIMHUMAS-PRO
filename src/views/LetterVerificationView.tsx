import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Building2, 
  QrCode, 
  Calendar, 
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { OfficialLetter, SchoolIdentity } from '../types';

interface LetterVerificationViewProps {
  schoolIdentity: SchoolIdentity;
  officialLetters: OfficialLetter[];
}

export const LetterVerificationView: React.FC<LetterVerificationViewProps> = ({
  schoolIdentity,
  officialLetters
}) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedLetter, setMatchedLetter] = useState<OfficialLetter | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    const clean = query.trim().toLowerCase();

    const match = officialLetters.find(l => 
      l.letterNumber.toLowerCase() === clean ||
      l.id.toLowerCase() === clean ||
      (l.qrVerificationToken && l.qrVerificationToken.toLowerCase() === clean) ||
      clean.includes(l.id.toLowerCase()) ||
      clean.includes(l.letterNumber.toLowerCase())
    );

    setMatchedLetter(match || null);
  };

  const handleQuickTest = (letterNumber: string) => {
    setQuery(letterNumber);
    setHasSearched(true);
    const match = officialLetters.find(l => l.letterNumber === letterNumber);
    setMatchedLetter(match || null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Portal Verifikasi Dokumen & Surat Resmi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Keaslian Surat Dinas {schoolIdentity.namaSekolah}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Masukkan Nomor Surat atau Kode Token Verifikasi QR untuk memvalidasi keabsahan dokumen kedinasan yang diterbitkan secara resmi oleh pimpinan sekolah.
        </p>
      </div>

      {/* Verification Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-4">
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Nomor Surat / Kode QR Token
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <QrCode className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: 421.2/085/SDI-IMAMA/X/2026 atau IMAMA-VERIFY-LTR-001"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verifikasi Keaslian</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Samples */}
        <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2">
          <span>Contoh cepat:</span>
          {officialLetters.slice(0, 2).map(l => (
            <button
              key={l.id}
              type="button"
              onClick={() => handleQuickTest(l.letterNumber)}
              className="font-mono text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200 transition"
            >
              {l.letterNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Display */}
      {hasSearched && (
        matchedLetter ? (
          /* Valid Certificate Card */
          <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-sm">
              DOKUMEN ASLI & TERVERIFIKASI
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Surat Resmi Terdaftar di Pangkalan Data Sekolah
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  Telah disahkan oleh Kepala Sekolah {schoolIdentity.namaSekolah}
                </p>
              </div>
            </div>

            {/* Letter Metadata Table */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Nomor Surat:</span>
                <span className="sm:col-span-2 font-mono font-bold text-slate-900">{matchedLetter.letterNumber}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Perihal (Hal):</span>
                <span className="sm:col-span-2 font-semibold text-slate-900">{matchedLetter.subject}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Penerima Dokumen:</span>
                <span className="sm:col-span-2 font-medium text-slate-800">{matchedLetter.recipientName} ({matchedLetter.recipientAddress})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Tanggal Pengesahan:</span>
                <span className="sm:col-span-2 font-bold text-emerald-800">{matchedLetter.letterDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Pejabat Penandatangan:</span>
                <span className="sm:col-span-2 font-bold text-slate-900">
                  {matchedLetter.signer.name} ({matchedLetter.signer.position})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-0.5">
                <span className="text-slate-500">Token Keamanan Digital:</span>
                <span className="sm:col-span-2 font-mono text-[11px] text-slate-600 bg-white p-1 rounded border border-slate-200">
                  {matchedLetter.qrVerificationToken || 'IMAMA-SECURE-STAMP'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic text-center">
              Dokumen ini resmi diterbitkan oleh {schoolIdentity.namaSekolah} Semarang dan diakui keabsahannya secara administratif.
            </div>
          </div>
        ) : (
          /* Invalid / Not Found Card */
          <div className="bg-white rounded-2xl border-2 border-rose-400 shadow-xl p-6 sm:p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Dokumen Tidak Ditemukan atau Tidak Valid
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Nomor surat atau token yang Anda masukkan (<span className="font-mono font-bold text-rose-700">{query}</span>) tidak terdaftar dalam sistem penerbitan resmi {schoolIdentity.namaSekolah}. Mohon periksa kembali penulisan nomor surat.
            </p>
          </div>
        )
      )}
    </div>
  );
};
