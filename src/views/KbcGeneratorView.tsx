import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  FileText, 
  Smile, 
  ShieldCheck, 
  CheckCircle2, 
  BookHeart, 
  Sliders 
} from 'lucide-react';
import { SchoolConfig, User, GeneratedDocument, DocumentTypeKBC } from '../types';
import { generateTemplateDocument } from '../services/curriculumTemplates';
import Swal from 'sweetalert2';

interface KbcGeneratorViewProps {
  currentUser: User;
  schoolConfig: SchoolConfig;
  onSaveDocument: (doc: GeneratedDocument) => void;
  onViewDocument: (doc: GeneratedDocument) => void;
}

const KBC_DOCS: { type: DocumentTypeKBC; label: string; code: string; desc: string; orientation: 'portrait' | 'landscape'; badge: string }[] = [
  {
    type: 'ACP-KBC',
    code: 'ACP-KBC',
    label: 'Analisis Capaian Pembelajaran KBC (ACP)',
    desc: 'Integrasi CP Fase dengan Panca Cinta, Ayat Kauniyah, dan Nilai Profil Pelajar Rahmatan Lil Alamin (PPRA).',
    orientation: 'portrait',
    badge: 'Pondasi Kasih'
  },
  {
    type: 'TP-KBC',
    code: 'TP-KBC',
    label: 'Tujuan Pembelajaran Berbasis Cinta (TP-KBC)',
    desc: 'Perumusan TP dengan ruh Panca Cinta, adab menuntut ilmu (Ta\'addub), dan keteladanan (Qudwah).',
    orientation: 'portrait',
    badge: 'Tujuan Kasih'
  },
  {
    type: 'ATP-KBC',
    code: 'ATP-KBC',
    label: 'Alur Tujuan Pembelajaran KBC (ATP-KBC)',
    desc: 'Format Resmi A4 Landscape, Matriks Alur Pembelajaran Kasih Sayang terintegrasi 10 Nilai PPRA.',
    orientation: 'landscape',
    badge: 'Alur Kasih'
  },
  {
    type: 'PROTA-KBC',
    code: 'PROTA-KBC',
    label: 'Program Tahunan KBC (PROTA-KBC)',
    desc: 'Distribusi JP tahunan terpadu dengan jam cadangan penguatan karakter cinta dan konseling kasih sayang.',
    orientation: 'portrait',
    badge: 'Tahunan'
  },
  {
    type: 'PROSEM-KBC',
    code: 'PROSEM-KBC',
    label: 'Program Semester KBC (PROSEM-KBC)',
    desc: 'Format Resmi A4 Landscape, Matriks distribusi mingguan dengan sentuhan model pembelajaran berbasis cinta.',
    orientation: 'landscape',
    badge: 'Semester'
  },
  {
    type: 'KKTP-KBC',
    code: 'KKTP-KBC',
    label: 'Kriteria Ketercapaian TP KBC (KKTP-KBC)',
    desc: 'Format Resmi A4 Landscape, 4 level pencapaian karakter kasih sayang dan indikator ketercapaian adab.',
    orientation: 'landscape',
    badge: 'Kriteria'
  },
  {
    type: 'MODUL-KBC',
    code: 'MODUL-KBC',
    label: 'Modul Ajar Kurikulum Berbasis Cinta (KBC)',
    desc: 'Skenario pembelajaran memuat tag (PC: ... | PPRA: ...), sapaan hangat, dan refleksi sanubari.',
    orientation: 'portrait',
    badge: 'Skenario'
  },
  {
    type: 'LKPD-KBC',
    code: 'LKPD-KBC',
    label: 'Lembar Kerja Peserta Didik KBC (LKPD-KBC)',
    desc: 'LKPD ramah jiwa dengan petunjuk empati, emoji visual, ruang jawaban bergaris, dan Refleksi Personal KBC.',
    orientation: 'portrait',
    badge: 'Aktivitas'
  },
  {
    type: 'RUBRIK-FORMATIF-KBC',
    code: 'RUBRIK-FORMATIF-KBC',
    label: 'Rubrik Penilaian Formatif KBC',
    desc: 'Rubrik proses 4 tingkatan: Kesantunan berbahasa, ketekunan cinta ilmu, dan kepedulian lingkungan.',
    orientation: 'portrait',
    badge: 'Penilaian Proses'
  },
  {
    type: 'RUBRIK-SUMATIF-KBC',
    code: 'RUBRIK-SUMATIF-KBC',
    label: 'Rubrik Penilaian Sumatif KBC',
    desc: 'Pembobotan 100% komprehensif: Pengetahuan esensial, karya portofolio, dan karakter teladan (Qudwah).',
    orientation: 'portrait',
    badge: 'Penilaian Akhir'
  }
];

export const KbcGeneratorView: React.FC<KbcGeneratorViewProps> = ({
  currentUser,
  schoolConfig,
  onSaveDocument,
  onViewDocument
}) => {
  const [selectedDocType, setSelectedDocType] = useState<DocumentTypeKBC>('MODUL-KBC');
  const [mapel, setMapel] = useState(currentUser.subject || 'Bahasa Indonesia');
  const [fase, setFase] = useState('D');
  const [kelas, setKelas] = useState('VII');
  const [semester, setSemester] = useState(schoolConfig.semesterAktif || 'Ganjil');
  const [materiPokok, setMateriPokok] = useState('Menyemai Kasih Melalui Kata: Membaca & Menulis Teks Deskripsi');
  const [alokasiJp, setAlokasiJp] = useState(4);
  const [selectedPancaCinta, setSelectedPancaCinta] = useState<string>('Cinta Diri & Sesama');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedDocConfig = KBC_DOCS.find(d => d.type === selectedDocType) || KBC_DOCS[6];

  const handleGenerate = async (useAiApi = true) => {
    setIsGenerating(true);

    Swal.fire({
      title: 'Menyusun Perangkat Berbasis Cinta...',
      html: `Sedang memadukan <strong>${selectedDocConfig.label}</strong> dengan Panca Cinta & Nilai PPRA...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      let finalHtml = '';

      if (useAiApi) {
        try {
          const resp = await fetch('/api/gemini/generate-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              docType: selectedDocConfig.code,
              category: 'kbc',
              mapel,
              kelas,
              fase,
              semester,
              materiPokok,
              alokasiJp,
              modelPembelajaran: 'Problem-Based Learning Berbasis Kasih Sayang',
              additionalNotes: `Fokus Panca Cinta: ${selectedPancaCinta}`,
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
        } catch (apiErr) {
          console.warn('API error, falling back to template engine:', apiErr);
        }
      }

      if (!finalHtml) {
        const generated = generateTemplateDocument({
          docType: selectedDocConfig.type,
          mapel,
          kelas,
          fase,
          semester,
          materiPokok,
          alokasiJp,
          modelPembelajaran: 'Problem-Based Learning Berbasis Kasih Sayang',
          namaGuru: currentUser.name,
          nipGuru: currentUser.nip,
          schoolConfig
        });
        finalHtml = generated.html;
      }

      const newDoc: GeneratedDocument = {
        id: `doc_${Date.now()}`,
        code: selectedDocConfig.code,
        title: `${selectedDocConfig.code} - ${mapel} Kelas ${kelas} (${selectedDocConfig.label})`,
        category: 'kbc',
        mapel,
        kelas,
        fase,
        semester,
        orientation: selectedDocConfig.orientation,
        createdAt: new Date().toLocaleString('id-ID'),
        contentHtml: finalHtml
      };

      onSaveDocument(newDoc);
      onViewDocument(newDoc);

      Swal.fire({
        title: 'Dokumen KBC Siap!',
        text: `${selectedDocConfig.label} berhasil dibuat dan siap diekspor.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'Gagal', text: 'Terjadi kendala saat menyusun dokumen.', icon: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Integrasi Panca Cinta & Profil Pelajar Rahmatan Lil 'Alamin (PPRA)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Generator 10 Dokumen Paket Kurikulum Berbasis Cinta (KBC)
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Menyajikan pembelajaran penuh empati, kasih sayang semesta, dan keluhuran budi pekerti: Cinta Allah & Rasul, Diri & Sesama, Ilmu Pengetahuan, Bangsa & Negara, serta Alam Lingkungan.
          </p>
        </div>
      </div>

      {/* 10 Document Selector */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-3 px-1 flex items-center justify-between">
          <span>Pilih Dari 10 Paket Dokumen Terpadu KBC:</span>
          <span className="text-[11px] font-mono text-slate-400 font-normal">10 Dokumen Lengkap</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {KBC_DOCS.map((doc) => {
            const isSelected = selectedDocType === doc.type;
            return (
              <button
                key={doc.type}
                type="button"
                onClick={() => setSelectedDocType(doc.type)}
                className={`p-3.5 rounded-xl text-left border transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-500 ring-1 ring-rose-500/60 shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                      {doc.code}
                    </span>
                    <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-400">
                      {doc.orientation}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white line-clamp-1">{doc.label}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {doc.desc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-rose-400 font-medium">
                  {doc.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameters Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            <span>Parameter Pembelajaran KBC ({selectedDocConfig.code})</span>
          </h3>
          <span className="text-xs text-rose-400 font-mono">
            {selectedDocConfig.label}
          </span>
        </div>

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
              <option value="A">Fase A (Kelas 1 - 2 SD)</option>
              <option value="B">Fase B (Kelas 3 - 4 SD)</option>
              <option value="C">Fase C (Kelas 5 - 6 SD)</option>
              <option value="D">Fase D (Kelas 7 - 9 SMP)</option>
              <option value="E">Fase E (Kelas 10 SMA/SMK)</option>
              <option value="F">Fase F (Kelas 11 - 12 SMA/SMK)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Tingkat / Kelas</label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Fokus Panca Cinta</label>
            <select
              value={selectedPancaCinta}
              onChange={(e) => setSelectedPancaCinta(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            >
              <option value="Cinta Diri & Sesama">1. Cinta Diri & Sesama Insan</option>
              <option value="Cinta Allah & Rasul">2. Cinta Allah & Rasul-Nya</option>
              <option value="Cinta Ilmu Pengetahuan">3. Cinta Ilmu Pengetahuan & Kebenaran</option>
              <option value="Cinta Bangsa & Tanah Air">4. Cinta Bangsa & Tanah Air</option>
              <option value="Cinta Lingkungan & Alam Semesta">5. Cinta Lingkungan & Alam Semesta</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Materi Pokok / Sentuhan Tematik KBC
          </label>
          <input
            type="text"
            value={materiPokok}
            onChange={(e) => setMateriPokok(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
        </div>

        {/* Generate Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kop Formal Bersih Tanpa Logo • <strong>Tanda Tangan 2 Kolom Sejajar Rapi</strong></span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(false)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Mesin Template Standar KBC
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Generate Dokumen KBC (Gemini AI)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
