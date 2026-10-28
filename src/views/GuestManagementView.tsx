import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  CheckCircle, 
  LogOut, 
  Printer, 
  Download, 
  UserPlus, 
  Trash2, 
  Eye,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { GuestVisit, SchoolIdentity } from '../types';
import { printElementById } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface GuestManagementViewProps {
  schoolIdentity: SchoolIdentity;
  guestVisits: GuestVisit[];
  onCheckOutGuest: (guestId: string) => void;
  onDeleteGuest: (guestId: string) => void;
  onNavigateToPublicForm: () => void;
}

export const GuestManagementView: React.FC<GuestManagementViewProps> = ({
  schoolIdentity,
  guestVisits,
  onCheckOutGuest,
  onDeleteGuest,
  onNavigateToPublicForm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'berkunjung' | 'menunggu' | 'selesai'>('semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('semua');
  const [selectedGuest, setSelectedGuest] = useState<GuestVisit | null>(null);

  // Filtered list
  const filteredVisits = guestVisits.filter(visit => {
    const matchesSearch = 
      visit.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.personToMeet.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'semua' || visit.status === statusFilter;
    const matchesCategory = categoryFilter === 'semua' || visit.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Analytics
  const activeNow = guestVisits.filter(v => v.status === 'berkunjung');
  const completedToday = guestVisits.filter(v => v.status === 'selesai');
  const avgDuration = completedToday.length > 0 
    ? Math.round(completedToday.reduce((acc, v) => acc + (v.durationMinutes || 0), 0) / completedToday.length)
    : 0;

  const handleConfirmCheckOut = (guest: GuestVisit) => {
    Swal.fire({
      title: 'Konfirmasi Kepulangan',
      text: `Selesaikan kunjungan ${guest.fullName}? Sistem akan mencatat waktu kepulangan dan menghitung total lama kunjungan.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Check-Out',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#047857'
    }).then(res => {
      if (res.isConfirmed) {
        onCheckOutGuest(guest.id);
        Swal.fire({
          title: 'Berhasil Check-Out',
          text: `Kunjungan ${guest.fullName} telah selesai.`,
          icon: 'success',
          timer: 1400,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDelete = (guest: GuestVisit) => {
    Swal.fire({
      title: 'Hapus Data Tamu?',
      text: `Hapus catatan kunjungan ${guest.fullName}? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Hapus'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteGuest(guest.id);
        Swal.fire({
          title: 'Terhapus',
          text: 'Data tamu berhasil dihapus.',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  };

  const handleExportCSV = () => {
    const headers = ['No. Reg', 'Nama Lengkap', 'Instansi', 'No. HP', 'Kategori', 'Keperluan', 'Bertemu', 'Rombongan', 'Tanggal', 'Masuk', 'Keluar', 'Durasi (Menit)', 'Status'];
    const rows = filteredVisits.map(v => [
      `"${v.registrationNumber}"`,
      `"${v.fullName.replace(/"/g, '""')}"`,
      `"${v.institution.replace(/"/g, '""')}"`,
      `"${v.phone}"`,
      `"${v.category}"`,
      `"${v.purpose}"`,
      `"${v.personToMeet.replace(/"/g, '""')}"`,
      v.partySize,
      v.visitDate,
      v.checkInTime,
      v.checkOutTime || '-',
      v.durationMinutes || '-',
      v.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Buku_Tamu_SDI_IMAMA_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>Manajemen Buku Tamu & Monitoring Resepsionis</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan real-time kehadiran, kepulangan, dan rekapitulasi pengunjung {schoolIdentity.namaSekolah}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => printElementById('guest-table-print-area')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>

          <button
            onClick={onNavigateToPublicForm}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Input Tamu Baru</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Tamu Tercatat</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{guestVisits.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Keseluruhan sesi</div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Tamu Aktif di Sekolah</span>
          </div>
          <div className="text-2xl font-bold text-emerald-950 mt-1">{activeNow.length}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Belum check-out</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Kunjungan Selesai</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{completedToday.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sudah check-out</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Rata-rata Durasi</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{avgDuration} <span className="text-xs font-normal text-slate-500">menit</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">Waktu pelayanan</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama tamu, instansi, nomor registrasi, atau orang yang dituju..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="semua">Semua Status</option>
              <option value="berkunjung">Sedang Berkunjung (Aktif)</option>
              <option value="menunggu">Menunggu</option>
              <option value="selesai">Selesai (Sudah Pulang)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="semua">Semua Kategori</option>
              <option value="Wali Murid">Wali Murid</option>
              <option value="Calon Wali Murid">Calon Wali Murid</option>
              <option value="Instansi Pemerintah">Instansi Pemerintah</option>
              <option value="Mitra Kerja Sama">Mitra Kerja Sama</option>
              <option value="Peneliti / Akademisi">Peneliti / Akademisi</option>
              <option value="Alumni">Alumni</option>
              <option value="Tamu Umum">Tamu Umum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Area (with printable container) */}
      <div id="guest-table-print-area" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header for print only */}
        <div className="hidden print:block p-4 border-b border-slate-300 text-center">
          <h2 className="text-lg font-bold">{schoolIdentity.namaSekolah}</h2>
          <p className="text-xs">{schoolIdentity.alamat} • NPSN: {schoolIdentity.npsn}</p>
          <h3 className="text-sm font-semibold mt-2">REKAPITULASI BUKU TAMU DIGITAL</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Registrasi</th>
                <th className="py-3 px-4">Nama Tamu & Instansi</th>
                <th className="py-3 px-4">Kategori & Rombongan</th>
                <th className="py-3 px-4">Keperluan & Tujuan</th>
                <th className="py-3 px-4">Waktu Kunjungan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data tamu yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredVisits.map(guest => (
                  <tr key={guest.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {guest.registrationNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{guest.fullName}</div>
                      <div className="text-[11px] text-slate-500">{guest.institution}</div>
                      <div className="text-[10px] text-slate-400">Telp: {guest.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {guest.category}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {guest.partySize} orang
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{guest.purpose}</div>
                      <div className="text-[11px] text-slate-500">
                        Bertemu: <span className="font-semibold text-slate-700">{guest.personToMeet}</span>
                      </div>
                      {guest.detailNeed && (
                        <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                          "{guest.detailNeed}"
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-semibold">{guest.visitDate}</div>
                      <div className="text-[11px] text-slate-500">
                        Masuk: <span className="text-emerald-700 font-bold">{guest.checkInTime}</span>
                        {guest.checkOutTime && (
                          <span> • Keluar: <span className="text-slate-700">{guest.checkOutTime}</span></span>
                        )}
                      </div>
                      {guest.durationMinutes ? (
                        <div className="text-[10px] text-slate-400">
                          Durasi: <strong className="text-slate-700">{guest.durationMinutes} menit</strong>
                        </div>
                      ) : null}
                    </td>
                    <td className="py-3 px-4">
                      {guest.status === 'berkunjung' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white animate-pulse">
                          <Clock className="w-3 h-3" />
                          Berkunjung
                        </span>
                      )}
                      {guest.status === 'menunggu' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Menunggu
                        </span>
                      )}
                      {guest.status === 'selesai' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                          <CheckCircle className="w-3 h-3 text-slate-500" />
                          Selesai
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        {guest.status !== 'selesai' && (
                          <button
                            onClick={() => handleConfirmCheckOut(guest)}
                            title="Selesaikan Kunjungan (Check-Out)"
                            className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedGuest(guest)}
                          title="Lihat Detail Tamu"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(guest)}
                          title="Hapus Data"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {selectedGuest.registrationNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Detail Kunjungan Tamu</h3>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama:</span>
                  <span className="font-bold text-slate-900">{selectedGuest.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instansi:</span>
                  <span className="font-semibold text-slate-800">{selectedGuest.institution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Kontak:</span>
                  <span className="font-mono text-slate-800">{selectedGuest.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <span className="font-semibold text-emerald-700">{selectedGuest.category}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-semibold">Keperluan:</span>
                <p className="p-2.5 bg-slate-50 rounded-lg text-slate-800">{selectedGuest.detailNeed || selectedGuest.purpose}</p>
              </div>

              {selectedGuest.additionalNotes && (
                <div className="space-y-1">
                  <span className="text-slate-500 font-semibold">Catatan Resepsionis:</span>
                  <p className="p-2.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">{selectedGuest.additionalNotes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Waktu Masuk:</span>
                  <div className="font-bold text-emerald-800">{selectedGuest.visitDate} • {selectedGuest.checkInTime}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Waktu Keluar:</span>
                  <div className="font-bold text-slate-800">{selectedGuest.checkOutTime || 'Masih Berkunjung'}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
