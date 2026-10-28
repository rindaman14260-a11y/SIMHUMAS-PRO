import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  FileDown, 
  Eye, 
  Layers, 
  Sliders, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { SchoolConfig, User, GeneratedDocument, DocumentTypeMerdeka } from '../types';
import { generateTemplateDocument } from '../services/curriculumTemplates';
import Swal from 'sweetalert2';

interface MerdekaGeneratorViewProps {
  currentUser: User;
  schoolConfig: SchoolConfig;
  onSaveDocument: (doc: GeneratedDocument) => void;
  onViewDocument: (doc: GeneratedDocument) => void;
}

const MERDEKA_DOCS: { type: DocumentTypeMerdeka; label: string; code: string; desc: string; orientation: 'portrait' | 'landscape' }[] = [
  {
    type: 'ADM-CP',
    code: 'ADM-CP',
    label: 'Analisis Capaian Pembelajaran (CP)',
    desc: 'Identitas, Rasional Mapel, Karakteristik & Elemen, CP Fase, Penjabaran KKO, dan Pemetaan 8 Dimensi Profil Lulusan.',
    orientation: 'portrait'
  },
  {
    type: 'ADM-TP',
    code: 'ADM-TP',
    label: 'Perumusan Tujuan Pembelajaran (TP)',
    desc: 'Panduan Kode TP, Daftar TP per Elemen (KKO Bloom C2-C5 + ABCD), Aspek Kompetensi, dan Rekapitulasi JP.',
    orientation: 'portrait'
  },
  {
    type: 'ADM-ATP',
    code: 'ADM-ATP',
    label: 'Alur Tujuan Pembelajaran (ATP)',
    desc: 'Format Resmi A4 Landscape, Diagram visual alur TP, Tabel 8 Kolom (Kode, Elemen, TP, Materi, Level Bloom, 8 Dimensi, JP, Semester).',
    orientation: 'landscape'
  },
  {
    type: 'ADM-PROTA',
    code: 'ADM-PROTA',
    label: 'Program Tahunan (PROTA)',
    desc: 'Tabel Kalender Distribusi Minggu Efektif (Kalender - Tidak Efektif = Efektif x JP), Subtotal Semester 1 & 2, serta Baris Jam Cadangan.',
    orientation: 'portrait'
  },
  {
    type: 'ADM-PROSEM',
    code: 'ADM-PROSEM',
    label: 'Program Semester (PROSEM)',
    desc: 'Format Resmi A4 Landscape, Matriks Distribusi JP per Minggu dengan kode 5 warna, Keterangan Model Pembelajaran & Legenda.',
    orientation: 'landscape'
  },
  {
    type: 'ADM-KKTP',
    code: 'ADM-KKTP',
    label: 'Kriteria Ketercapaian TP (KKTP)',
    desc: 'Format Resmi A4 Landscape, Dasar Permendikbudristek 21/2022, 4 Level Capaian (Mulai Berkembang, Layak ✓, Cakap, Mahir), Rubrik 9 Kolom.',
    orientation: 'landscape'
  }
];

export const MerdekaGeneratorView: React.FC<MerdekaGeneratorViewProps> = ({
  currentUser,
  schoolConfig,
  onSaveDocument,
  onViewDocument
}) => {
  const [selectedDocType, setSelectedDocType] = useState<DocumentTypeMerdeka>('ADM-CP');
  const [mapel, setMapel] = useState(currentUser.subject || 'Bahasa Indonesia');
  const [fase, setFase] = useState('D');
  const [kelas, setKelas] = useState('VII');
  const [semester, setSemester] = useState<string>(schoolConfig.semesterAktif || 'Ganjil');
  const [materiPokok, setMateriPokok] = useState('Teks Deskripsi dan Objek Wisata Lingkungan');
  const [alokasiJp, setAlokasiJp] = useState(4);
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem-Based Learning (PBL)');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedDocConfig = MERDEKA_DOCS.find(d => d.type === selectedDocType) || MERDEKA_DOCS[0];

  const handleGenerate = async (useAiApi = true) => {
    setIsGenerating(true);

    Swal.fire({
      title: 'Menyiapkan Dokumen Administrasi...',
      html: `Sedang memproses <strong>${selectedDocConfig.code}</strong> sesuai standar Permendikbudristek Kurikulum Merdeka...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      let finalHtml = '';
      const docOrientation = selectedDocConfig.orientation;

      if (useAiApi) {
        // Try calling server-side Gemini API
        try {
          const resp = await fetch('/api/gemini/generate-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              docType: selectedDocConfig.code,
              category: 'merdeka',
              mapel,
              kelas,
              fase,
              semester,
              materiPokok,
              alokasiJp,
              modelPembelajaran,
              additionalNotes: additionalPrompt,
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
          console.warn('API call failed, switching to template fallback:', apiErr);
        }
      }

      // If no AI response, use our high-fidelity educational template
      if (!finalHtml) {
        const generated = generateTemplateDocument({
          docType: selectedDocConfig.type,
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
        code: selectedDocConfig.code,
        title: `${selectedDocConfig.code} - ${mapel} Kelas ${kelas} (${selectedDocConfig.label})`,
        category: 'merdeka',
        mapel,
        kelas,
        fase,
        semester,
        orientation: docOrientation,
        createdAt: new Date().toLocaleString('id-ID'),
        contentHtml: finalHtml
      };

      onSaveDocument(newDoc);
      onViewDocument(newDoc);

      Swal.fire({
        title: 'Dokumen Siap!',
        text: `${selectedDocConfig.label} berhasil dibuat dan siap diekspor.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Gagal Membuat Dokumen',
        text: 'Terjadi kesalahan sistem saat memproses dokumen.',
        icon: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar Kurikulum Merdeka (Kemendikbudristek)</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              <span>Generator 6 Dokumen Administrasi Kurikulum Merdeka</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hasilkan paket lengkap ADM-CP, TP, ATP (8 kolom), PROTA, PROSEM Matriks 5 warna, dan KKTP 4 level capaian.
            </p>
          </div>
        </div>
      </div>

      {/* Document Selection Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Pilih Jenis Dokumen yang Akan Dibuat:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MERDEKA_DOCS.map((doc) => {
            const isSelected = selectedDocType === doc.type;
            return (
              <button
                key={doc.type}
                type="button"
                onClick={() => setSelectedDocType(doc.type)}
                className={`p-4 rounded-xl text-left border transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {doc.code}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      A4 {doc.orientation}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white">{doc.label}</div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {doc.desc}
                  </p>
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
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Parameter Pembelajaran & Identitas Mata Pelajaran</span>
          </h3>
          <span className="text-xs text-indigo-400 font-mono">
            Target: <strong>{selectedDocConfig.code}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Fase Pembelajaran</label>
            <select
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              placeholder="Contoh: VII atau 7"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Materi Pokok / Lingkup Materi Pembelajaran
            </label>
            <input
              type="text"
              value={materiPokok}
              onChange={(e) => setMateriPokok(e.target.value)}
              placeholder="Contoh: Menyimak dan Menulis Teks Deskripsi Wisata Budaya"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Alokasi Waktu (JP per Minggu)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={alokasiJp}
              onChange={(e) => setAlokasiJp(parseInt(e.target.value) || 4)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Model Pembelajaran Rekomendasi</label>
            <select
              value={modelPembelajaran}
              onChange={(e) => setModelPembelajaran(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Problem-Based Learning (PBL)">Problem-Based Learning (PBL)</option>
              <option value="Project-Based Learning (PjBL)">Project-Based Learning (PjBL)</option>
              <option value="Discovery / Inquiry Learning">Discovery / Inquiry Learning</option>
              <option value="Collaborative Cooperative Learning">Collaborative Cooperative Learning</option>
              <option value="Deep Learning Terpadu (Mindful, Meaningful, Joyful)">Deep Learning Terpadu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Instruksi Tambahan AI (Opsional)
            </label>
            <input
              type="text"
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="Contoh: Tekankan studi kasus kearifan lokal Jawa Tengah..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Generate Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Format Tanda Tangan: <strong>2 Kolom Sejajar Horizontal Tanpa Garis</strong></span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(false)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Pakai Mesin Template Cepat
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate dengan Gemini AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
