import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  FileCheck, 
  Clock, 
  Award, 
  Printer, 
  Download, 
  MessageSquare,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { OfficialLetter, SchoolIdentity, User } from '../types';
import { generateLetterHtml } from '../utils/letterTemplates';
import { exportHtmlToWord, printHtmlContent, generateQrDataUrl } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface LetterApprovalViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  officialLetters: OfficialLetter[];
  onApproveLetter: (letterId: string, notes?: string) => void;
  onRejectLetter: (letterId: string, reason: string) => void;
  onRequestRevision: (letterId: string, notes: string) => void;
}

export const LetterApprovalView: React.FC<LetterApprovalViewProps> = ({
  schoolIdentity,
  currentUser,
  officialLetters,
  onApproveLetter,
  onRejectLetter,
  onRequestRevision
}) => {
  const [selectedLetter, setSelectedLetter] = useState<OfficialLetter | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [reviewTab, setReviewTab] = useState<'menunggu' | 'riwayat'>('menunggu');

  // Filter letters
  const pendingLetters = officialLetters.filter(l => l.status === 'menunggu_persetujuan');
  const reviewedLetters = officialLetters.filter(l => l.status === 'disetujui' || l.status === 'terbit' || l.status === 'revisi' || l.status === 'ditolak');

  const openPreview = async (letter: OfficialLetter) => {
    setSelectedLetter(letter);
    const token = letter.qrVerificationToken || `IMAMA-VERIFY-${letter.id}`;
    const qrData = JSON.stringify({
      inst: 'SD Islam Imama',
      noSurat: letter.letterNumber,
      hal: letter.subject,
      tgl: letter.letterDate,
      token
    });
    const url = await generateQrDataUrl(qrData, 160);
    setQrCodeDataUrl(url);
  };

  const handleApprove = (letter: OfficialLetter) => {
    Swal.fire({
      title: 'Setujui Surat Resmi?',
      text: `Bubuhkan tanda tangan elektronik resmi Kepala Sekolah pada surat: "${letter.title}"? Dokumen akan aktif dan terkunci secara digital.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Setujui & Tanda Tangani',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#047857'
    }).then(res => {
      if (res.isConfirmed) {
        onApproveLetter(letter.id, 'Disetujui dan disahkan oleh Kepala Sekolah.');
        if (selectedLetter?.id === letter.id) {
          setSelectedLetter(null);
        }
        Swal.fire({
          title: 'Surat Resmi Disetujui!',
          text: `Surat nomor ${letter.letterNumber} telah disahkan dan siap didistribusikan.`,
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        });
      }
    });
  };

  const handleRejectPrompt = (letter: OfficialLetter) => {
    Swal.fire({
      title: 'Tolak Surat',
      input: 'textarea',
      inputLabel: 'Alasan Penolakan:',
      inputPlaceholder: 'Tuliskan alasan penolakan surat...',
      showCancelButton: true,
      confirmButtonText: 'Tolak Surat',
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed && res.value) {
        onRejectLetter(letter.id, res.value);
        if (selectedLetter?.id === letter.id) setSelectedLetter(null);
        Swal.fire({
          title: 'Surat Ditolak',
          text: 'Pemberitahuan telah dicatat.',
          icon: 'info',
          timer: 1400,
          showConfirmButton: false
        });
      }
    });
  };

  const handleRevisionPrompt = (letter: OfficialLetter) => {
    Swal.fire({
      title: 'Minta Revisi Redaksi',
      input: 'textarea',
      inputLabel: 'Catatan Perbaikan untuk Humas / Pembuat Surat:',
      inputPlaceholder: 'Tuliskan hal-hal yang perlu diperbaiki...',
      showCancelButton: true,
      confirmButtonText: 'Kirim Catatan Revisi',
      confirmButtonColor: '#d97706',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed && res.value) {
        onRequestRevision(letter.id, res.value);
        if (selectedLetter?.id === letter.id) setSelectedLetter(null);
        Swal.fire({
          title: 'Catatan Revisi Terkirim',
          text: 'Surat dikembalikan ke draf untuk diperbaiki oleh petugas Humas.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Kepala Sekolah & Pimpinan
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-700" />
            <span>Persetujuan Surat Resmi & Tanda Tangan Elektronik</span>
          </h1>
          <p className="text-xs text-slate-500">
            Peninjauan, pengesahan, dan pembubuhan tanda tangan elektronik berkas persuratan {schoolIdentity.namaSekolah}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setReviewTab('menunggu')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              reviewTab === 'menunggu'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Menunggu Persetujuan ({pendingLetters.length})</span>
          </button>
          <button
            onClick={() => setReviewTab('riwayat')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              reviewTab === 'riwayat'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Riwayat Disahkan ({reviewedLetters.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {reviewTab === 'menunggu' ? (
        pendingLetters.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Semua Surat Telah Ditinjau</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada surat yang menunggu persetujuan Kepala Sekolah saat ini. Draf baru yang diajukan staf Humas akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLetters.map(letter => (
              <div 
                key={letter.id} 
                className="bg-white rounded-xl border border-amber-200 shadow-sm p-5 space-y-4 hover:border-amber-400 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                      {letter.letterNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {letter.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                    {letter.templateType}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Perihal:</span>
                    <span className="font-semibold text-slate-800">{letter.subject || letter.regarding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tujuan:</span>
                    <span className="font-medium text-slate-800">{letter.recipientName} ({letter.recipientAddress})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Terbit:</span>
                    <span className="font-semibold text-emerald-800">{letter.letterDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Penandatangan:</span>
                    <span className="font-bold text-purple-900">{letter.signer?.name || letter.signerName || schoolIdentity.namaKepalaSekolah}</span>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="text-[11px] text-slate-600 line-clamp-2 italic bg-white p-2 rounded border border-slate-100">
                  "{letter.content?.opening || (letter.bodyParagraphs ? letter.bodyParagraphs[0] : letter.regarding || letter.title)}"
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => openPreview(letter)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Surat</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRevisionPrompt(letter)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition"
                    >
                      Revisi
                    </button>

                    <button
                      onClick={() => handleRejectPrompt(letter)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-semibold transition"
                    >
                      Tolak
                    </button>

                    <button
                      onClick={() => handleApprove(letter)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* History of Approved / Reviewed Letters */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">No. Surat</th>
                <th className="py-3 px-4">Judul & Perihal</th>
                <th className="py-3 px-4">Tujuan / Penerima</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status Pengesahan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reviewedLetters.map(letter => (
                <tr key={letter.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {letter.letterNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{letter.title}</div>
                    <div className="text-[11px] text-slate-500">{letter.subject || letter.regarding}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{letter.recipientName}</div>
                    <div className="text-[11px] text-slate-400">{letter.recipientAddress}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {letter.letterDate}
                  </td>
                  <td className="py-3 px-4">
                    {letter.status === 'disetujui' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Disetujui
                      </span>
                    )}
                    {letter.status === 'terbit' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        Terbit & Arsip
                      </span>
                    )}
                    {letter.status === 'revisi' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Menunggu Revisi
                      </span>
                    )}
                    {letter.status === 'ditolak' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        Ditolak
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openPreview(letter)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                    >
                      Lihat Surat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Screen Review & Approval Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Pratinjau Pengesahan Kepala Sekolah
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedLetter.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Document Area */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-4 rounded-xl border border-slate-200">
              <div 
                className="bg-white p-6 sm:p-8 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: generateLetterHtml(selectedLetter, schoolIdentity, qrCodeDataUrl)
                }}
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const html = generateLetterHtml(selectedLetter, schoolIdentity, qrCodeDataUrl);
                    printHtmlContent(html);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak</span>
                </button>

                <button
                  onClick={() => {
                    const html = generateLetterHtml(selectedLetter, schoolIdentity, qrCodeDataUrl);
                    exportHtmlToWord(html, selectedLetter.title);
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Word</span>
                </button>
              </div>

              {selectedLetter.status === 'menunggu_persetujuan' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRevisionPrompt(selectedLetter)}
                    className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                  >
                    Minta Revisi
                  </button>
                  <button
                    onClick={() => handleApprove(selectedLetter)}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Setujui & Sahkan Sekarang</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
