import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Printer, 
  Plus, 
  CheckCircle, 
  Clock, 
  FileEdit, 
  Trash2, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { OfficialLetter, SchoolIdentity, User } from '../types';
import { generateLetterHtml } from '../utils/letterTemplates';
import { exportHtmlToWord, printHtmlContent, generateQrDataUrl } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface OutgoingLettersViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  officialLetters: OfficialLetter[];
  onNavigateToCreate: () => void;
  onEditLetter: (letter: OfficialLetter) => void;
  onDeleteLetter: (letterId: string) => void;
}

export const OutgoingLettersView: React.FC<OutgoingLettersViewProps> = ({
  schoolIdentity,
  currentUser,
  officialLetters,
  onNavigateToCreate,
  onEditLetter,
  onDeleteLetter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [selectedLetter, setSelectedLetter] = useState<OfficialLetter | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const filteredLetters = officialLetters.filter(l => {
    const matchesSearch = 
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'semua' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePreview = async (letter: OfficialLetter) => {
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

  const handlePrint = async (letter: OfficialLetter) => {
    const qr = await generateQrDataUrl(JSON.stringify({ noSurat: letter.letterNumber, token: letter.qrVerificationToken }), 150);
    const html = generateLetterHtml(letter, schoolIdentity, qr);
    printHtmlContent(html);
  };

  const handleDownloadWord = async (letter: OfficialLetter) => {
    const qr = await generateQrDataUrl(JSON.stringify({ noSurat: letter.letterNumber, token: letter.qrVerificationToken }), 150);
    const html = generateLetterHtml(letter, schoolIdentity, qr);
    exportHtmlToWord(html, `${letter.title.replace(/\s+/g, '_')}_${letter.letterNumber.replace(/\//g, '-')}`);
  };

  const handleDelete = (letter: OfficialLetter) => {
    Swal.fire({
      title: 'Hapus Surat Keluar?',
      text: `Hapus surat "${letter.title}" (${letter.letterNumber}) dari sistem?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, Hapus'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteLetter(letter.id);
        Swal.fire({
          title: 'Terhapus',
          text: 'Surat telah dihapus dari daftar.',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  };

  const handleExportCSV = () => {
    const headers = ['Nomor Surat', 'Jenis Template', 'Judul / Perihal', 'Penerima', 'Tanggal Surat', 'Penandatangan', 'Status'];
    const rows = filteredLetters.map(l => [
      `"${l.letterNumber}"`,
      `"${l.templateType}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.recipientName.replace(/"/g, '""')}"`,
      l.letterDate,
      `"${l.signer?.name || l.signerName || ''}"`,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Agenda_Surat_Keluar_SDI_IMAMA_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-700" />
            <span>Buku Agenda & Arsip Surat Keluar</span>
          </h1>
          <p className="text-xs text-slate-500">
            Daftar seluruh berkas surat resmi yang diterbitkan {schoolIdentity.namaSekolah}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Agenda CSV</span>
          </button>

          <button
            onClick={onNavigateToCreate}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat Baru</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat, judul perihal, nama penerima..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="semua">Semua Status Surat</option>
            <option value="draf">Draf (Belum Diajukan)</option>
            <option value="menunggu_persetujuan">Menunggu Persetujuan Kepsek</option>
            <option value="disetujui">Disetujui Kepsek</option>
            <option value="terbit">Terbit & Terdistribusi</option>
            <option value="revisi">Perlu Revisi</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">No. Surat</th>
                <th className="py-3 px-4">Judul / Perihal</th>
                <th className="py-3 px-4">Tujuan / Penerima</th>
                <th className="py-3 px-4">Tanggal & Penandatangan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLetters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan surat keluar yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredLetters.map(letter => (
                  <tr key={letter.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      <div>{letter.letterNumber}</div>
                      <div className="text-[10px] text-slate-400 font-sans font-normal uppercase">
                        {letter.templateType}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-snug">{letter.title}</div>
                      <div className="text-[11px] text-slate-500">{letter.subject || letter.regarding}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{letter.recipientName}</div>
                      <div className="text-[10px] text-slate-400">{letter.recipientAddress}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{letter.letterDate}</div>
                      <div className="text-[10px] text-purple-900">{letter.signer?.name || letter.signerName || ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      {letter.status === 'draf' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                          Draf
                        </span>
                      )}
                      {letter.status === 'menunggu_persetujuan' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Menunggu Persetujuan
                        </span>
                      )}
                      {letter.status === 'disetujui' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Disetujui
                        </span>
                      )}
                      {letter.status === 'terbit' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          Terbit
                        </span>
                      )}
                      {letter.status === 'revisi' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
                          Perlu Revisi
                        </span>
                      )}
                      {letter.status === 'ditolak' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          Ditolak
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handlePreview(letter)}
                          title="Lihat Pratinjau Surat"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handlePrint(letter)}
                          title="Cetak Surat Langsung"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDownloadWord(letter)}
                          title="Unduh File Word (.doc)"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {(letter.status === 'draf' || letter.status === 'revisi') && (
                          <button
                            onClick={() => onEditLetter(letter)}
                            title="Edit / Lanjutkan Draf"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(letter)}
                          title="Hapus Surat"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {selectedLetter.letterNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedLetter.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-100 p-4 rounded-xl">
              <div 
                className="bg-white p-6 rounded shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: generateLetterHtml(selectedLetter, schoolIdentity, qrCodeDataUrl)
                }}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => handlePrint(selectedLetter)}
                className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak</span>
              </button>
              <button
                onClick={() => handleDownloadWord(selectedLetter)}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Word</span>
              </button>
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
