import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Calendar,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { SchoolIdentity } from '../types';
import { DEFAULT_SCHOOL_IDENTITY } from '../services/storage';
import Swal from 'sweetalert2';

interface SchoolProfileViewProps {
  schoolIdentity: SchoolIdentity;
  onSaveIdentity: (identity: SchoolIdentity) => void;
}

export const SchoolProfileView: React.FC<SchoolProfileViewProps> = ({
  schoolIdentity,
  onSaveIdentity
}) => {
  const [formData, setFormData] = useState<SchoolIdentity>({ ...schoolIdentity });

  const handleChange = (field: keyof SchoolIdentity, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveIdentity(formData);
    Swal.fire({
      title: 'Identitas Sekolah Diperbarui',
      text: 'Informasi resmi SD Islam Imama telah disimpan dan disinkronkan ke seluruh kop surat & kartu tamu.',
      icon: 'success',
      confirmButtonColor: '#047857'
    });
  };

  const handleResetDefault = () => {
    setFormData({ ...DEFAULT_SCHOOL_IDENTITY });
    onSaveIdentity(DEFAULT_SCHOOL_IDENTITY);
    Swal.fire({
      title: 'Identitas Direset',
      text: 'Data profil sekolah dikembalikan ke profil resmi bawaan SD Islam Imama.',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            <span>Identitas Resmi & Pengaturan Sekolah</span>
          </h1>
          <p className="text-xs text-slate-500">
            Konfigurasi profil kelembagaan, pejabat penandatangan, nomor telepon, dan data resmi untuk Kop Surat
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefault}
          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan Bawaan</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Section 1: General Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>1. Profil Kelembagaan & Akreditasi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="lg:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => handleChange('namaSekolah', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Akreditasi</label>
              <input
                type="text"
                required
                value={formData.akreditasi}
                onChange={(e) => handleChange('akreditasi', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Lembaga</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Berdiri (Konfirmasi)</label>
              <input
                type="text"
                value={formData.tahunBerdiri}
                onChange={(e) => handleChange('tahunBerdiri', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Pos</label>
              <input
                type="text"
                value={formData.kodePos}
                onChange={(e) => handleChange('kodePos', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Location */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>2. Alamat & Wilayah Administratif</span>
          </h3>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <input
              type="text"
              required
              value={formData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelurahan</label>
              <input
                type="text"
                value={formData.kelurahan}
                onChange={(e) => handleChange('kelurahan', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => handleChange('kecamatan', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={formData.kota}
                onChange={(e) => handleChange('kota', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => handleChange('provinsi', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Channels */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>3. Saluran Kontak Resmi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Kantor</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => handleChange('telepon', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Situs Web Resmi</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Leadership Signers */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>4. Pejabat Penandatangan Resmi (Kop & TTD)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
                Kepala Sekolah
              </span>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.namaKepalaSekolah}
                  onChange={(e) => handleChange('namaKepalaSekolah', e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Penanggung Jawab / Koordinator Humas
              </span>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.namaHumas}
                  onChange={(e) => handleChange('namaHumas', e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Humas</label>
                <input
                  type="text"
                  value={formData.nipHumas}
                  onChange={(e) => handleChange('nipHumas', e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-800/30 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Identitas Sekolah</span>
          </button>
        </div>
      </form>
    </div>
  );
};
