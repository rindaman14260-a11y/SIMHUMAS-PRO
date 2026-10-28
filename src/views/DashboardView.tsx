import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  FileEdit, 
  CheckCircle, 
  Inbox, 
  MessageSquareWarning, 
  CalendarDays, 
  Sparkles, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  Check, 
  ExternalLink,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Send
} from 'lucide-react';
import { 
  User, 
  SchoolIdentity, 
  GuestVisit, 
  OfficialLetter, 
  IncomingLetter, 
  HumasAgenda, 
  CitizenComplaint,
  PublicServiceTicket 
} from '../types';
import Swal from 'sweetalert2';

interface DashboardViewProps {
  currentUser: User;
  schoolIdentity: SchoolIdentity;
  guestVisits: GuestVisit[];
  officialLetters: OfficialLetter[];
  incomingLetters: IncomingLetter[];
  agendas: HumasAgenda[];
  complaints: CitizenComplaint[];
  publicServices: PublicServiceTicket[];
  onNavigate: (view: string) => void;
  onCheckOutGuest: (guestId: string) => void;
  onSelectLetterForReview?: (letter: OfficialLetter) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  schoolIdentity,
  guestVisits,
  officialLetters,
  incomingLetters,
  agendas,
  complaints,
  publicServices,
  onNavigate,
  onCheckOutGuest
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Stats
  const todayVisits = guestVisits.filter(v => v.visitDate === todayStr);
  const activeVisitors = guestVisits.filter(v => v.status === 'berkunjung' || v.status === 'menunggu');
  const pendingApprovals = officialLetters.filter(l => l.status === 'menunggu_persetujuan');
  const approvedLetters = officialLetters.filter(l => l.status === 'disetujui' || l.status === 'terbit');
  const pendingDispositions = incomingLetters.flatMap(l => l.dispositions || []).filter(d => d.status !== 'selesai');
  const pendingComplaints = complaints.filter(c => c.status === 'menunggu' || c.status === 'diproses');
  const upcomingAgendas = agendas.filter(a => a.status === 'akan_datang').slice(0, 4);

  const isKepsekOrAdmin = currentUser.role === 'kepala_sekolah' || currentUser.role === 'super_admin' || currentUser.role === 'admin_humas';

  const handleQuickCheckOut = (guest: GuestVisit) => {
    Swal.fire({
      title: 'Konfirmasi Kepulangan Tamu',
      text: `Selesaikan kunjungan ${guest.fullName} (${guest.institution})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Check-Out',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#047857'
    }).then((res) => {
      if (res.isConfirmed) {
        onCheckOutGuest(guest.id);
        Swal.fire({
          title: 'Kunjungan Selesai',
          text: `Tamu ${guest.fullName} berhasil di-checkout. Waktu kepulangan dan durasi kunjungan tercatat otomatis.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Ahlan Wa Sahlan & Identity */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">
                SIMHUMAS IMAMA PRO
              </span>
              <span className="text-xs text-emerald-200">
                SD ISLAM IMAMA SEMARANG
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Ahlan Wa Sahlan, {currentUser.name}
            </h1>
            <p className="text-xs text-emerald-100/90 max-w-2xl">
              Pusat Pengelolaan Hubungan Masyarakat, Administrasi Persuratan Resmi Berbasis QR Code, dan Pelayanan Terpadu SD Islam Imama.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('buku_tamu_publik')}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Buku Tamu Publik</span>
            </button>
            <button
              onClick={() => onNavigate('asisten_ai')}
              className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/50 font-semibold text-xs shadow-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Asisten AI Humas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Tamu Aktif */}
        <div 
          onClick={() => onNavigate('kelola_tamu')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tamu di Sekolah
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeVisitors.length}</span>
            <span className="text-xs text-emerald-600 font-medium">sedang hadir</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Total kunjungan hari ini: <strong className="text-slate-800">{todayVisits.length} tamu</strong>
          </div>
        </div>

        {/* 2. Persetujuan Surat */}
        <div 
          onClick={() => onNavigate(isKepsekOrAdmin ? 'persetujuan_surat' : 'buat_surat')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Persetujuan Kepsek
            </div>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition ${
              pendingApprovals.length > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingApprovals.length}</span>
            <span className="text-xs text-amber-600 font-medium">perlu ditinjau</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Surat resmi terbit & aktif: <strong className="text-slate-800">{approvedLetters.length} dokumen</strong>
          </div>
        </div>

        {/* 3. Disposisi Surat Masuk */}
        <div 
          onClick={() => onNavigate('surat_masuk')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Disposisi Masuk
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingDispositions.length}</span>
            <span className="text-xs text-blue-600 font-medium">tindak lanjut</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Total surat masuk: <strong className="text-slate-800">{incomingLetters.length} berkas</strong>
          </div>
        </div>

        {/* 4. Pengaduan & Layanan */}
        <div 
          onClick={() => onNavigate('pengaduan')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Pengaduan & Aspirasi
            </div>
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingComplaints.length}</span>
            <span className="text-xs text-rose-600 font-medium">butuh respon</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Tiket layanan wali murid: <strong className="text-slate-800">{publicServices.length} permohonan</strong>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Aksi Cepat Kehumasan
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate('buku_tamu_publik')}
            className="flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm text-center transition"
          >
            <QrCode className="w-5 h-5 text-emerald-600 mb-1.5" />
            <span className="text-xs font-bold text-slate-800">Buku Tamu</span>
            <span className="text-[10px] text-slate-500">Isi Form & Scan</span>
          </button>

          <button
            onClick={() => onNavigate('buat_surat')}
            className="flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm text-center transition"
          >
            <FileEdit className="w-5 h-5 text-emerald-600 mb-1.5" />
            <span className="text-xs font-bold text-slate-800">Buat Surat</span>
            <span className="text-[10px] text-slate-500">13 Template Resmi</span>
          </button>

          {isKepsekOrAdmin && (
            <button
              onClick={() => onNavigate('persetujuan_surat')}
              className="flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200 hover:border-amber-500 hover:shadow-sm text-center transition"
            >
              <CheckCircle className="w-5 h-5 text-amber-600 mb-1.5" />
              <span className="text-xs font-bold text-slate-800">Persetujuan</span>
              <span className="text-[10px] text-slate-500">{pendingApprovals.length} menunggu</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('surat_masuk')}
            className="flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm text-center transition"
          >
            <Inbox className="w-5 h-5 text-blue-600 mb-1.5" />
            <span className="text-xs font-bold text-slate-800">Surat Masuk</span>
            <span className="text-[10px] text-slate-500">Disposisi Kepsek</span>
          </button>

          <button
            onClick={() => onNavigate('verifikasi_surat')}
            className="flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm text-center transition"
          >
            <ShieldCheck className="w-5 h-5 text-teal-600 mb-1.5" />
            <span className="text-xs font-bold text-slate-800">Verifikasi Surat</span>
            <span className="text-[10px] text-slate-500">Cek Keaslian QR</span>
          </button>

          <button
            onClick={() => onNavigate('asisten_ai')}
            className="flex flex-col items-center p-3 rounded-lg bg-white border border-slate-200 hover:border-amber-500 hover:shadow-sm text-center transition"
          >
            <Sparkles className="w-5 h-5 text-amber-500 mb-1.5" />
            <span className="text-xs font-bold text-slate-800">AI Humas</span>
            <span className="text-[10px] text-slate-500">Tulis & Edit Surat</span>
          </button>
        </div>
      </div>

      {/* Dual Section: Active Visitors & Pending Approval / Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Visitors (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Tamu yang Sedang Berkunjung di Sekolah</span>
              </h2>
              <p className="text-xs text-slate-500">Daftar tamu aktif yang berada di lingkungan SD Islam Imama</p>
            </div>
            <button
              onClick={() => onNavigate('kelola_tamu')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeVisitors.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Saat ini tidak ada tamu yang sedang berkunjung di lingkungan sekolah.
            </div>
          ) : (
            <div className="space-y-3">
              {activeVisitors.map(guest => (
                <div 
                  key={guest.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {guest.fullName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {guest.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Instansi: <span className="font-medium text-slate-800">{guest.institution}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Keperluan: <strong className="text-slate-700">{guest.purpose}</strong></span>
                      <span>Bertemu: <strong className="text-slate-700">{guest.personToMeet}</strong></span>
                      <span>Masuk: <strong className="text-emerald-700">{guest.checkInTime} WIB</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleQuickCheckOut(guest)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Check-Out</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pending Approvals & Upcoming Agendas (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Letters Pending Approval */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                <span>Menunggu Persetujuan Kepsek</span>
              </h2>
              {isKepsekOrAdmin && (
                <button
                  onClick={() => onNavigate('persetujuan_surat')}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Tinjau Semua
                </button>
              )}
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="py-5 text-center text-slate-400 text-xs">
                Tidak ada draf surat yang menunggu persetujuan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingApprovals.slice(0, 3).map(letter => (
                  <div 
                    key={letter.id} 
                    className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="truncate max-w-[200px]">{letter.title}</span>
                      <span className="text-[10px] text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded font-mono">
                        {letter.templateType.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tujuan: <span className="font-medium text-slate-700">{letter.recipientName}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-slate-500">{letter.letterNumber}</span>
                      {isKepsekOrAdmin && (
                        <button
                          onClick={() => onNavigate('persetujuan_surat')}
                          className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          <span>Tinjau</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Humas Agendas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <span>Agenda Humas Terdekat</span>
              </h2>
              <button
                onClick={() => onNavigate('agenda')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Lihat Agenda
              </button>
            </div>

            <div className="space-y-2">
              {upcomingAgendas.map(item => (
                <div key={item.id} className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">{item.title}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">
                      {item.eventDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Lokasi: {item.location} • Penanggung Jawab: {item.pic}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* School Official Identity Footer Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-600 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
            SDI
          </div>
          <div>
            <div className="font-bold text-slate-900">{schoolIdentity.namaSekolah} • NPSN: {schoolIdentity.npsn}</div>
            <div className="text-[11px] text-slate-500">{schoolIdentity.alamat}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{schoolIdentity.telepon}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>{schoolIdentity.email}</span>
          </div>
          <div className="text-slate-400">
            Kepsek: <strong className="text-slate-700">{schoolIdentity.namaKepalaSekolah}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
