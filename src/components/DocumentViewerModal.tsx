import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  FileDown, 
  Copy, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { GeneratedDocument } from '../types';
import { downloadAsWord, copyHtmlToClipboard, printDocument } from '../utils/documentExport';

interface DocumentViewerModalProps {
  document: GeneratedDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose
}) => {
  const [zoom, setZoom] = useState(100);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    document?.orientation || 'portrait'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!document) return null;

  const handlePrint = () => {
    printDocument('printable-doc-content');
  };

  const handleDownloadWord = () => {
    downloadAsWord(document.title, document.contentHtml, orientation);
  };

  const handleCopyHtml = () => {
    copyHtmlToClipboard(document.contentHtml);
  };

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-6 overflow-hidden">
      <div className={`bg-slate-900 border border-slate-700/80 rounded-2xl flex flex-col shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[95vh]'
      }`}>
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70 gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {document.code}
            </span>
            <h3 className="text-sm md:text-base font-bold text-white truncate max-w-md">
              {document.title}
            </h3>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs text-slate-300 mr-2">
              <button
                onClick={() => setZoom(z => Math.max(z - 10, 60))}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition"
                title="Perkecil Tampilan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px]">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(z + 10, 150))}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Orientation */}
            <button
              onClick={toggleOrientation}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              title="Ubah Orientasi Halaman"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline capitalize">{orientation}</span>
            </button>

            {/* Copy HTML */}
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              title="Salin Kode HTML"
            >
              <Copy className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Salin HTML</span>
            </button>

            {/* Download Word */}
            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
              title="Unduh File Microsoft Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            {/* Fullscreen & Close */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition ml-1"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Simulation Canvas */}
        <div className="flex-1 overflow-auto bg-slate-950 p-4 md:p-8 flex justify-center items-start">
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150"
          >
            <div 
              id="printable-doc-content"
              className={`${
                orientation === 'landscape' ? 'doc-page-landscape' : 'doc-page-portrait'
              } document-content rounded-sm`}
              dangerouslySetInnerHTML={{ __html: document.contentHtml }}
            />
          </div>
        </div>

        {/* Modal Footer info */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 flex items-center justify-between">
          <span className="text-[11px]">
            Format Kertas: <strong>A4 {orientation.toUpperCase()}</strong> • Standard Tanda Tangan: <strong>2 Kolom Sejajar Horizontal</strong>
          </span>
          <span className="text-[11px] text-slate-500">
            Dibuat: {document.createdAt}
          </span>
        </div>
      </div>
    </div>
  );
};
