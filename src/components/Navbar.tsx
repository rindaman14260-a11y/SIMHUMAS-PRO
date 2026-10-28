import React, { useState } from 'react';
import { 
  Building, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  Sparkles, 
  ChevronDown, 
  QrCode,
  Search,
  Check,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { User, SchoolIdentity, SystemNotification } from '../types';
import Swal from 'sweetalert2';

interface NavbarProps {
  currentUser: User;
  schoolIdentity: SchoolIdentity;
  notifications: SystemNotification[];
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  onNavigate: (view: string) => void;
  activeVisitorsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  schoolIdentity,
  notifications,
  onLogout,
  onSwitchUser,
  allUsers,
  onNavigate,
  activeVisitorsCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            SUPER ADMIN
          </span>
        );
      case 'kepala_sekolah':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Award className="w-3 h-3 text-emerald-600" />
            KEPALA SEKOLAH
          </span>
        );
      case 'admin_humas':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">
            <Building className="w-3 h-3 text-teal-600" />
            ADMIN HUMAS
          </span>
        );
      case 'petugas_humas':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            FRONT DESK
          </span>
        );
      case 'guru_staf':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <UserIcon className="w-3 h-3 text-slate-500" />
            GURU / STAF
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            TAMU PUBLIK
          </span>
        );
    }
  };

  const handleQuickSwitch = () => {
    Swal.fire({
      title: 'Ganti Peran Pengguna (Demo)',
      text: 'Pilih profil pengguna untuk langsung beralih hak akses SIMHUMAS:',
      showCancelButton: true,
      cancelButtonText: 'Tutup',
      showDenyButton: true,
      denyButtonText: 'Kepala Sekolah',
      confirmButtonText: 'Admin Humas',
      showCloseButton: true,
      footer: '<div class="text-xs text-slate-500">Tersedia 6 peran: Super Admin, Admin Humas, Kepsek, Petugas, Guru, Tamu</div>'
    }).then((res) => {
      if (res.isConfirmed) {
        const h = allUsers.find(u => u.role === 'admin_humas') || allUsers[0];
        onSwitchUser(h);
        Swal.fire({ title: 'Beralih ke Admin Humas!', icon: 'success', timer: 1200, showConfirmButton: false });
      } else if (res.isDenied) {
        const k = allUsers.find(u => u.role === 'kepala_sekolah') || allUsers[0];
        onSwitchUser(k);
        Swal.fire({ title: 'Beralih ke Kepala Sekolah!', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-emerald-100 shadow-sm">
      {/* Left: School Identity & System Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white font-black text-lg">
          IM
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-emerald-950 tracking-tight flex items-center gap-1.5">
              <span>SIMHUMAS IMAMA PRO</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                SD ISLAM IMAMA
              </span>
            </h1>
          </div>
          <p className="text-xs text-emerald-700/80 font-medium hidden sm:block">
            Sistem Informasi Manajemen Hubungan Masyarakat & Persuratan Sekolah
          </p>
        </div>
      </div>

      {/* Right: Active Status, Quick Actions, Profile & Logout */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Active Visitors Live Badge */}
        <button
          onClick={() => onNavigate('daftar_tamu')}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 transition"
          title="Tamu yang saat ini masih berada di sekolah"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>{activeVisitorsCount} Tamu Aktif</span>
        </button>

        {/* QR Code Guestbook Access Button */}
        <button
          onClick={() => onNavigate('buku_tamu_qr')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
          title="Buka QR Code Buku Tamu untuk Ruang Tamu / Gerbang"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">QR Buku Tamu</span>
        </button>

        {/* Switch Role Quick Button */}
        <button
          onClick={handleQuickSwitch}
          className="hidden md:flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold transition"
          title="Ganti Peran Pengguna Cepat"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Switch Peran</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition relative"
            title="Pusat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-bold text-slate-900 text-sm">Pemberitahuan Sistem</span>
                <span className="text-[11px] text-emerald-700 font-medium">{unreadCount} belum dibaca</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNavigate(n.linkView);
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 cursor-pointer transition border border-slate-100"
                  >
                    <div className="font-bold text-slate-900 mb-0.5">{n.title}</div>
                    <div className="text-slate-600 leading-snug">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{n.createdAt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="mt-0.5">{getRoleBadge()}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow">
            {currentUser.name.charAt(0)}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            Swal.fire({
              title: 'Akhiri Sesi Pengguna?',
              text: 'Anda akan keluar dari SIMHUMAS IMAMA PRO.',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#047857',
              cancelButtonColor: '#64748b',
              confirmButtonText: 'Ya, Keluar',
              cancelButtonText: 'Batal'
            }).then((res) => {
              if (res.isConfirmed) {
                onLogout();
              }
            });
          }}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition ml-1"
          title="Keluar dari Sistem"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
