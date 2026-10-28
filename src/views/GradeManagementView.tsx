import React, { useState } from 'react';
import { 
  Award, 
  Save, 
  Download, 
  Sparkles, 
  Calculator,
  Search,
  CheckCircle2
} from 'lucide-react';
import { ClassRoom, Student, GradeRecord, StudentGrade, User, SchoolConfig } from '../types';
import Swal from 'sweetalert2';

interface GradeManagementViewProps {
  currentUser: User;
  schoolConfig: SchoolConfig;
  classes: ClassRoom[];
  students: Student[];
  grades: GradeRecord[];
  onSaveGrade: (gradeRecord: GradeRecord) => void;
}

export const GradeManagementView: React.FC<GradeManagementViewProps> = ({
  currentUser,
  schoolConfig,
  classes,
  students,
  grades,
  onSaveGrade
}) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'VII-A');
  const [subject, setSubject] = useState(currentUser.subject || 'Bahasa Indonesia');
  const [tpCode, setTpCode] = useState('TP 7.1');
  const [tpDescription, setTpDescription] = useState('Memahami ide pokok dan informasi faktual dalam teks deskripsi kontekstual.');
  const [searchQuery, setSearchQuery] = useState('');

  // Class students
  const classStudents = students.filter(s => s.className === selectedClass);

  // Existing record
  const existingRecord = grades.find(
    g => g.className === selectedClass && g.subject === subject && g.tpCode === tpCode
  );

  // Helper to compute NA, Predicate & Description
  const computeFinal = (f1 = 80, f2 = 80, f3 = 80, lm1 = 80, lm2 = 80, sas = 80) => {
    const avgF = (f1 + f2 + f3) / 3;
    const avgLM = (lm1 + lm2) / 2;
    // Formula Kurikulum Merdeka: 40% Formatif + 30% Sumatif LM + 30% SAS
    const finalScore = Math.round((avgF * 0.4) + (avgLM * 0.3) + (sas * 0.3));
    let predicate: 'A' | 'B' | 'C' | 'D' = 'C';
    let description = '';

    if (finalScore >= 90) {
      predicate = 'A';
      description = `Menunjukkan penguasaan sangat tinggi dalam ${tpDescription.toLowerCase()}`;
    } else if (finalScore >= 80) {
      predicate = 'B';
      description = `Menguasai dengan baik kompetensi dalam ${tpDescription.toLowerCase()}`;
    } else if (finalScore >= 70) {
      predicate = 'C';
      description = `Cukup menguasai kompetensi, perlu sedikit penguatan pada pemecahan masalah.`;
    } else {
      predicate = 'D';
      description = `Perlu bimbingan intensif dan remidial terstruktur pada kompetensi dasar.`;
    }

    return { finalScore, predicate, description };
  };

  // State of student grades
  const [gradeRows, setGradeRows] = useState<Record<string, StudentGrade>>(() => {
    const map: Record<string, StudentGrade> = {};
    classStudents.forEach(s => {
      const match = existingRecord?.studentGrades.find(item => item.studentId === s.id);
      if (match) {
        map[s.id] = match;
      } else {
        const computed = computeFinal(82, 85, 84, 86, 88, 85);
        map[s.id] = {
          studentId: s.id,
          studentName: s.name,
          formatif1: 82,
          formatif2: 85,
          formatif3: 84,
          sumatifLM1: 86,
          sumatifLM2: 88,
          sumatifSAS: 85,
          ...computed
        };
      }
    });
    return map;
  });

  const handleScoreChange = (
    studentId: string, 
    field: keyof StudentGrade, 
    val: number
  ) => {
    setGradeRows(prev => {
      const current = prev[studentId] || {
        studentId,
        studentName: '',
        finalScore: 0,
        predicate: 'C',
        description: ''
      };

      const next = { ...current, [field]: Math.max(0, Math.min(100, val)) };
      const computed = computeFinal(
        next.formatif1 ?? 80,
        next.formatif2 ?? 80,
        next.formatif3 ?? 80,
        next.sumatifLM1 ?? 80,
        next.sumatifLM2 ?? 80,
        next.sumatifSAS ?? 80
      );

      return {
        ...prev,
        [studentId]: {
          ...next,
          ...computed
        }
      };
    });
  };

  const handleSave = () => {
    const studentGrades = classStudents.map(s => {
      return gradeRows[s.id] || {
        studentId: s.id,
        studentName: s.name,
        finalScore: 80,
        predicate: 'B',
        description: 'Tuntas'
      };
    });

    const record: GradeRecord = {
      id: existingRecord?.id || `grd_${Date.now()}`,
      className: selectedClass,
      subject,
      tpCode,
      tpDescription,
      teacherId: currentUser.id,
      academicYear: schoolConfig.tahunPelajaran,
      semester: schoolConfig.semesterAktif,
      studentGrades
    };

    onSaveGrade(record);

    Swal.fire({
      title: 'Nilai & Asesmen Tersimpan!',
      text: `Nilai ${tpCode} untuk kelas ${selectedClass} berhasil dikalkulasi dan disimpan.`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false
    });
  };

  const handleExportCsv = () => {
    const headers = ['No,NISN,Nama Siswa,Kelas,Formatif 1,Formatif 2,Formatif 3,Sumatif LM1,Sumatif LM2,SAS,Nilai Akhir,Predikat,Deskripsi Capaian\n'];
    const rows = classStudents.map((s, idx) => {
      const g = gradeRows[s.id];
      return `${idx + 1},"${s.nisn}","${s.name}","${selectedClass}",${g?.formatif1 || 0},${g?.formatif2 || 0},${g?.formatif3 || 0},${g?.sumatifLM1 || 0},${g?.sumatifLM2 || 0},${g?.sumatifSAS || 0},${g?.finalScore || 0},"${g?.predicate || 'C'}","${g?.description?.replace(/"/g, '""') || ''}"\n`;
    });

    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nilai_${selectedClass}_${subject}_${tpCode}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      title: 'Ekspor Berhasil!',
      text: 'File CSV nilai asesmen berhasil diunduh.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const displayStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Pengelolaan Nilai & Asesmen Kurikulum Merdeka</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Input nilai Formatif, Sumatif Lingkup Materi, dan SAS per Tujuan Pembelajaran dengan perhitungan otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Ekspor CSV / Excel</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Nilai Asesmen</span>
          </button>
        </div>
      </div>

      {/* Filter & TP Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                const nextStudents = students.filter(s => s.className === e.target.value);
                const newMap: Record<string, StudentGrade> = {};
                nextStudents.forEach(s => {
                  const computed = computeFinal(82, 85, 84, 86, 88, 85);
                  newMap[s.id] = {
                    studentId: s.id,
                    studentName: s.name,
                    formatif1: 82, formatif2: 85, formatif3: 84,
                    sumatifLM1: 86, sumatifLM2: 88, sumatifSAS: 85,
                    ...computed
                  };
                });
                setGradeRows(newMap);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.name}>Kelas {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Kode TP (Tujuan Pembelajaran)</label>
            <input
              type="text"
              value={tpCode}
              onChange={(e) => setTpCode(e.target.value)}
              placeholder="Contoh: TP 7.1"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Formula Nilai Akhir (NA)</label>
            <div className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-xl font-mono">
              40% F + 30% LM + 30% SAS
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Deskripsi Tujuan Pembelajaran (Sebagai Acuan Deskripsi Capaian Rapor)
          </label>
          <input
            type="text"
            value={tpDescription}
            onChange={(e) => setTpDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Grade Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-400" />
            <span>Tabel Nilai Asesmen: <strong>Kelas {selectedClass}</strong> • <strong>{subject}</strong> ({classStudents.length} Siswa)</span>
          </div>

          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 uppercase font-bold text-[11px] text-slate-400 border-b border-slate-800 text-center">
              <tr>
                <th className="py-2.5 px-3 w-10" rowSpan={2}>No</th>
                <th className="py-2.5 px-3 text-left w-48" rowSpan={2}>Nama Siswa</th>
                <th className="py-2 px-2 bg-indigo-950/30 text-indigo-300 border-b border-indigo-900/50" colSpan={3}>
                  Asesmen Formatif (40%)
                </th>
                <th className="py-2 px-2 bg-emerald-950/30 text-emerald-300 border-b border-emerald-900/50" colSpan={2}>
                  Sumatif LM (30%)
                </th>
                <th className="py-2 px-2 bg-amber-950/30 text-amber-300 border-b border-amber-900/50">
                  SAS (30%)
                </th>
                <th className="py-2.5 px-3 w-16 bg-purple-950/50 text-purple-300" rowSpan={2}>Nilai Akhir</th>
                <th className="py-2.5 px-3 w-12 bg-purple-950/50 text-purple-300" rowSpan={2}>Predikat</th>
                <th className="py-2.5 px-3 text-left min-w-[240px]" rowSpan={2}>Deskripsi Capaian Rapor</th>
              </tr>
              <tr className="text-[10px] text-slate-400">
                <th className="py-1 px-1 bg-indigo-950/20 w-14">F1</th>
                <th className="py-1 px-1 bg-indigo-950/20 w-14">F2</th>
                <th className="py-1 px-1 bg-indigo-950/20 w-14">F3</th>
                <th className="py-1 px-1 bg-emerald-950/20 w-14">LM1</th>
                <th className="py-1 px-1 bg-emerald-950/20 w-14">LM2</th>
                <th className="py-1 px-1 bg-amber-950/20 w-14">SAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayStudents.length > 0 ? (
                displayStudents.map((std, idx) => {
                  const g = gradeRows[std.id] || {
                    studentId: std.id,
                    studentName: std.name,
                    finalScore: 80,
                    predicate: 'B',
                    description: ''
                  };

                  return (
                    <tr key={std.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-2 px-3 text-center text-slate-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-semibold text-white">
                        {std.name}
                      </td>
                      <td className="py-2 px-1 text-center bg-indigo-950/10">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.formatif1 ?? 80}
                          onChange={(e) => handleScoreChange(std.id, 'formatif1', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-950 border border-slate-700 rounded py-1 font-mono text-xs text-indigo-300"
                        />
                      </td>
                      <td className="py-2 px-1 text-center bg-indigo-950/10">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.formatif2 ?? 80}
                          onChange={(e) => handleScoreChange(std.id, 'formatif2', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-950 border border-slate-700 rounded py-1 font-mono text-xs text-indigo-300"
                        />
                      </td>
                      <td className="py-2 px-1 text-center bg-indigo-950/10">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.formatif3 ?? 80}
                          onChange={(e) => handleScoreChange(std.id, 'formatif3', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-950 border border-slate-700 rounded py-1 font-mono text-xs text-indigo-300"
                        />
                      </td>
                      <td className="py-2 px-1 text-center bg-emerald-950/10">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.sumatifLM1 ?? 80}
                          onChange={(e) => handleScoreChange(std.id, 'sumatifLM1', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-950 border border-slate-700 rounded py-1 font-mono text-xs text-emerald-300"
                        />
                      </td>
                      <td className="py-2 px-1 text-center bg-emerald-950/10">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.sumatifLM2 ?? 80}
                          onChange={(e) => handleScoreChange(std.id, 'sumatifLM2', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-950 border border-slate-700 rounded py-1 font-mono text-xs text-emerald-300"
                        />
                      </td>
                      <td className="py-2 px-1 text-center bg-amber-950/10">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.sumatifSAS ?? 80}
                          onChange={(e) => handleScoreChange(std.id, 'sumatifSAS', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-950 border border-slate-700 rounded py-1 font-mono text-xs text-amber-300"
                        />
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-sm text-purple-300 bg-purple-950/20 font-mono">
                        {g.finalScore}
                      </td>
                      <td className="py-2 px-3 text-center font-bold bg-purple-950/20">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          g.predicate === 'A' ? 'bg-emerald-500/20 text-emerald-300' :
                          g.predicate === 'B' ? 'bg-sky-500/20 text-sky-300' :
                          g.predicate === 'C' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {g.predicate}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 text-[11px] leading-tight">
                        {g.description}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-slate-500">
                    Tidak ada siswa di kelas {selectedClass}.
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
