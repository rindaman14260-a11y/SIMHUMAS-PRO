import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  BrainCircuit, 
  HelpCircle, 
  CheckCircle2, 
  Printer, 
  FileDown 
} from 'lucide-react';
import { SchoolConfig, User, GeneratedDocument } from '../types';
import { generateTemplateDocument } from '../services/curriculumTemplates';
import Swal from 'sweetalert2';

interface DeepLearningModulViewProps {
  currentUser: User;
  schoolConfig: SchoolConfig;
  onSaveDocument: (doc: GeneratedDocument) => void;
  onViewDocument: (doc: GeneratedDocument) => void;
}

export const DeepLearningModulView: React.FC<DeepLearningModulViewProps> = ({
  currentUser,
  schoolConfig,
  onSaveDocument,
  onViewDocument
}) => {
  const [activeTab, setActiveTab] = useState<'modul' | 'asesmen'>('modul');
  const [mapel, setMapel] = useState(currentUser.subject || 'Bahasa Indonesia');
  const [fase, setFase] = useState('D');
  const [kelas, setKelas] = useState('VII');
  const [semester, setSemester] = useState(schoolConfig.semesterAktif || 'Ganjil');
  const [tpDescription, setTpDescription] = useState('Peserta didik mampu menganalisis struktur dan ciri kebahasaan teks deskripsi serta memproduksi karya tulis kreatif.');
  const [materiPokok, setMateriPokok] = useState('Teks Deskripsi dan Literasi Kontekstual');
  const [alokasiJp, setAlokasiJp] = useState(4);
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem-Based Learning (PBL) Terintegrasi Deep Learning');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (docType: 'MODUL-AJAR' | 'ASESMEN-SUMATIF') => {
    setIsGenerating(true);
    const label = docType === 'MODUL-AJAR' 
      ? 'Modul Ajar Deep Learning (Mindful, Meaningful, Joyful)' 
      : 'Naskah Asesmen Sumatif HOTS & Rubrik Penskoran';

    Swal.fire({
      title: 'Menyusun Perangkat AI...',
      html: `Sedang memproses <strong>${label}</strong> dengan kecerdasan Gemini AI...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      let finalHtml = '';

      try {
        const resp = await fetch('/api/gemini/generate-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            docType,
            category: 'modul_asesmen',
            mapel,
            kelas,
            fase,
            semester,
            materiPokok,
            alokasiJp,
            modelPembelajaran,
            additionalNotes: `TP: ${tpDescription}`,
            schoolConfig,
            teacherName: currentUser.name,
            teacherNip: currentUser.nip
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.html) {
            finalHtml = data.html;
          }
        }
      } catch (e) {
        console.warn('API error, falling back to rich engine template:', e);
      }

      if (!finalHtml) {
        const generated = generateTemplateDocument({
          docType,
          mapel,
          kelas,
          fase,
          semester,
          materiPokok,
          alokasiJp,
          modelPembelajaran,
          namaGuru: currentUser.name,
          nipGuru: currentUser.nip,
          schoolConfig
        });
        finalHtml = generated.html;
      }

      const newDoc: GeneratedDocument = {
        id: `doc_${Date.now()}`,
        code: docType,
        title: `${docType} - ${mapel} Kelas ${kelas} (${materiPokok})`,
        category: 'modul_asesmen',
        mapel,
        kelas,
        fase,
        semester,
        orientation: 'portrait',
        createdAt: new Date().toLocaleString('id-ID'),
        contentHtml: finalHtml
      };

      onSaveDocument(newDoc);
      onViewDocument(newDoc);

      Swal.fire({
        title: 'Dokumen Siap!',
        text: `${label} berhasil dibuat dan siap diekspor.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'Gagal', text: 'Terjadi kesalahan saat menyusun dokumen.', icon: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Pendekatan Pembelajaran Mendalam (Deep Learning)</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Modul Ajar Deep Learning & Asesmen Sumatif AI</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Perencanaan pembelajaran spesifik berbasis <em>Mindful, Meaningful, & Joyful Learning</em> serta bank soal asesmen sumatif HOTS.
            </p>
          </div>

          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex">
            <button
              onClick={() => setActiveTab('modul')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'modul'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Modul Ajar (Deep Learning)
            </button>
            <button
              onClick={() => setActiveTab('asesmen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'asesmen'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Asesmen Sumatif (HOTS)
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Fase</label>
            <select
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            >
              <option value="A">Fase A (SD Kelas 1-2)</option>
              <option value="B">Fase B (SD Kelas 3-4)</option>
              <option value="C">Fase C (SD Kelas 5-6)</option>
              <option value="D">Fase D (SMP Kelas 7-9)</option>
              <option value="E">Fase E (SMA/SMK Kelas 10)</option>
              <option value="F">Fase F (SMA/SMK Kelas 11-12)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Kelas</label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Alokasi Waktu</label>
            <input
              type="number"
              min={1}
              max={10}
              value={alokasiJp}
              onChange={(e) => setAlokasiJp(parseInt(e.target.value) || 4)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Materi Pokok Pembelajaran
          </label>
          <input
            type="text"
            value={materiPokok}
            onChange={(e) => setMateriPokok(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Target Tujuan Pembelajaran (TP Spesifik)
          </label>
          <textarea
            rows={2}
            value={tpDescription}
            onChange={(e) => setTpDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
        </div>

        {activeTab === 'modul' && (
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Struktur Deep Learning yang Disertakan:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li><strong>Mindful Learning</strong>: Sesi STOP (kesadaran penuh), pernapasan tenang, dan kesiapan hadir mental sebelum belajar.</li>
              <li><strong>Meaningful Learning</strong>: Pengaitan materi dengan fenomena kehidupan nyata dan pertanyaan pemantik bermakna.</li>
              <li><strong>Joyful Learning</strong>: Eksplorasi kolaboratif, penemuan interaktif, dan kuis reflektif yang membahagiakan.</li>
            </ul>
          </div>
        )}

        {activeTab === 'asesmen' && (
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-purple-200">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Struktur Asesmen Sumatif HOTS:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li>Pilihan Ganda Berbobot Tinggi (Level Analisis C4 - C5) berbasis stimulus kontekstual.</li>
              <li>Soal Uraian Pemecahan Masalah dan Refleksi Kritis.</li>
              <li>Kunci Jawaban Komprehensif dan Rubrik Penskoran Berbobot 100%.</li>
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Format Ekspor: <strong>Word (.doc) & Cetak PDF Sejajar</strong></span>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate(activeTab === 'modul' ? 'MODUL-AJAR' : 'ASESMEN-SUMATIF')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{activeTab === 'modul' ? 'Generate Modul Ajar Deep Learning' : 'Generate Asesmen Sumatif HOTS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
