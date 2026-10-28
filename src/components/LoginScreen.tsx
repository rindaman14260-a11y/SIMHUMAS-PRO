import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  Award, 
  Users, 
  Sparkles,
  ArrowRight,
  School,
  QrCode,
  UserCheck
} from 'lucide-react';
import { SchoolIdentity, User } from '../types';
import Swal from 'sweetalert2';

interface LoginScreenProps {
  schoolIdentity: SchoolIdentity;
  allUsers: User[];
  onLoginSuccess: (user: User) => void;
  onOpenPublicGuestBook: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  schoolIdentity,
  allUsers,
  onLoginSuccess,
  onOpenPublicGuestBook
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const match = allUsers.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase() && 
             (u.password === password || !u.password)
      );

      if (match) {
        Swal.fire({
          title: `Ahlan Wa Sahlan!`,
          text: `Selamat datang, ${match.name} (${match.position})`,
          icon: 'success',
          timer: 1600,
          showConfirmButton: false,
          confirmButtonColor: '#047857'
        });
        onLoginSuccess(match);
      } else {
        Swal.fire({
          title: 'Akses Ditolak',
          text: 'Nama pengguna atau kata sandi tidak cocok. Silakan coba lagi atau gunakan tombol akses cepat di bawah.',
          icon: 'error',
          confirmButtonColor: '#e11d48'
        });
      }
      setIsLoading(false);
    }, 350);
  };

  const handleQuickLogin = (roleUsername: string) => {
    const user = allUsers.find(u => u.username === roleUsername);
    if (user) {
      onLoginSuccess(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Islamic Geometric / Glow Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid md:grid-cols-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-900/20 overflow-hidden relative z-10">
        
        {/* Left Panel: Islamic Identity & School Branding */}
        <div className="md:col-span-5 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 p-8 text-white flex flex-col justify-between relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
                <School className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-emerald-200 uppercase">
                  SIMHUMAS PRO
                </span>
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                  {schoolIdentity.namaSekolah}
                </h1>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="inline-block px-2.5 py-1 rounded bg-emerald-700/60 border border-emerald-600/50 text-xs text-emerald-100 font-semibold">
                NPSN: {schoolIdentity.npsn} • Akreditasi {schoolIdentity.akreditasi}
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Sistem Informasi Manajemen Hubungan Masyarakat & Pelayanan Administrasi Terpadu berbasis digital, QR Code, dan Persuratan Resmi.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2 pt-2 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Buku Tamu Digital & QR Code Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Smart Letter Generator & Tanda Tangan Kepsek</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Surat Masuk, Disposisi & Pelayanan Publik</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Asisten Cerdas AI Humas (Gemini 2.5)</span>
              </div>
            </div>
          </div>

          {/* Public Guest Quick Action Button */}
          <div className="mt-8 pt-6 border-t border-emerald-700/50">
            <button
              onClick={onOpenPublicGuestBook}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 group"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Isi Buku Tamu Kunjungan (Publik)</span>
              <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
            </button>
            <p className="text-[10px] text-center text-emerald-300/80 mt-2">
              Pengunjung/Wali Murid dapat mengisi buku tamu langsung tanpa sandi
            </p>
          </div>
        </div>

        {/* Right Panel: Login Form & 1-Click Role Switcher */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Masuk ke Sistem</h2>
                <p className="text-xs text-slate-500">Pilih akses akun resmi atau masuk menggunakan kredensial</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                Semarang, Jateng
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: kepsek / admin / humas"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  *Untuk demo, kata sandi dapat dikosongkan atau bebas
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-md shadow-emerald-800/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memeriksa Akses...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Role Access Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Akses Cepat Demo (1-Klik Tanpa Ketik)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Super Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('superadmin')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-amber-900 truncate">Super Admin</div>
                    <div className="text-[10px] text-amber-700">Akses Penuh</div>
                  </div>
                </button>

                {/* 2. Admin Humas */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin_humas')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition"
                >
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-emerald-950 truncate">Koord. Humas</div>
                    <div className="text-[10px] text-emerald-700">Lutfi Maulana</div>
                  </div>
                </button>

                {/* 3. Kepala Sekolah */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('kepala_sekolah')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-left transition"
                >
                  <Award className="w-4 h-4 text-purple-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-purple-950 truncate">Kepala Sekolah</div>
                    <div className="text-[10px] text-purple-700">M. Muzamil, S.Pd.</div>
                  </div>
                </button>

                {/* 4. Petugas Front Desk */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('petugas_humas')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition"
                >
                  <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-blue-950 truncate">Front Desk / Resepsionis</div>
                    <div className="text-[10px] text-blue-700">Siti Aminah</div>
                  </div>
                </button>

                {/* 5. Guru / Staf */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('guru_staf')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-left transition"
                >
                  <Users className="w-4 h-4 text-teal-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-teal-950 truncate">Guru / Staf</div>
                    <div className="text-[10px] text-teal-700">Ahmad Fauzi</div>
                  </div>
                </button>

                {/* 6. Tamu Publik */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('tamu')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-left transition"
                >
                  <QrCode className="w-4 h-4 text-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">Tamu Publik</div>
                    <div className="text-[10px] text-slate-600">Scan & Registrasi</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 text-[11px] text-slate-400 text-center">
            {schoolIdentity.alamat} • Telp: {schoolIdentity.telepon}
          </div>
        </div>
      </div>
    </div>
  );
};
