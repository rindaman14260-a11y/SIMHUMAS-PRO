import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Building2, 
  FileCheck, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SchoolConfig } from '../types';
import { generateFormalKopHtml, generateSignatureTableHtml } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface KonfigurasiViewProps {
  config: SchoolConfig;
  onSaveConfig: (newConfig: SchoolConfig) => void;
}

export const KonfigurasiView: React.FC<KonfigurasiViewProps> = ({
  config,
  onSaveConfig
}) => {
  const [formData, setFormData] = useState<SchoolConfig>({ ...config });

  const handleChange = (field: keyof SchoolConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    Swal.fire({
      title: 'Konfigurasi Tersimpan!',
      text: 'Data identitas sekolah dan parameter dokumen berhasil diperbarui.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false
    });
  };

  // Preview Kop & Signature
  const previewKop = generateFormalKopHtml(formData);
  const previewSignature = generateSignatureTableHtml(formData, 'Dra. Hj. Siti Aminah, M.Pd.', '19790422 200312 2 005');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Hak Akses Administrator</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Konfigurasi Satuan Pendidikan & Pejabat Pengesah</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pengaturan ini menjadi sumber data utama (master identity) untuk seluruh kop dokumen, tanda tangan sejajar, dan judul aplikasi.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form Configuration */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Instansi Pembina / Dinas Pendidikan (Baris Kop Atas)
            </label>
            <textarea
              rows={2}
              required
              value={formData.pemerintahDinas}
              onChange={(e) => handleChange('pemerintahDinas', e.target.value)}
              placeholder="Contoh: PEMERINTAH PROVINSI JAWA TENGAH&#10;DINAS PENDIDIKAN DAN KEBUDAYAAN"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Nama Resmi Sekolah (Judul Kop Dokumen & Brand Aplikasi)
            </label>
            <input
              type="text"
              required
              value={formData.namaSekolah}
              onChange={(e) => handleChange('namaSekolah', e.target.value)}
              placeholder="Contoh: SMP NEGERI 1 TELADAN KOTA SEMARANG"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Alamat Lengkap Satuan Pendidikan
            </label>
            <input
              type="text"
              required
              value={formData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              placeholder="Contoh: Jl. Pemuda No. 142, Kota Semarang, Jawa Tengah"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tempat Pembuatan Dokumen
              </label>
              <input
                type="text"
                required
                value={formData.tempatTtd}
                onChange={(e) => handleChange('tempatTtd', e.target.value)}
                placeholder="Contoh: Semarang"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tanggal Pengesahan Dokumen
              </label>
              <input
                type="text"
                required
                value={formData.tanggalTtd}
                onChange={(e) => handleChange('tanggalTtd', e.target.value)}
                placeholder="Contoh: 15 Juli 2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nama Kepala Sekolah (Beserta Gelar)
              </label>
              <input
                type="text"
                required
                value={formData.namaKepalaSekolah}
                onChange={(e) => handleChange('namaKepalaSekolah', e.target.value)}
                placeholder="Contoh: Dr. H. Sulistiyo Raharjo, M.Pd."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                NIP / NUPTK Kepala Sekolah
              </label>
              <input
                type="text"
                required
                value={formData.nipKepalaSekolah}
                onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                placeholder="Contoh: 19740512 199803 1 004"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tahun Pelajaran Aktif
              </label>
              <input
                type="text"
                required
                value={formData.tahunPelajaran}
                onChange={(e) => handleChange('tahunPelajaran', e.target.value)}
                placeholder="Contoh: 2026/2027"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Semester Aktif
              </label>
              <select
                value={formData.semesterAktif}
                onChange={(e) => handleChange('semesterAktif', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
            >
              Simpan Perubahan Identitas Sekolah
            </button>
          </div>
        </form>

        {/* Right: Live Preview Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Pratinjau Kop & TTD Resmi</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Live Update</span>
            </div>

            {/* Simulated Paper */}
            <div className="bg-white p-5 rounded-lg shadow-inner text-black font-serif text-[10pt] leading-tight select-none">
              <div dangerouslySetInnerHTML={{ __html: previewKop }} />
              
              <div className="text-center font-bold text-[11pt] my-4 uppercase">
                CONTOH PERANGKAT AJAR
              </div>
              <p className="text-justify indent-6 text-[9.5pt]">
                Isi dokumen administrasi pembelajaran Kurikulum Merdeka atau Kurikulum Berbasis Cinta (KBC) akan disajikan di sini secara rapi...
              </p>

              <div dangerouslySetInnerHTML={{ __html: previewSignature }} />
            </div>

            <div className="mt-3 text-[11px] text-slate-400 flex items-start gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Kop surat formal menggunakan teks tengah tebal dengan garis pembatas ganda tanpa logo gambar, dan tabel tanda tangan 2 kolom sejajar rapi di kiri & kanan.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
