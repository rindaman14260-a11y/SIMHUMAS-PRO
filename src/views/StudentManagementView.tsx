import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  Search, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, ClassRoom } from '../types';
import Swal from 'sweetalert2';

interface StudentManagementViewProps {
  students: Student[];
  classes: ClassRoom[];
  onSaveStudent: (student: Student) => void;
  onSaveMultipleStudents: (students: Student[]) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  classes,
  onSaveStudent,
  onSaveMultipleStudents,
  onDeleteStudent
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states for manual
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState(classes[0]?.name || 'VII-A');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [religion, setReligion] = useState('Islam');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // Import raw CSV text
  const [rawCsvText, setRawCsvText] = useState('');

  const openCreateModal = () => {
    setEditingStudent(null);
    setNisn(`008${Math.floor(1000000 + Math.random() * 9000000)}`);
    setName('');
    setClassName(classes[0]?.name || 'VII-A');
    setGender('L');
    setReligion('Islam');
    setParentName('');
    setParentPhone('');
    setShowManualModal(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setNisn(s.nisn);
    setName(s.name);
    setClassName(s.className);
    setGender(s.gender);
    setReligion(s.religion);
    setParentName(s.parentName);
    setParentPhone(s.parentPhone || '');
    setShowManualModal(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nisn.trim()) {
      Swal.fire({ title: 'Gagal', text: 'Nama siswa dan NISN wajib diisi.', icon: 'warning' });
      return;
    }

    const newStudent: Student = {
      id: editingStudent ? editingStudent.id : `std_${Date.now()}`,
      nisn: nisn.trim(),
      name: name.trim(),
      className,
      gender,
      religion,
      parentName: parentName.trim() || 'Wali Murid',
      parentPhone: parentPhone.trim()
    };

    onSaveStudent(newStudent);
    setShowManualModal(false);

    Swal.fire({
      title: editingStudent ? 'Data Siswa Diperbarui!' : 'Siswa Baru Ditambahkan!',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    });
  };

  const handleImportCsv = () => {
    if (!rawCsvText.trim()) {
      Swal.fire({ title: 'Teks Kosong', text: 'Silakan tempel (paste) data CSV/Excel terlebih dahulu.', icon: 'warning' });
      return;
    }

    const lines = rawCsvText.trim().split('\n');
    const parsedStudents: Student[] = [];

    lines.forEach((line, idx) => {
      // Skip header if line contains 'NISN' or 'Nama'
      if (idx === 0 && (line.toLowerCase().includes('nisn') || line.toLowerCase().includes('nama'))) {
        return;
      }

      // Support comma or tab or semicolon
      const separator = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
      const parts = line.split(separator).map(p => p.trim().replace(/^["']|["']$/g, ''));

      if (parts.length >= 2 && parts[0] && parts[1]) {
        parsedStudents.push({
          id: `std_imp_${Date.now()}_${idx}`,
          nisn: parts[0] || `008${idx}`,
          name: parts[1],
          className: parts[2] || className,
          gender: (parts[3]?.toUpperCase() === 'P' ? 'P' : 'L') as 'L' | 'P',
          religion: parts[4] || 'Islam',
          parentName: parts[5] || 'Orang Tua / Wali',
          parentPhone: parts[6] || ''
        });
      }
    });

    if (parsedStudents.length === 0) {
      Swal.fire({
        title: 'Format Tidak Sesuai',
        text: 'Tidak ada baris data siswa yang valid. Pastikan format: NISN, Nama, Kelas, Gender, Agama, Orang Tua, Kontak',
        icon: 'error'
      });
      return;
    }

    onSaveMultipleStudents(parsedStudents);
    setShowImportModal(false);
    setRawCsvText('');

    Swal.fire({
      title: 'Import Berhasil!',
      text: `${parsedStudents.length} siswa berhasil dimasukkan ke dalam database.`,
      icon: 'success'
    });
  };

  const handleExportCsv = () => {
    const headers = ['No,NISN,Nama Siswa,Kelas,Jenis Kelamin,Agama,Nama Orang Tua/Wali,Nomor Telepon\n'];
    const rows = filteredStudents.map((s, idx) => {
      return `${idx + 1},"${s.nisn}","${s.name}","${s.className}","${s.gender}","${s.religion}","${s.parentName}","${s.parentPhone || ''}"\n`;
    });

    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_Siswa_${selectedClassFilter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (s: Student) => {
    Swal.fire({
      title: `Hapus Siswa ${s.name}?`,
      text: 'Data siswa ini akan dihapus dari rombel.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteStudent(s.id);
        Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    });
  };

  const filteredStudents = students.filter(s => {
    const matchClass = selectedClassFilter === 'ALL' || s.className === selectedClassFilter;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.nisn.includes(searchQuery) ||
                        s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Manajemen Data Siswa & Import CSV/Excel</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola data pokok peserta didik, input manual, import massal, dan pengelompokan rombel.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import CSV / Excel</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Filter Rombel:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
            {classes.map(c => (
              <option key={c.id} value={c.name}>Kelas {c.name}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NISN, nama siswa, orang tua..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-32">NISN</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4 w-24 text-center">Kelas</th>
                <th className="py-3 px-4 w-16 text-center">L/P</th>
                <th className="py-3 px-4 w-28">Agama</th>
                <th className="py-3 px-4">Orang Tua / Wali</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition text-xs">
                    <td className="py-3 px-4 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {s.nisn}
                    </td>
                    <td className="py-3 px-4 font-bold text-white text-sm">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {s.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        s.gender === 'L' ? 'bg-sky-500/20 text-sky-300' : 'bg-pink-500/20 text-pink-300'
                      }`}>
                        {s.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.religion}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{s.parentName}</div>
                      {s.parentPhone && <div className="text-[11px] text-slate-500 font-mono">{s.parentPhone}</div>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                          title="Edit Siswa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 text-xs">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Manual Create/Edit */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>{editingStudent ? 'Edit Data Siswa' : 'Input Data Siswa Baru'}</span>
            </h3>

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">NISN</label>
                  <input
                    type="text"
                    required
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Contoh: 0081234567"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Rombel / Kelas</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>Kelas {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Faiz Al-Faruq"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Agama</label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Contoh: Bambang Irawan"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nomor HP / WhatsApp</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              <span>Import Data Siswa Massal (CSV / Excel Paste)</span>
            </h3>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Salin (Copy) data dari Excel atau format CSV dengan susunan kolom:<br />
              <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">
                NISN, Nama Siswa, Kelas, Gender (L/P), Agama, Orang Tua, No HP
              </code>
            </p>

            <textarea
              rows={8}
              value={rawCsvText}
              onChange={(e) => setRawCsvText(e.target.value)}
              placeholder="Contoh format:&#10;0081234501, Ahmad Faiz Al-Faruq, VII-A, L, Islam, Bambang Irawan, 081234567801&#10;0081234502, Aisyah Putri Maharani, VII-A, P, Islam, Surya Pratama, 081234567802"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setRawCsvText(`0081234521, Daffa Al Ghifari, VII-A, L, Islam, Irwan, 0812345001
0081234522, Gendis Sekar Kinanti, VII-A, P, Islam, Hartono, 0812345002
0081234523, Rayhan Bintang Pratama, VII-A, L, Islam, Gunawan, 0812345003`);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Gunakan Contoh Template
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleImportCsv}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
                >
                  Proses Import Siswa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
