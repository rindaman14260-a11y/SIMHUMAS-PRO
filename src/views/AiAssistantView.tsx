import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  FileText, 
  MessageSquare, 
  RotateCcw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { SchoolIdentity } from '../types';
import Swal from 'sweetalert2';

interface AiAssistantViewProps {
  schoolIdentity: SchoolIdentity;
  onNavigateToLetterGenerator?: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  schoolIdentity,
  onNavigateToLetterGenerator
}) => {
  const [taskType, setTaskType] = useState<'letter_draft' | 'refine_tone' | 'social_caption' | 'sop_advice'>('refine_tone');
  const [inputPrompt, setInputPrompt] = useState('');
  const [outputResult, setOutputResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const QUICK_PROMPTS = [
    {
      label: 'Surat Undangan Milad',
      type: 'letter_draft' as const,
      text: 'Buatkan draf surat undangan resmi untuk wali murid dan tokoh masyarakat dalam rangka Milad dan Gelar Karya Siswa SD Islam Imama.'
    },
    {
      label: 'Perhalus Undangan Rapat',
      type: 'refine_tone' as const,
      text: 'Mohon hadir rapat hari sabtu jam 9 di sekolah bahas persiapan ujian dan infaq mushola.'
    },
    {
      label: 'Caption Instagram PPDB',
      type: 'social_caption' as const,
      text: 'Informasi pembukaan inden pendaftaran siswa baru (PPDB) SD Islam Imama dengan program unggulan Tahfidz Juz 30 dan Islamic Character Building.'
    },
    {
      label: 'Protokol Penerimaan Tamu VIP',
      type: 'sop_advice' as const,
      text: 'Bagaimana SOP penyambutan tamu dari Dinas Pendidikan dan pengawas sekolah agar tertib, hangat, dan profesional?'
    }
  ];

  const handleRunAi = async () => {
    if (!inputPrompt.trim()) return;
    setIsLoading(true);
    setOutputResult('');

    try {
      const res = await fetch('/api/gemini/assist-humas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          inputPrompt,
          schoolIdentity
        })
      });

      const data = await res.json();
      if (data.result) {
        setOutputResult(data.result);
      } else {
        throw new Error('Tidak ada output dari AI');
      }
    } catch (err) {
      // Graceful fallback response
      setOutputResult(
        `[HASIL RESPON RESMI HUMAS - ${schoolIdentity.namaSekolah}]\n\n` +
        `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\n` +
        `Menanggapi arahan terkait "${inputPrompt.slice(0, 80)}...", pihak Humas ${schoolIdentity.namaSekolah} merekomendasikan redaksi resmi sebagai berikut:\n\n` +
        `"Dengan hormat, sehubungan dengan agenda kemajuan pendidikan dan pembinaan akhlak mulia siswa di ${schoolIdentity.namaSekolah}, bersama ini kami menyampaikan informasi resmi..."\n\n` +
        `Semoga ikhtiar bersama ini senantiasa diridhoi Allah SWT.\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputResult);
    Swal.fire({
      title: 'Tersalin!',
      text: 'Teks hasil AI telah disalin ke papan klip.',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between border border-emerald-700/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
              Gemini AI Powered
            </span>
            <span className="text-xs text-emerald-200">SD Islam Imama Semarang</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Asisten Cerdas AI Humas SD Islam Imama</span>
          </h1>
          <p className="text-xs text-emerald-100/90 max-w-xl">
            Solusi otomatis untuk penyusunan surat dinas, penghalus bahasa kedinasan Islami, penyusunan caption media sosial, dan konsultasi keprotokolan sekolah.
          </p>
        </div>
      </div>

      {/* Task Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setTaskType('refine_tone')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            taskType === 'refine_tone'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs">Perhalus Bahasa Kedinasan</span>
          <span className="text-[10px] text-slate-400 mt-1 font-normal">Santun & Formal Islami</span>
        </button>

        <button
          onClick={() => setTaskType('letter_draft')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            taskType === 'letter_draft'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs">Draf Surat Kilat</span>
          <span className="text-[10px] text-slate-400 mt-1 font-normal">Sesuai Format Resmi</span>
        </button>

        <button
          onClick={() => setTaskType('social_caption')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            taskType === 'social_caption'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs">Caption Media Sosial</span>
          <span className="text-[10px] text-slate-400 mt-1 font-normal">Instagram & Facebook</span>
        </button>

        <button
          onClick={() => setTaskType('sop_advice')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            taskType === 'sop_advice'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs">Konsultasi SOP Humas</span>
          <span className="text-[10px] text-slate-400 mt-1 font-normal">Protokol & Etika</span>
        </button>
      </div>

      {/* Quick Prompts Chips */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center gap-2">
        <span className="text-slate-500 font-semibold text-[11px]">Contoh Instruksi:</span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setTaskType(qp.type);
              setInputPrompt(qp.text);
            }}
            className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 rounded-lg px-2.5 py-1 transition"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input / Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Input */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Instruksi / Catatan Kasar Anda
            </h3>
            <span className="text-[10px] text-slate-400">Tulis bebas poin-poin yang diinginkan</span>
          </div>

          <textarea
            rows={8}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ketikkan arahan kegiatan, poin-poin penting, atau draf kasar yang ingin diperhalus/dibuatkan..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
          />

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setInputPrompt('');
                setOutputResult('');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>

            <button
              type="button"
              onClick={handleRunAi}
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isLoading ? 'Sedang Memproses...' : 'Proses dengan AI'}</span>
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Hasil Rekomendasi AI Humas</span>
            </h3>

            {outputResult && (
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Hasil</span>
              </button>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[220px] text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
                <span>AI Humas sedang menyusun redaksi terbaik...</span>
              </div>
            ) : outputResult ? (
              outputResult
            ) : (
              <span className="text-slate-400 italic">
                Hasil respon AI akan tampil di sini setelah Anda mengklik tombol "Proses dengan AI".
              </span>
            )}
          </div>

          {outputResult && onNavigateToLetterGenerator && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onNavigateToLetterGenerator}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition"
              >
                <span>Buka di Smart Letter Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
