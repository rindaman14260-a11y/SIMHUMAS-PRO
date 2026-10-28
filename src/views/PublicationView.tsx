import React, { useState } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Plus, 
  Copy, 
  Share2, 
  ExternalLink, 
  CheckCircle, 
  Trash2,
  Calendar,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react';
import { HumasPublication, SchoolIdentity, User } from '../types';
import Swal from 'sweetalert2';

interface PublicationViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  publications: HumasPublication[];
  onSavePublication: (pub: HumasPublication) => void;
  onDeletePublication: (pubId: string) => void;
}

export const PublicationView: React.FC<PublicationViewProps> = ({
  schoolIdentity,
  currentUser,
  publications,
  onSavePublication,
  onDeletePublication
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HumasPublication['category']>('Berita');
  const [targetPlatform, setTargetPlatform] = useState<HumasPublication['targetPlatform']>('Instagram');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(currentUser.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPub: HumasPublication = {
      id: `pub_${Date.now()}`,
      title: title.trim(),
      category,
      targetPlatform,
      content: content.trim(),
      publishDate: new Date().toISOString().split('T')[0],
      author,
      status: 'terbit'
    };

    onSavePublication(newPub);
    setShowAddModal(false);
    setTitle('');
    setContent('');

    Swal.fire({
      title: 'Publikasi Disimpan',
      text: 'Konten publikasi humas telah diterbitkan ke arsip.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    });
  };

  const handleGenerateAiCaption = async () => {
    if (!title.trim()) {
      Swal.fire({
        title: 'Tuliskan Topik / Judul Kegiatan',
        text: 'Harap isi kolom Judul / Topik Berita terlebih dahulu agar AI dapat menyusun caption yang relevan.',
        icon: 'info',
        confirmButtonColor: '#047857'
      });
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/assist-humas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'social_caption',
          inputPrompt: `Buatkan caption ${targetPlatform} yang ramah, santun, bernuansa edukasi Islam dan penuh semangat untuk kegiatan: "${title}". Tambahkan hashtag resmi SD Islam Imama Semarang.`,
          schoolIdentity
        })
      });
      const data = await res.json();
      if (data.result) {
        setContent(data.result);
        Swal.fire({
          title: 'Caption AI Siap!',
          text: 'Caption media sosial bernuansa Islami telah disusun otomatis oleh AI Humas.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (e) {
      setContent(
        `Alhamdulillah, telah terlaksana kegiatan "${title}" di ${schoolIdentity.namaSekolah}. Semoga membawa keberkahan dan memupuk karakter generasi sholeh-sholehah.\n\n#SDIslamImama #SekolahIslamSemarang #MijenSemarang #EdukasiIslam`
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: 'Teks Disalin',
      text: 'Caption siap ditempel (paste) ke Instagram / Facebook / Website!',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-emerald-700" />
            <span>Publikasi Humas & Manajemen Media Sosial</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pusat rilis berita sekolah, siaran pers, dan generator caption Instagram/FB {schoolIdentity.namaSekolah}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Rilis / Caption Baru</span>
        </button>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publications.map(pub => (
          <div key={pub.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {pub.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  {pub.targetPlatform === 'Instagram' && <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                  {pub.targetPlatform === 'Facebook' && <Facebook className="w-3.5 h-3.5 text-blue-600" />}
                  {pub.targetPlatform === 'Website' && <Globe className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{pub.targetPlatform}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{pub.title}</h3>

              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed">
                {pub.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">{pub.publishDate} • Oleh: {pub.author}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyContent(pub.content)}
                  title="Salin Caption"
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeletePublication(pub.id)}
                  title="Hapus"
                  className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Buat Publikasi / Caption Media</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Judul / Topik Berita Kegiatan</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Gebyar Muharram & Santunan Yatim SD Islam Imama"
                  className="w-full p-2 border rounded bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori Konten</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border rounded bg-slate-50"
                  >
                    <option value="Berita">Berita / Liputan</option>
                    <option value="Siaran Pers">Siaran Pers Resmi</option>
                    <option value="Media Sosial">Media Sosial / Caption</option>
                    <option value="Pengumuman">Pengumuman Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Kanal Publikasi</label>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value as any)}
                    className="w-full p-2 border rounded bg-slate-50"
                  >
                    <option value="Instagram">Instagram (@sdislamimama)</option>
                    <option value="Facebook">Facebook SD Islam Imama</option>
                    <option value="Website">Website Resmi Sekolah</option>
                    <option value="Semua Platform">Semua Platform</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold">Isi Berita / Caption Lengkap</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiCaption}
                    disabled={isGeneratingAi}
                    className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{isGeneratingAi ? 'Menyusun via AI...' : 'Tulis Otomatis via AI Humas'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis narasi berita atau klik tombol 'Tulis Otomatis via AI Humas' di atas..."
                  className="w-full p-2 border rounded bg-slate-50 leading-relaxed font-sans"
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
                  Simpan Publikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
