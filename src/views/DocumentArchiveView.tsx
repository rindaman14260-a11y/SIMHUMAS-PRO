import React, { useState } from 'react';
import { 
  FolderClock, 
  Eye, 
  FileDown, 
  Printer, 
  Trash2, 
  Copy, 
  Search, 
  Filter,
  FileText,
  Heart
} from 'lucide-react';
import { GeneratedDocument } from '../types';
import { downloadAsWord, copyHtmlToClipboard, printDocument } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface DocumentArchiveViewProps {
  documents: GeneratedDocument[];
  onViewDocument: (doc: GeneratedDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentArchiveView: React.FC<DocumentArchiveViewProps> = ({
  documents,
  onViewDocument,
  onDeleteDocument
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'merdeka' | 'kbc' | 'modul_asesmen'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc => {
    const matchCat = filterCategory === 'all' || doc.category === filterCategory;
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.mapel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (id: string, title: string) => {
    Swal.fire({
      title: 'Hapus Dokumen?',
      text: `Dokumen "${title}" akan dihapus dari arsip.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteDocument(id);
        Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderClock className="w-5 h-5 text-amber-400" />
            <span>Arsip Dokumen Administrasi Pembelajaran</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar seluruh dokumen Kurikulum Merdeka & KBC yang telah digenerate, siap cetak atau download Word kapan saja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari arsip dokumen..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Semua Dokumen ({documents.length})
        </button>

        <button
          onClick={() => setFilterCategory('merdeka')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            filterCategory === 'merdeka'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Kurikulum Merdeka (6 ADM)</span>
        </button>

        <button
          onClick={() => setFilterCategory('kbc')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            filterCategory === 'kbc'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Kurikulum Berbasis Cinta (10 KBC)</span>
        </button>

        <button
          onClick={() => setFilterCategory('modul_asesmen')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterCategory === 'modul_asesmen'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Modul Ajar & Asesmen HOTS
        </button>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    doc.category === 'kbc' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    doc.category === 'modul_asesmen' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {doc.code}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    A4 {doc.orientation}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white mb-1 line-clamp-2 leading-snug">
                  {doc.title}
                </h4>

                <div className="text-xs text-slate-400 space-y-0.5 mb-3">
                  <div>Mapel: <strong className="text-slate-300">{doc.mapel}</strong> • Kelas {doc.kelas}</div>
                  <div>Semester {doc.semester} • Fase {doc.fase}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Dibuat: {doc.createdAt}</div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onViewDocument(doc)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition"
                  title="Buka Pratinjau Dokumen"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => downloadAsWord(doc.title, doc.contentHtml, doc.orientation)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition"
                    title="Unduh File Word (.doc)"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => copyHtmlToClipboard(doc.contentHtml)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Salin Kode HTML"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            Belum ada arsip dokumen yang sesuai. Silakan buat dokumen melalui menu Generator Merdeka atau KBC.
          </div>
        )}
      </div>
    </div>
  );
};
