import React, { useState } from 'react';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { TeacherJournal, User, ClassRoom } from '../types';
import Swal from 'sweetalert2';

interface TeacherJournalViewProps {
  currentUser: User;
  classes: ClassRoom[];
  journals: TeacherJournal[];
  onSaveJournal: (journal: TeacherJournal) => void;
  onDeleteJournal: (id: string) => void;
}

export const TeacherJournalView: React.FC<TeacherJournalViewProps> = ({
  currentUser,
  classes,
  journals,
  onSaveJournal,
  onDeleteJournal
}) => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [className, setClassName] = useState(classes[0]?.name || 'VII-A');
  const [subject, setSubject] = useState(currentUser.subject || 'Bahasa Indonesia');
  const [period, setPeriod] = useState('Jam ke 1 - 2 (07.00 - 08.20)');
  const [material, setMaterial] = useState('');
  const [activity, setActivity] = useState('');
  const [attendanceSummary, setAttendanceSummary] = useState('Hadir Lengkap');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !activity.trim()) {
      Swal.fire({
        title: 'Form Belum Lengkap',
        text: 'Materi dan aktivitas pembelajaran wajib diisi.',
        icon: 'warning'
      });
      return;
    }

    const newJournal: TeacherJournal = {
      id: `jrn_${Date.now()}`,
      date,
      className,
      subject,
      period,
      material,
      activity,
      attendanceSummary,
      notes,
      teacherName: currentUser.name
    };

    onSaveJournal(newJournal);
    setShowModal(false);
    setMaterial('');
    setActivity('');
    setNotes('');

    Swal.fire({
      title: 'Jurnal Tersimpan!',
      text: 'Catatan agenda mengajar berhasil ditambahkan.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Catatan Jurnal?',
      text: 'Jurnal mengajar ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((res) => {
      if (res.isConfirmed) {
        onDeleteJournal(id);
        Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <span>Agenda & Jurnal Guru</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Buku catatan harian kegiatan belajar mengajar, capaian materi, dan refleksi pedagogis.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-amber-600/30 flex items-center gap-1.5 transition self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurnal Mengajar</span>
        </button>
      </div>

      {/* Journal Cards Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {journals.length > 0 ? (
          journals.map((j) => (
            <div key={j.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Kelas {j.className}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {j.subject}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(j.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Hapus Jurnal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {j.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {j.period}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-300">Materi Pokok:</span>
                    <p className="text-white font-medium mt-0.5">{j.material}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300">Aktivitas Pembelajaran:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{j.activity}</p>
                  </div>
                  {j.notes && (
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-300 block mb-0.5">Catatan Khusus:</span>
                      {j.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Pengampu: <strong>{j.teacherName}</strong></span>
                <span className="text-emerald-400 font-medium">{j.attendanceSummary}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            Belum ada catatan jurnal. Klik tombol "Tambah Jurnal Mengajar" di atas untuk menambahkan.
          </div>
        )}
      </div>

      {/* Modal Add Journal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-400" />
              <span>Input Jurnal & Agenda Mengajar</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Kelas</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Jam / Periode</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Contoh: Jam 1-2 (07.00 - 08.20)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Materi Pokok yang Diajarkan
                </label>
                <input
                  type="text"
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Contoh: Teks Prosedur Kompleks dalam Kehidupan Sehari-hari"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Aktivitas Pembelajaran (Sintak & Respon Peserta Didik)
                </label>
                <textarea
                  rows={3}
                  required
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="Contoh: Eksplorasi kontekstual, diskusi kelompok pemecahan masalah, presentasi santun..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Rekap Kehadiran</label>
                  <input
                    type="text"
                    value={attendanceSummary}
                    onChange={(e) => setAttendanceSummary(e.target.value)}
                    placeholder="Contoh: 30 Hadir, 1 Izin, 1 Sakit"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Catatan Refleksi</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Perlu penguatan pada kelompok 3"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/30 transition"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
