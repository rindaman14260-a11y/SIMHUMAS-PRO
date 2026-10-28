import React, { useState } from 'react';
import { 
  Inbox, 
  Plus, 
  Search, 
  Eye, 
  Printer, 
  FileText, 
  CheckCircle, 
  Clock, 
  Send, 
  UserCheck, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { IncomingLetter, DispositionItem, SchoolIdentity, User } from '../types';
import { printElementById } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface IncomingLetterViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  incomingLetters: IncomingLetter[];
  onSaveIncomingLetter: (letter: IncomingLetter) => void;
  onDeleteIncomingLetter: (letterId: string) => void;
}

export const IncomingLetterView: React.FC<IncomingLetterViewProps> = ({
  schoolIdentity,
  currentUser,
  incomingLetters,
  onSaveIncomingLetter,
  onDeleteIncomingLetter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);
  const [showDispositionModal, setShowDispositionModal] = useState(false);

  // Form for new Incoming Letter
  const [originNumber, setOriginNumber] = useState('');
  const [senderAgency, setSenderAgency] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<IncomingLetter['priority']>('Penting');
  const [description, setDescription] = useState('');

  // Form for adding disposition
  const [dispTo, setDispTo] = useState('Koordinator Humas (Lutfi Maulana, S.Pd.)');
  const [dispInstruction, setDispInstruction] = useState('Tindak lanjuti & laporkan');
  const [dispNotes, setDispNotes] = useState('');
  const [dispDeadline, setDispDeadline] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);

  const filtered = incomingLetters.filter(l => 
    l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.senderAgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.agendaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.originNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateIncoming = (e: React.FormEvent) => {
    e.preventDefault();
    const seq = Math.floor(100 + Math.random() * 900);
    const agmNo = `AGM-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${seq}`;

    const newLetter: IncomingLetter = {
      id: `in_${Date.now()}`,
      agendaNumber: agmNo,
      originNumber: originNumber.trim(),
      senderAgency: senderAgency.trim(),
      letterDate,
      receivedDate,
      subject: subject.trim(),
      priority,
      status: 'diterima',
      dispositions: [],
      createdAt: new Date().toISOString()
    };

    onSaveIncomingLetter(newLetter);
    setShowAddModal(false);
    // Reset form
    setOriginNumber('');
    setSenderAgency('');
    setSubject('');
    setDescription('');

    Swal.fire({
      title: 'Surat Masuk Dicatat',
      text: `Surat nomor agenda ${newLetter.agendaNumber} berhasil didaftarkan ke buku agenda.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleAddDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLetter) return;

    const newDisp: DispositionItem = {
      id: `disp_${Date.now()}`,
      assignedTo: dispTo,
      instruction: dispInstruction,
      notes: dispNotes.trim(),
      deadline: dispDeadline,
      status: 'menunggu',
      createdAt: new Date().toISOString()
    };

    const updatedLetter: IncomingLetter = {
      ...selectedLetter,
      status: 'didisposisi',
      dispositions: [...(selectedLetter.dispositions || []), newDisp]
    };

    onSaveIncomingLetter(updatedLetter);
    setSelectedLetter(updatedLetter);
    setShowDispositionModal(false);
    setDispNotes('');

    Swal.fire({
      title: 'Disposisi Ditambahkan',
      text: `Instruksi disposisi diteruskan kepada: ${dispTo}`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleUpdateDispStatus = (dispId: string, newStatus: DispositionItem['status']) => {
    if (!selectedLetter) return;
    const updatedDisps = (selectedLetter.dispositions || []).map(d => 
      d.id === dispId ? { ...d, status: newStatus } : d
    );
    const allDone = updatedDisps.every(d => d.status === 'selesai');
    const updatedLetter: IncomingLetter = {
      ...selectedLetter,
      status: allDone ? 'selesai' : 'didisposisi',
      dispositions: updatedDisps
    };
    onSaveIncomingLetter(updatedLetter);
    setSelectedLetter(updatedLetter);
  };

  const handleDelete = (letter: IncomingLetter) => {
    Swal.fire({
      title: 'Hapus Surat Masuk?',
      text: `Hapus arsip surat masuk nomor agenda ${letter.agendaNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Hapus'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteIncomingLetter(letter.id);
        if (selectedLetter?.id === letter.id) setSelectedLetter(null);
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-700" />
            <span>Manajemen Surat Masuk & Lembar Disposisi</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan surat dinas masuk, penerbitan lembar disposisi Kepala Sekolah, dan pemantauan tindak lanjut staf
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Surat Masuk Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor agenda, nomor surat asal, instansi pengirim, perihal..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">No. Agenda</th>
                <th className="py-3 px-4">Pengirim & Asal Surat</th>
                <th className="py-3 px-4">Perihal</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Sifat / Urgensi</th>
                <th className="py-3 px-4">Disposisi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada surat masuk yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map(letter => (
                  <tr key={letter.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {letter.agendaNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{letter.senderAgency}</div>
                      <div className="text-[11px] text-slate-500 font-mono">No: {letter.originNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {letter.subject}
                    </td>
                    <td className="py-3 px-4">
                      <div>{letter.receivedDate}</div>
                      <div className="text-[10px] text-slate-400">Surat: {letter.letterDate}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        letter.priority === 'Sangat Segera' || letter.priority === 'Rahasia'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : letter.priority === 'Segera' || letter.priority === 'Penting'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {letter.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {letter.dispositions && letter.dispositions.length > 0 ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-emerald-700">
                            {letter.dispositions.length} Disposisi
                          </span>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {letter.dispositions[0].assignedTo}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belum didisposisi</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedLetter(letter)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Disposisi</span>
                        </button>
                        <button
                          onClick={() => handleDelete(letter)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Incoming Letter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Catat Surat Masuk Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateIncoming} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instansi / Pengirim Surat</label>
                <input
                  type="text"
                  required
                  value={senderAgency}
                  onChange={(e) => setSenderAgency(e.target.value)}
                  placeholder="Contoh: Dinas Pendidikan Kota Semarang / Puskesmas Mijen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Surat Asal</label>
                  <input
                    type="text"
                    required
                    value={originNumber}
                    onChange={(e) => setOriginNumber(e.target.value)}
                    placeholder="Contoh: 421/1102/X/2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sifat Urgensi</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Segera">Segera</option>
                    <option value="Sangat Segera">Sangat Segera</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Surat Asal</label>
                  <input
                    type="date"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Diterima Sekolah</label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perihal Surat</label>
                <textarea
                  rows={2}
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ringkasan perihal isi surat masuk..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold"
                >
                  Simpan Surat Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disposition Detail & Print Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {selectedLetter.agendaNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Lembar Disposisi Kepala Sekolah
                </h3>
              </div>
              <button onClick={() => setSelectedLetter(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Printable Disposition Sheet */}
            <div className="flex-1 overflow-y-auto space-y-4">
              <div id="printable-disposition-sheet" className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs font-serif">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-2 text-center font-sans">
                  <div className="text-[10px] font-bold uppercase tracking-widest">
                    YAYASAN PENDIDIKAN ISLAM IMAMA
                  </div>
                  <div className="text-sm font-extrabold uppercase">
                    {schoolIdentity.namaSekolah} SEMARANG
                  </div>
                  <div className="text-[9px] text-slate-600">
                    LEMBAR DISPOSISI KEPALA SEKOLAH
                  </div>
                </div>

                {/* Letter Metadata */}
                <div className="grid grid-cols-2 gap-2 font-sans text-[11px] bg-white p-3 rounded border border-slate-200">
                  <div>
                    <div>No. Agenda: <strong>{selectedLetter.agendaNumber}</strong></div>
                    <div>Pengirim: <strong>{selectedLetter.senderAgency}</strong></div>
                    <div>No. Surat Asal: <span className="font-mono">{selectedLetter.originNumber}</span></div>
                  </div>
                  <div>
                    <div>Tgl. Surat: {selectedLetter.letterDate}</div>
                    <div>Tgl. Diterima: {selectedLetter.receivedDate}</div>
                    <div>Sifat: <strong className="text-rose-700">{selectedLetter.priority}</strong></div>
                  </div>
                </div>

                <div className="font-sans text-[11px] bg-white p-3 rounded border border-slate-200">
                  <span className="text-slate-500 font-semibold">Perihal:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedLetter.subject}</div>
                </div>

                {/* Disposition List */}
                <div className="font-sans space-y-2">
                  <div className="font-bold text-slate-800 uppercase text-[11px] flex items-center justify-between">
                    <span>Instruksi Disposisi Kepala Sekolah:</span>
                    <button
                      onClick={() => setShowDispositionModal(true)}
                      className="px-2.5 py-1 rounded bg-blue-700 text-white text-[10px] font-bold"
                    >
                      + Tambah Instruksi Disposisi
                    </button>
                  </div>

                  {(!selectedLetter.dispositions || selectedLetter.dispositions.length === 0) ? (
                    <div className="p-4 bg-white rounded border border-dashed border-slate-300 text-center text-slate-400 italic">
                      Surat belum didisposisikan oleh Kepala Sekolah. Klik tombol "+ Tambah Instruksi Disposisi" di atas.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedLetter.dispositions.map(disp => (
                        <div key={disp.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-900 text-xs">
                              Diteruskan Kepada: {disp.assignedTo}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              disp.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {disp.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-xs">
                            <span className="font-semibold text-slate-700">Instruksi: </span>
                            <span className="text-slate-900 font-medium">{disp.instruction}</span>
                          </div>

                          {disp.notes && (
                            <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded">
                              "{disp.notes}"
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                            <span>Batas Waktu Tindak Lanjut: <strong>{disp.deadline}</strong></span>
                            <div className="flex items-center gap-1.5">
                              {disp.status !== 'selesai' && (
                                <button
                                  onClick={() => handleUpdateDispStatus(disp.id, 'selesai')}
                                  className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold"
                                >
                                  Tandai Selesai
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Signer */}
                <div className="pt-4 font-sans text-right">
                  <div className="text-[11px]">Semarang, {selectedLetter.receivedDate}</div>
                  <div className="text-[11px] font-bold">Kepala SD Islam Imama,</div>
                  <div className="h-12 flex items-center justify-end">
                    <span className="text-[9px] text-purple-800 border border-dashed border-purple-300 px-2 py-0.5 rounded bg-purple-50">
                      [ Lembar Disposisi Elektronik ]
                    </span>
                  </div>
                  <div className="text-[11px] font-bold underline">{schoolIdentity.namaKepalaSekolah}</div>
                  <div className="text-[9px] text-slate-600">NIP. {schoolIdentity.nipKepalaSekolah}</div>
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => printElementById('printable-disposition-sheet')}
                className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Disposisi</span>
              </button>
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sub-disposition Dialog */}
      {showDispositionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-3 text-xs">
            <h4 className="font-bold text-sm text-slate-900">Tambah Instruksi Disposisi</h4>
            <form onSubmit={handleAddDisposition} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Diteruskan Kepada (Staf/Guru)</label>
                <select
                  value={dispTo}
                  onChange={(e) => setDispTo(e.target.value)}
                  className="w-full p-2 border rounded bg-slate-50"
                >
                  <option value="Koordinator Humas (Lutfi Maulana, S.Pd.)">Koordinator Humas (Lutfi Maulana, S.Pd.)</option>
                  <option value="Waka Kurikulum & Guru Mapel">Waka Kurikulum & Guru Mapel</option>
                  <option value="Waka Kesiswaan & Guru BK">Waka Kesiswaan & Guru BK</option>
                  <option value="Bendahara Sekolah">Bendahara Sekolah</option>
                  <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                  <option value="Seluruh Guru & Karyawan">Seluruh Guru & Karyawan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Instruksi Pokok</label>
                <select
                  value={dispInstruction}
                  onChange={(e) => setDispInstruction(e.target.value)}
                  className="w-full p-2 border rounded bg-slate-50"
                >
                  <option value="Tindak lanjuti & laporkan">Tindak lanjuti & laporkan</option>
                  <option value="Hadir / Wakili pada kegiatan">Hadir / Wakili pada kegiatan</option>
                  <option value="Pelajari berkas & koordinasikan">Pelajari berkas & koordinasikan</option>
                  <option value="Siapkan jawaban / balasan surat">Siapkan jawaban / balasan surat</option>
                  <option value="Arsipkan & monitor berkala">Arsipkan & monitor berkala</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Tambahan Kepala Sekolah</label>
                <textarea
                  rows={2}
                  value={dispNotes}
                  onChange={(e) => setDispNotes(e.target.value)}
                  placeholder="Catatan khusus atau penekanan..."
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Batas Waktu (Deadline)</label>
                <input
                  type="date"
                  value={dispDeadline}
                  onChange={(e) => setDispDeadline(e.target.value)}
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispositionModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-700 text-white rounded font-bold"
                >
                  Simpan Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
