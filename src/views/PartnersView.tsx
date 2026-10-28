import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { SchoolPartner, SchoolIdentity, User } from '../types';
import Swal from 'sweetalert2';

interface PartnersViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  partners: SchoolPartner[];
  onSavePartner: (partner: SchoolPartner) => void;
  onDeletePartner: (partnerId: string) => void;
}

export const PartnersView: React.FC<PartnersViewProps> = ({
  schoolIdentity,
  currentUser,
  partners,
  onSavePartner,
  onDeletePartner
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New partner form
  const [partnerName, setPartnerName] = useState('');
  const [category, setCategory] = useState<SchoolPartner['category']>('Instansi Kesehatan');
  const [mouNumber, setMouNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 365 * 3).toISOString().split('T')[0]);
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');

  const filtered = partners.filter(p => 
    p.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.scopeOfWork.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.mouNumber && p.mouNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: SchoolPartner = {
      id: `ptn_${Date.now()}`,
      partnerName: partnerName.trim(),
      category,
      mouNumber: mouNumber.trim() || undefined,
      startDate,
      endDate,
      scopeOfWork: scopeOfWork.trim(),
      picName: picName.trim(),
      picPhone: picPhone.trim(),
      status: 'aktif'
    };

    onSavePartner(newPartner);
    setShowAddModal(false);
    setPartnerName('');
    setMouNumber('');
    setScopeOfWork('');
    setPicName('');
    setPicPhone('');

    Swal.fire({
      title: 'Mitra Kerja Sama Ditambahkan',
      text: `${newPartner.partnerName} berhasil disimpan dalam pangkalan data kemitraan.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleDelete = (partner: SchoolPartner) => {
    Swal.fire({
      title: 'Hapus Kemitraan?',
      text: `Hapus data mitra "${partner.partnerName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Hapus'
    }).then(res => {
      if (res.isConfirmed) {
        onDeletePartner(partner.id);
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-700" />
            <span>Pengelolaan Mitra Kerja Sama & MoU</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pangkalan data nota kesepahaman (MoU) dan kemitraan strategis {schoolIdentity.namaSekolah}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mitra Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama lembaga mitra, bidang kerja sama, nomor MoU..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(partner => (
          <div key={partner.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {partner.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {partner.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{partner.partnerName}</h3>

              {partner.mouNumber && (
                <div className="font-mono text-[10px] text-slate-500">
                  No. MoU: <strong className="text-slate-700">{partner.mouNumber}</strong>
                </div>
              )}

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {partner.scopeOfWork}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Masa Berlaku:</span>
                <span className="font-semibold text-slate-800">{partner.startDate} s.d. {partner.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Narahubung (PIC):</span>
                <span className="font-medium text-slate-800">{partner.picName} ({partner.picPhone})</span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleDelete(partner)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Tambah Mitra Kerja Sama / MoU</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Instansi / Lembaga Mitra</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Contoh: Puskesmas Kecamatan Mijen / Bank Syariah Indonesia"
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori Kemitraan</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border rounded bg-slate-50"
                  >
                    <option value="Instansi Kesehatan">Instansi Kesehatan</option>
                    <option value="Kepolisian & Keamanan">Kepolisian & Keamanan</option>
                    <option value="Perbankan & Keuangan">Perbankan & Keuangan</option>
                    <option value="Pondok Pesantren">Pondok Pesantren / Diniyah</option>
                    <option value="Perguruan Tinggi">Perguruan Tinggi / Universitas</option>
                    <option value="Dunia Usaha">Dunia Usaha & Industri</option>
                    <option value="Komunitas">Komunitas / LSM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nomor Nota Kesepahaman (MoU)</label>
                  <input
                    type="text"
                    value={mouNumber}
                    onChange={(e) => setMouNumber(e.target.value)}
                    placeholder="Contoh: 005/MOU/SDI/2026"
                    className="w-full p-2 border rounded bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ruang Lingkup Kerja Sama</label>
                <textarea
                  rows={2}
                  required
                  value={scopeOfWork}
                  onChange={(e) => setScopeOfWork(e.target.value)}
                  placeholder="Contoh: Pelaksanaan skrining kesehatan siswa dan penyuluhan gizi berkala..."
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama PIC Mitra</label>
                  <input
                    type="text"
                    required
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Nama penanggung jawab..."
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">No. Kontak PIC</label>
                  <input
                    type="tel"
                    required
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded font-bold"
                >
                  Simpan Kemitraan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
