import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  UserCheck, 
  GraduationCap 
} from 'lucide-react';
import { ClassRoom, User, Student } from '../types';
import Swal from 'sweetalert2';

interface ClassManagementViewProps {
  classes: ClassRoom[];
  users: User[];
  students: Student[];
  onSaveClass: (cls: ClassRoom) => void;
  onDeleteClass: (id: string) => void;
}

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({
  classes,
  users,
  students,
  onSaveClass,
  onDeleteClass
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('7');
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [homeroomTeacherId, setHomeroomTeacherId] = useState('');

  const teachers = users.filter(u => u.role !== 'admin');

  const openCreateModal = () => {
    setEditingClass(null);
    setName('');
    setGrade('7');
    setAcademicYear('2026/2027');
    setHomeroomTeacherId(teachers[0]?.id || '');
    setShowModal(true);
  };

  const openEditModal = (c: ClassRoom) => {
    setEditingClass(c);
    setName(c.name);
    setGrade(c.grade);
    setAcademicYear(c.academicYear);
    setHomeroomTeacherId(c.homeroomTeacherId || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({ title: 'Gagal', text: 'Nama kelas wajib diisi.', icon: 'warning' });
      return;
    }

    const teacher = teachers.find(t => t.id === homeroomTeacherId);

    const newClass: ClassRoom = {
      id: editingClass ? editingClass.id : `cls_${Date.now()}`,
      name: name.trim().toUpperCase(),
      grade,
      academicYear,
      homeroomTeacherId: teacher?.id,
      homeroomTeacherName: teacher?.name
    };

    onSaveClass(newClass);
    setShowModal(false);

    Swal.fire({
      title: editingClass ? 'Kelas Diperbarui!' : 'Kelas Baru Ditambahkan!',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    });
  };

  const handleDelete = (c: ClassRoom) => {
    const studentCount = students.filter(s => s.className === c.name).length;
    if (studentCount > 0) {
      Swal.fire({
        title: 'Kelas Berisi Siswa',
        text: `Kelas ${c.name} memiliki ${studentCount} siswa terdaftar. Pindahkan siswa terlebih dahulu sebelum menghapus kelas.`,
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: `Hapus Kelas ${c.name}?`,
      text: 'Kelas ini akan dihapus dari daftar rombel.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteClass(c.id);
        Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Manajemen Rombongan Belajar (Kelas)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar kelas aktif, tingkat kelas, dan penetapan guru Wali Kelas binaan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const studentCount = students.filter(s => s.className === cls.name).length;

          return (
            <div key={cls.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-extrabold text-white tracking-tight">
                    Kelas {cls.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cls)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg transition"
                      title="Edit Kelas"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Tingkat / Fase:</span>
                    <span className="font-semibold text-slate-200">Kelas {cls.grade} (Fase D)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Tahun Pelajaran:</span>
                    <span className="font-mono text-slate-300">{cls.academicYear}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Jumlah Siswa:</span>
                    <span className="font-bold text-emerald-400">{studentCount} Siswa</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-[11px] text-slate-500 font-semibold mb-0.5 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Wali Kelas Binaan:</span>
                  </div>
                  <div className="font-bold text-white text-xs">
                    {cls.homeroomTeacherName || 'Belum Ditetapkan'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>{editingClass ? 'Edit Rombel' : 'Tambah Rombongan Belajar'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Kelas</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: VII-A atau 8-B"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tingkat</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                    <option value="10">Kelas 10</option>
                    <option value="11">Kelas 11</option>
                    <option value="12">Kelas 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tetapkan Wali Kelas</label>
                <select
                  value={homeroomTeacherId}
                  onChange={(e) => setHomeroomTeacherId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="">-- Pilih Guru Wali Kelas --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.subject || 'Guru'})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
