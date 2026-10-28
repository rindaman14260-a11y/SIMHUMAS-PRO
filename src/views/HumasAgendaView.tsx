import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle, 
  Trash2 
} from 'lucide-react';
import { HumasAgenda, SchoolIdentity } from '../types';
import Swal from 'sweetalert2';

interface HumasAgendaViewProps {
  schoolIdentity: SchoolIdentity;
  agendas: HumasAgenda[];
  onSaveAgenda: (agenda: HumasAgenda) => void;
  onDeleteAgenda: (agendaId: string) => void;
}

export const HumasAgendaView: React.FC<HumasAgendaViewProps> = ({
  schoolIdentity,
  agendas,
  onSaveAgenda,
  onDeleteAgenda
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Agenda Form
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:30');
  const [location, setLocation] = useState('Aula Utama SD Islam Imama');
  const [pic, setPic] = useState('Lutfi Maulana, S.Pd.');
  const [description, setDescription] = useState('');

  const filtered = agendas.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.pic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgenda: HumasAgenda = {
      id: `agd_${Date.now()}`,
      title: title.trim(),
      eventDate,
      startTime,
      endTime,
      location: location.trim(),
      pic: pic.trim(),
      description: description.trim(),
      status: 'akan_datang'
    };

    onSaveAgenda(newAgenda);
    setShowAddModal(false);
    setTitle('');
    setDescription('');

    Swal.fire({
      title: 'Agenda Terjadwal',
      text: `Agenda "${newAgenda.title}" berhasil ditambahkan ke kalender humas.`,
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    });
  };

  const handleToggleStatus = (agenda: HumasAgenda) => {
    const nextStatus = agenda.status === 'akan_datang' ? 'selesai' : 'akan_datang';
    onSaveAgenda({ ...agenda, status: nextStatus });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-700" />
            <span>Kalender & Agenda Kegiatan Kehumasan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Penjadwalan audiensi dinas, rapat komite, sosialisasi, dan keprotokolan {schoolIdentity.namaSekolah}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Agenda</span>
        </button>
      </div>

      {/* Grid of Agendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {item.eventDate}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'selesai' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status === 'selesai' ? 'Selesai' : 'Akan Datang'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pukul {item.startTime} - {item.endTime} WIB</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>PIC: {item.pic}</span>
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-slate-600 italic">
                  "{item.description}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(item)}
                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{item.status === 'selesai' ? 'Tandai Belum Selesai' : 'Tandai Terlaksana'}</span>
              </button>

              <button
                onClick={() => onDeleteAgenda(item.id)}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Tambah Agenda Kehumasan</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Kegiatan / Agenda</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rapat Koordinasi Komite Sekolah & Persiapan Milad"
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ruang Rapat / Aula..."
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    required
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Keterangan Tambahan / Catatan Agenda</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Catatan persiapan atau perlengkapan..."
                  className="w-full p-2 border rounded bg-slate-50"
                />
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
