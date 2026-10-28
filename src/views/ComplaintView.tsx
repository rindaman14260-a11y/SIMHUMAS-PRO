import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  Send, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { CitizenComplaint, SchoolIdentity, User } from '../types';
import Swal from 'sweetalert2';

interface ComplaintViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  complaints: CitizenComplaint[];
  onSaveComplaint: (complaint: CitizenComplaint) => void;
}

export const ComplaintView: React.FC<ComplaintViewProps> = ({
  schoolIdentity,
  currentUser,
  complaints,
  onSaveComplaint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [officialResponse, setOfficialResponse] = useState('');

  // Form for new complaint
  const [complainantName, setComplainantName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<CitizenComplaint['category']>('Pelayanan');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const filtered = complaints.filter(c => 
    c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seq = Math.floor(100 + Math.random() * 900);
    const tktNo = `ASP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${seq}`;

    const newComplaint: CitizenComplaint = {
      id: `cmp_${Date.now()}`,
      ticketNumber: tktNo,
      complainantName: complainantName.trim() || 'Anonim / Wali Murid',
      phone: phone.trim() || '-',
      category,
      title: title.trim(),
      description: description.trim(),
      dateReported: new Date().toISOString().split('T')[0],
      status: 'menunggu',
      createdAt: new Date().toISOString()
    };

    onSaveComplaint(newComplaint);
    setShowAddModal(false);
    setComplainantName('');
    setPhone('');
    setTitle('');
    setDescription('');

    Swal.fire({
      title: 'Aspirasi / Pengaduan Diterima',
      text: `Nomor Tiket: ${newComplaint.ticketNumber}. Terima kasih atas kepedulian Anda demi kemajuan SD Islam Imama.`,
      icon: 'success',
      confirmButtonColor: '#047857'
    });
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const updated: CitizenComplaint = {
      ...selectedComplaint,
      status: 'selesai',
      response: officialResponse.trim(),
      respondedBy: `${currentUser.name} (${currentUser.position})`
    };

    onSaveComplaint(updated);
    setSelectedComplaint(null);
    setOfficialResponse('');

    Swal.fire({
      title: 'Tanggapan Resmi Terkirim',
      text: 'Tanggapan resmi telah dicatat dan status tiket ditandai Selesai.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-600" />
            <span>Kanal Pengaduan & Aspirasi Masyarakat / Wali Murid</span>
          </h1>
          <p className="text-xs text-slate-500">
            Layanan penampungan saran, masukan, dan pengaduan untuk perbaikan berkelanjutan {schoolIdentity.namaSekolah}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Sampaikan Aspirasi / Aduan</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor tiket, nama pelapor, judul aspirasi, atau kategori..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            Tidak ada data pengaduan yang cocok.
          </div>
        ) : (
          filtered.map(cmp => (
            <div key={cmp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {cmp.ticketNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{cmp.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                  cmp.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                  cmp.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {cmp.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{cmp.description}"
              </p>

              <div className="text-[11px] text-slate-500 flex flex-wrap justify-between gap-y-1">
                <span>Pelapor: <strong className="text-slate-800">{cmp.complainantName}</strong> ({cmp.phone})</span>
                <span>Kategori: <strong className="text-amber-800">{cmp.category}</strong></span>
                <span>Tgl: {cmp.dateReported}</span>
              </div>

              {cmp.response ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tanggapan Resmi ({cmp.respondedBy}):</span>
                  </div>
                  <p className="text-slate-700 italic">{cmp.response}</p>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedComplaint(cmp);
                      setOfficialResponse('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Beri Tanggapan Resmi</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Form Pengaduan & Aspirasi</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    placeholder="Nama pelapor..."
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full p-2 border rounded bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori Masukan / Aduan</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border rounded bg-slate-50"
                >
                  <option value="Pelayanan">Pelayanan & Komunikasi Sekolah</option>
                  <option value="Sarana Prasarana">Sarana & Prasarana</option>
                  <option value="Kesiswaan & Disiplin">Kesiswaan & Kedisiplinan</option>
                  <option value="Akademik & Pembelajaran">Akademik & Pembelajaran</option>
                  <option value="Keuangan">Administrasi Keuangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Judul Pokok Pengaduan</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Masukan perbaikan parkir penjemputan siswa"
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Rincian Lengkap Masukan / Aduan</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sampaikan masukan Anda dengan bahasa yang santun..."
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
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded font-bold"
                >
                  Kirim Pengaduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">Beri Tanggapan Resmi Humas</h3>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400">✕</button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border text-slate-700">
              <div className="font-bold">{selectedComplaint.title}</div>
              <div className="text-[11px] text-slate-500 mt-1">"{selectedComplaint.description}"</div>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Tanggapan / Klarifikasi Pihak Sekolah:</label>
                <textarea
                  rows={4}
                  required
                  value={officialResponse}
                  onChange={(e) => setOfficialResponse(e.target.value)}
                  placeholder="Tuliskan jawaban santun dan tindak lanjut konkret dari sekolah..."
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3 py-1.5 bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded font-bold"
                >
                  Simpan & Kirim Tanggapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
