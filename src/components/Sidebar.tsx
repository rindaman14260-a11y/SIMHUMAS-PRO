import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  FileEdit, 
  Inbox, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  MessageSquareWarning, 
  HeartHandshake, 
  Newspaper, 
  CalendarDays, 
  Sparkles, 
  Building2, 
  UserCog, 
  RotateCcw,
  BadgeCheck,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  userRole: UserRole;
  pendingApprovalCount: number;
  activeVisitorsCount: number;
  pendingDispositionsCount: number;
  pendingComplaintsCount: number;
  onResetDatabase: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  userRole,
  pendingApprovalCount,
  activeVisitorsCount,
  pendingDispositionsCount,
  pendingComplaintsCount,
  onResetDatabase
}) => {
  const isSuperAdmin = userRole === 'super_admin';
  const isAdminHumas = userRole === 'admin_humas' || isSuperAdmin;
  const isKepsek = userRole === 'kepala_sekolah' || isSuperAdmin;
  const isFrontDesk = userRole === 'petugas_humas' || isAdminHumas;
  const isStaff = userRole === 'guru_staf' || isFrontDesk || isKepsek;
  const isPublicGuest = userRole === 'tamu';

  return (
    <aside className="w-64 bg-slate-900 border-r border-emerald-950 flex flex-col h-[calc(100vh-4rem)] text-slate-300 select-none overflow-y-auto shrink-0 shadow-xl">
      <div className="p-3 space-y-5">
        {/* Main Section */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 px-3">
            Menu Utama
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectView('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard Utama</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Guest Services Section */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 px-3">
            Buku Tamu Digital
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectView('buku_tamu_publik')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'buku_tamu_publik'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Buku Tamu Publik / QR</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-500/30">
                Front
              </span>
            </button>

            {!isPublicGuest && (
              <button
                onClick={() => onSelectView('kelola_tamu')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'kelola_tamu'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Daftar & Monitoring Tamu</span>
                </div>
                {activeVisitorsCount > 0 && (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                    {activeVisitorsCount} aktif
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Official Letters Section */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 px-3">
            Administrasi Persuratan
          </div>
          <nav className="space-y-1">
            {!isPublicGuest && (
              <button
                onClick={() => onSelectView('buat_surat')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'buat_surat'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-emerald-400" />
                  <span>Smart Letter Generator</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30">
                  13 Jenis
                </span>
              </button>
            )}

            {!isPublicGuest && (
              <button
                onClick={() => onSelectView('surat_keluar')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'surat_keluar'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Arsip Surat Keluar</span>
                </div>
              </button>
            )}

            {/* Approval Workflow - Kepsek & Admin */}
            {(isKepsek || isAdminHumas) && (
              <button
                onClick={() => onSelectView('persetujuan_surat')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'persetujuan_surat'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>Persetujuan Surat</span>
                </div>
                {pendingApprovalCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    {pendingApprovalCount}
                  </span>
                )}
              </button>
            )}

            {!isPublicGuest && (
              <button
                onClick={() => onSelectView('surat_masuk')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'surat_masuk'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-emerald-400" />
                  <span>Surat Masuk & Disposisi</span>
                </div>
                {pendingDispositionsCount > 0 && (
                  <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {pendingDispositionsCount}
                  </span>
                )}
              </button>
            )}

            {/* Public Verification Portal */}
            <button
              onClick={() => onSelectView('verifikasi_surat')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'verifikasi_surat'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSearch className="w-4 h-4 text-emerald-400" />
                <span>Verifikasi Keaslian Surat</span>
              </div>
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </nav>
        </div>

        {/* Public Relations & Services */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 px-3">
            Layanan Kehumasan
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectView('pelayanan_publik')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'pelayanan_publik'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Layanan Wali Murid</span>
              </div>
            </button>

            <button
              onClick={() => onSelectView('pengaduan')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'pengaduan'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareWarning className="w-4 h-4 text-amber-400" />
                <span>Pengaduan & Aspirasi</span>
              </div>
              {pendingComplaintsCount > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {pendingComplaintsCount}
                </span>
              )}
            </button>

            {!isPublicGuest && (
              <button
                onClick={() => onSelectView('mitra_kerjasama')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'mitra_kerjasama'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  <span>Mitra Kerja Sama (MoU)</span>
                </div>
              </button>
            )}

            {!isPublicGuest && (
              <button
                onClick={() => onSelectView('publikasi')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'publikasi'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4 text-emerald-400" />
                  <span>Publikasi Media & Berita</span>
                </div>
              </button>
            )}

            <button
              onClick={() => onSelectView('agenda')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'agenda'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-emerald-400" />
                <span>Agenda Kegiatan Humas</span>
              </div>
            </button>
          </nav>
        </div>

        {/* AI & Automation */}
        {!isPublicGuest && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 px-3">
              Kecerdasan Buatan (AI)
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => onSelectView('asisten_ai')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'asisten_ai'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-teal-900/40'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Asisten AI Humas Imama</span>
                </div>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  Gemini
                </span>
              </button>
            </nav>
          </div>
        )}

        {/* System Administration */}
        {isAdminHumas && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 px-3">
              Administrasi Sistem
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => onSelectView('profil_sekolah')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'profil_sekolah'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Identitas Resmi Sekolah</span>
                </div>
              </button>

              <button
                onClick={() => onSelectView('kelola_pengguna')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'kelola_pengguna'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCog className="w-4 h-4 text-emerald-400" />
                  <span>Manajemen Pengguna</span>
                </div>
              </button>
            </nav>
          </div>
        )}

        {/* Database & Reset Tool */}
        {isSuperAdmin && (
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onResetDatabase}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
              title="Reset data demo ke kondisi bawaan awal resmi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo Sekolah</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
