import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Save, 
  Check, 
  UserX, 
  Clock, 
  BookOpen, 
  Sparkles,
  Search,
  CheckCheck
} from 'lucide-react';
import { ClassRoom, Student, AttendanceRecord, User, AttendanceStatus } from '../types';
import Swal from 'sweetalert2';

interface AttendanceViewProps {
  currentUser: User;
  classes: ClassRoom[];
  students: Student[];
  attendances: AttendanceRecord[];
  onSaveAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentUser,
  classes,
  students,
  attendances,
  onSaveAttendance
}) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'VII-A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState(currentUser.subject || 'Bahasa Indonesia');
  const [lessonHours, setLessonHours] = useState('1 - 2');
  const [teachingMaterial, setTeachingMaterial] = useState('');
  const [journalNote, setJournalNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students by selected class
  const classStudents = students.filter(s => s.className === selectedClass);

  // Initialize or load existing attendance for class & date & subject
  const existingRecord = attendances.find(
    a => a.date === selectedDate && a.className === selectedClass && a.subject === subject
  );

  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      const match = existingRecord?.studentAttendances.find(item => item.studentId === s.id);
      map[s.id] = {
        status: match ? match.status : 'Hadir',
        note: match ? match.note || '' : ''
      };
    });
    return map;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setStudentStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const handleSetAllHadir = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      updated[s.id] = { status: 'Hadir', note: '' };
    });
    setStudentStatusMap(updated);
    Swal.fire({
      title: 'Semua Hadir!',
      text: `Status seluruh siswa di kelas ${selectedClass} diset Hadir.`,
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  const handleSave = () => {
    if (!teachingMaterial.trim()) {
      Swal.fire({
        title: 'Materi Belum Diisi',
        text: 'Mohon isi ringkasan materi pelajaran yang diajarkan hari ini.',
        icon: 'warning',
        confirmButtonColor: '#e11d48'
      });
      return;
    }

    const studentAttendances = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      status: studentStatusMap[s.id]?.status || 'Hadir',
      note: studentStatusMap[s.id]?.note || ''
    }));

    const newRecord: AttendanceRecord = {
      id: existingRecord?.id || `att_${Date.now()}`,
      date: selectedDate,
      className: selectedClass,
      subject,
      lessonHours,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      studentAttendances,
      teachingMaterial,
      journalNote
    };

    onSaveAttendance(newRecord);

    Swal.fire({
      title: 'Presensi Berhasil Disimpan!',
      text: `Data presensi kelas ${selectedClass} tanggal ${selectedDate} telah tersimpan di sistem.`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false
    });
  };

  // Filtered view
  const displayStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  // Counters
  const countHadir = classStudents.filter(s => (studentStatusMap[s.id]?.status || 'Hadir') === 'Hadir').length;
  const countIzin = classStudents.filter(s => studentStatusMap[s.id]?.status === 'Izin').length;
  const countSakit = classStudents.filter(s => studentStatusMap[s.id]?.status === 'Sakit').length;
  const countAlpa = classStudents.filter(s => studentStatusMap[s.id]?.status === 'Alpa').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
            <span>Presensi Harian & Jurnal Mengajar</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Input kehadiran per jam pelajaran terintegrasi dengan jurnal catatan peristiwa kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSetAllHadir}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Set Semua Hadir</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Presensi & Jurnal</span>
          </button>
        </div>
      </div>

      {/* Filter & Teaching Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                const nextStudents = students.filter(s => s.className === e.target.value);
                const newMap: Record<string, { status: AttendanceStatus; note: string }> = {};
                nextStudents.forEach(s => { newMap[s.id] = { status: 'Hadir', note: '' }; });
                setStudentStatusMap(newMap);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.name}>Kelas {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Tanggal</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: Bahasa Indonesia"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Jam Pelajaran Ke-</label>
            <input
              type="text"
              value={lessonHours}
              onChange={(e) => setLessonHours(e.target.value)}
              placeholder="Contoh: 1 - 2"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Teaching Material & Journal note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Materi Pelajaran / Capaian Pembelajaran Hari Ini <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={teachingMaterial}
              onChange={(e) => setTeachingMaterial(e.target.value)}
              placeholder="Contoh: Mengenal Teks Deskripsi & Menuliskan Ide Pokok Berbasis Cinta"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Catatan Kejadian / Keaktifan Siswa (Jurnal Kelas)
            </label>
            <input
              type="text"
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="Contoh: Diskusi kelompok berlangsung hangat, seluruh siswa saling menghargai pendapat."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Attendance Counter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Rekapitulasi:</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Hadir: {countHadir}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Izin: {countIzin}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Sakit: {countSakit}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Alpa: {countAlpa}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-32">NISN</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 w-16 text-center">L/P</th>
                <th className="py-3 px-4 w-72 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayStudents.length > 0 ? (
                displayStudents.map((std, idx) => {
                  const currentStatus = studentStatusMap[std.id]?.status || 'Hadir';
                  const currentNote = studentStatusMap[std.id]?.note || '';

                  return (
                    <tr key={std.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {std.nisn}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {std.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          std.gender === 'L' ? 'bg-sky-500/20 text-sky-300' : 'bg-pink-500/20 text-pink-300'
                        }`}>
                          {std.gender}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Hadir')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              currentStatus === 'Hadir'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            H
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Izin')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              currentStatus === 'Izin'
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Sakit')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              currentStatus === 'Sakit'
                                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            S
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Alpa')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              currentStatus === 'Alpa'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            A
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) => handleNoteChange(std.id, e.target.value)}
                          placeholder="Catatan..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                    Tidak ada data siswa ditemukan untuk kelas {selectedClass}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
