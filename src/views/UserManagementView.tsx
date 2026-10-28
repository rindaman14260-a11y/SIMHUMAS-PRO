import React, { useState } from 'react';
import { 
  UserCog, 
  Plus, 
  Search, 
  ShieldCheck, 
  Award, 
  Users, 
  Lock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { User, UserRole } from '../types';
import Swal from 'sweetalert2';

interface UserManagementViewProps {
  allUsers: User[];
  onSaveUser: (user: User) => void;
  onResetDatabase: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  allUsers,
  onSaveUser,
  onResetDatabase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New user form
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('guru_staf');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filtered = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allUsers.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
      Swal.fire({
        title: 'Username Sudah Digunakan',
        text: 'Silakan pilih nama pengguna lain.',
        icon: 'warning',
        confirmButtonColor: '#047857'
      });
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: username.trim().toLowerCase(),
      password: password.trim() || undefined,
      name: name.trim(),
      role,
      position: position.trim() || role.replace('_', ' ').toUpperCase(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      isActive: true
    };

    onSaveUser(newUser);
    setShowAddModal(false);
    setName('');
    setUsername('');
    setPassword('');
    setPosition('');
    setPhone('');
    setEmail('');

    Swal.fire({
      title: 'Akun Ditambahkan',
      text: `Pengguna ${newUser.name} (${newUser.role}) berhasil didaftarkan.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleToggleActive = (user: User) => {
    onSaveUser({ ...user, isActive: !user.isActive });
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">SUPER ADMIN</span>;
      case 'kepala_sekolah':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">KEPALA SEKOLAH</span>;
      case 'admin_humas':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">ADMIN HUMAS</span>;
      case 'petugas_humas':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">FRONT DESK</span>;
      case 'guru_staf':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">GURU / STAF</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">TAMU</span>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-emerald-700" />
            <span>Manajemen Pengguna & Hak Akses (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pengelolaan 6 tingkatan hak akses: Super Admin, Admin Humas, Kepala Sekolah, Front Desk, Guru/Staf, dan Tamu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDatabase}
            className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pengguna, username, jabatan, atau peran hak akses..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Nama & Username</th>
                <th className="py-3 px-4">Jabatan / Posisi</th>
                <th className="py-3 px-4">Peran Hak Akses</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] font-mono text-emerald-800">@{user.username}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {user.position}
                  </td>
                  <td className="py-3 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{user.phone || '-'}</div>
                    <div className="text-[10px] text-slate-400">{user.email || '-'}</div>
                  </td>
                  <td className="py-3 px-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <XCircle className="w-3.5 h-3.5" />
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                        user.isActive 
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Tambah Akun Pengguna</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Siti Aisyah, S.Pd."
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Username (Login)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nama_user"
                    className="w-full p-2 border rounded bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Bebas untuk demo"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Peran Hak Akses (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2 border rounded bg-slate-50 font-semibold"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin_humas">Admin Humas</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="petugas_humas">Petugas Humas / Front Desk</option>
                    <option value="guru_staf">Guru / Staf</option>
                    <option value="tamu">Tamu Publik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jabatan / Posisi</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Contoh: Guru Kelas 4 / Resepsionis"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@sdislamimama.sch.id"
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
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
