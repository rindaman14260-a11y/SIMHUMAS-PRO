import React, { useState } from 'react';
import { 
  BadgeCheck, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  FileText, 
  Phone, 
  Send, 
  UserCheck 
} from 'lucide-react';
import { PublicServiceTicket, SchoolIdentity, User } from '../types';
import Swal from 'sweetalert2';

interface PublicServiceViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  tickets: PublicServiceTicket[];
  onSaveTicket: (ticket: PublicServiceTicket) => void;
}

export const PublicServiceView: React.FC<PublicServiceViewProps> = ({
  schoolIdentity,
  currentUser,
  tickets,
  onSaveTicket
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New ticket form
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [serviceType, setServiceType] = useState<PublicServiceTicket['serviceType']>('Surat Keterangan Aktif');
  const [detailNeed, setDetailNeed] = useState('');

  const filtered = tickets.filter(t => 
    t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seq = Math.floor(100 + Math.random() * 900);
    const tktNo = `LYN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${seq}`;

    const newTicket: PublicServiceTicket = {
      id: `svc_${Date.now()}`,
      ticketNumber: tktNo,
      applicantName: applicantName.trim(),
      phone: phone.trim(),
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      serviceType,
      detailNeed: detailNeed.trim(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'diajukan',
      createdAt: new Date().toISOString()
    };

    onSaveTicket(newTicket);
    setShowAddModal(false);
    // Reset
    setApplicantName('');
    setPhone('');
    setStudentName('');
    setStudentClass('');
    setDetailNeed('');

    Swal.fire({
      title: 'Permohonan Layanan Tercatat',
      text: `Nomor Tiket Layanan: ${newTicket.ticketNumber}. Petugas Tata Usaha / Humas akan memproses berkas Anda.`,
      icon: 'success',
      confirmButtonColor: '#047857'
    });
  };

  const handleUpdateStatus = (ticket: PublicServiceTicket, newStatus: PublicServiceTicket['status']) => {
    const updated = { ...ticket, status: newStatus };
    onSaveTicket(updated);
    Swal.fire({
      title: 'Status Diperbarui',
      text: `Tiket ${ticket.ticketNumber} sekarang: ${newStatus.toUpperCase()}`,
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-emerald-700" />
            <span>Pelayanan Wali Murid & Legalisir Administrasi</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pusat permohonan surat keterangan aktif siswa, legalisir ijazah/rapor, dan surat rekomendasi {schoolIdentity.namaSekolah}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Permohonan Layanan</span>
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
            placeholder="Cari nomor tiket, nama pemohon, nama siswa, atau jenis layanan..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">No. Tiket</th>
                <th className="py-3 px-4">Pemohon & Siswa</th>
                <th className="py-3 px-4">Jenis Layanan</th>
                <th className="py-3 px-4">Tanggal Diajukan</th>
                <th className="py-3 px-4">Rincian / Keperluan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada permohonan layanan tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.applicantName}</div>
                      <div className="text-[11px] text-slate-600">Siswa: {t.studentName} ({t.studentClass})</div>
                      <div className="text-[10px] text-slate-400">WA: {t.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {t.serviceType}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {t.requestDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {t.detailNeed || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'siap_diambil' ? 'bg-blue-100 text-blue-800' :
                        t.status === 'diproses' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t, e.target.value as any)}
                        className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-300 rounded shadow-xs outline-none"
                      >
                        <option value="diajukan">Diajukan</option>
                        <option value="diproses">Diproses</option>
                        <option value="siap_diambil">Siap Diambil</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Form Permohonan Layanan Wali Murid</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Pemohon (Orang Tua / Wali)</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Nama Bapak / Ibu..."
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jenis Layanan</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full p-2 border rounded bg-slate-50"
                  >
                    <option value="Surat Keterangan Aktif">Surat Keterangan Aktif</option>
                    <option value="Legalisir Dokumen">Legalisir Dokumen (Rapor/Ijazah)</option>
                    <option value="Surat Rekomendasi Beasiswa">Surat Rekomendasi Beasiswa</option>
                    <option value="Surat Pindah / Mutasi">Surat Keterangan Pindah / Mutasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nama ananda..."
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kelas Siswa</label>
                  <input
                    type="text"
                    required
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="Contoh: 3A / 5B"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Keperluan / Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  value={detailNeed}
                  onChange={(e) => setDetailNeed(e.target.value)}
                  placeholder="Contoh: Untuk persyaratan tunjangan anak PNS / beasiswa..."
                  className="w-full p-2 border rounded bg-slate-50"
                />
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
                  Ajukan Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
