import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  UserCheck, 
  Building2, 
  Phone, 
  Send, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Copy, 
  RotateCcw,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { GuestVisit, GuestCategory, GuestPurpose, SchoolIdentity } from '../types';
import { generateQrDataUrl, printElementById } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface PublicGuestBookViewProps {
  schoolIdentity: SchoolIdentity;
  onRegisterVisit: (visit: GuestVisit) => void;
  onNavigateToManagement?: () => void;
}

export const PublicGuestBookView: React.FC<PublicGuestBookViewProps> = ({
  schoolIdentity,
  onRegisterVisit,
  onNavigateToManagement
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<GuestCategory>('Wali Murid');
  const [purpose, setPurpose] = useState<GuestPurpose>('Konsultasi Akademik / Kesiswaan');
  const [personToMeet, setPersonToMeet] = useState('Koordinator Humas (Lutfi Maulana, S.Pd.)');
  const [partySize, setPartySize] = useState<number>(1);
  const [detailNeed, setDetailNeed] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Result state after submission
  const [submittedVisit, setSubmittedVisit] = useState<GuestVisit | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [receptionPosterQr, setReceptionPosterQr] = useState<string>('');

  // Generate the Receptionist QR code for scanning
  useEffect(() => {
    const appUrl = window.location.href;
    generateQrDataUrl(appUrl, 250).then(url => {
      setReceptionPosterQr(url);
    });
  }, []);

  // When submittedVisit changes, generate QR for the visitor's pass
  useEffect(() => {
    if (submittedVisit) {
      const verifyData = JSON.stringify({
        school: 'SD Islam Imama',
        regNo: submittedVisit.registrationNumber,
        name: submittedVisit.fullName,
        date: submittedVisit.visitDate,
        time: submittedVisit.checkInTime,
        token: submittedVisit.qrVerificationToken
      });
      generateQrDataUrl(verifyData, 220).then(url => {
        setQrCodeDataUrl(url);
      });
    }
  }, [submittedVisit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !institution.trim()) {
      Swal.fire({
        title: 'Mohon Lengkapi Data',
        text: 'Nama lengkap dan instansi/alamat wajib diisi.',
        icon: 'warning',
        confirmButtonColor: '#047857'
      });
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const seq = Math.floor(100 + Math.random() * 900);
    const regNo = `TM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
    const token = `IMAMA-VISIT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${seq}`;

    const newVisit: GuestVisit = {
      id: `vis_${Date.now()}`,
      registrationNumber: regNo,
      fullName: fullName.trim(),
      institution: institution.trim(),
      phone: phone.trim() || '-',
      category,
      purpose,
      personToMeet,
      partySize: Number(partySize) || 1,
      detailNeed: detailNeed.trim() || 'Kunjungan dan koordinasi langsung.',
      additionalNotes: additionalNotes.trim(),
      visitDate: dateStr,
      checkInTime: timeStr,
      status: 'berkunjung',
      qrVerificationToken: token
    };

    onRegisterVisit(newVisit);
    setSubmittedVisit(newVisit);

    Swal.fire({
      title: 'Registrasi Berhasil!',
      text: `Ahlan Wa Sahlan, ${newVisit.fullName}. Kartu Tamu Digital Anda telah diterbitkan.`,
      icon: 'success',
      confirmButtonColor: '#047857',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleResetForm = () => {
    setSubmittedVisit(null);
    setFullName('');
    setInstitution('');
    setPhone('');
    setCategory('Wali Murid');
    setPurpose('Konsultasi Akademik / Kesiswaan');
    setPartySize(1);
    setDetailNeed('');
    setAdditionalNotes('');
  };

  const handlePrintBadge = () => {
    printElementById('digital-visitor-badge-print');
  };

  const handleCopyRegNo = () => {
    if (submittedVisit) {
      navigator.clipboard.writeText(submittedVisit.registrationNumber);
      Swal.fire({
        title: 'Tersalin!',
        text: `Nomor Registrasi: ${submittedVisit.registrationNumber}`,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Buku Tamu Digital Terpadu</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ahlan Wa Sahlan – Selamat Datang di {schoolIdentity.namaSekolah}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Silakan mengisi formulir kehadiran tamu berikut. Data Anda akan langsung terhubung ke sistem resepsionis dan dashboard pimpinan sekolah.
        </p>
      </div>

      {submittedVisit ? (
        /* Result Screen: Digital Visitor Badge & QR Pass */
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl p-6 sm:p-8 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Kartu Tanda Tamu Digital</h2>
            <p className="text-xs text-slate-500">Tunjukkan kartu ini kepada resepsionis atau petugas keamanan</p>
          </div>

          {/* Printable Badge Box */}
          <div 
            id="digital-visitor-badge-print" 
            className="border-2 border-dashed border-emerald-400 rounded-2xl p-6 bg-gradient-to-b from-emerald-50/60 to-white text-center space-y-4"
          >
            {/* Header Badge */}
            <div className="border-b border-emerald-200 pb-3">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                KARTU TANDA PENGUNJUNG / GUEST PASS
              </div>
              <div className="text-base font-extrabold text-emerald-950">
                {schoolIdentity.namaSekolah}
              </div>
              <div className="text-[10px] text-slate-500">
                {schoolIdentity.alamat}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center py-2">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code Tamu" 
                  className="w-40 h-40 rounded-xl p-2 bg-white border border-emerald-200 shadow-md"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-xl" />
              )}
              <div className="mt-2 font-mono text-xs font-bold text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
                {submittedVisit.registrationNumber}
              </div>
            </div>

            {/* Visitor Details */}
            <div className="bg-white rounded-xl p-4 border border-emerald-100 text-left text-xs space-y-2 shadow-inner">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{submittedVisit.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Instansi / Alamat:</span>
                <span className="font-semibold text-slate-800">{submittedVisit.institution}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Kategori & Rombongan:</span>
                <span className="font-semibold text-emerald-700">
                  {submittedVisit.category} ({submittedVisit.partySize} Orang)
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Keperluan:</span>
                <span className="font-medium text-slate-800">{submittedVisit.purpose}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Bertemu Dengan:</span>
                <span className="font-medium text-slate-800">{submittedVisit.personToMeet}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500">Waktu Masuk:</span>
                <span className="font-bold text-emerald-800">
                  {submittedVisit.visitDate} • {submittedVisit.checkInTime} WIB
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400">
              Token Keamanan: <span className="font-mono">{submittedVisit.qrVerificationToken}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrintBadge}
              className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu Tamu</span>
            </button>
            <button
              onClick={handleCopyRegNo}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Salin No. Registrasi</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleResetForm}
              className="text-xs text-emerald-700 hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Input Tamu Baru Lainnya</span>
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form & Lobby QR Poster */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Formulir Pendaftaran Kunjungan Tamu</span>
              </h2>
              <p className="text-xs text-slate-500">Lengkapi data berikut dengan benar untuk kenyamanan dan keamanan pelayanan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Tamu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Drs. H. Bambang Hartono, M.Si."
                    required
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Institution / Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi / Alamat / Wali Murid dari <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Contoh: Wali Murid Ahmad (Kelas 3A) / Dinas Pendidikan"
                    required
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. HP / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Tamu
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GuestCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Wali Murid">Wali Murid</option>
                    <option value="Calon Wali Murid">Calon Wali Murid (PPDB)</option>
                    <option value="Instansi Pemerintah">Instansi Pemerintah (Dinas/Kecamatan)</option>
                    <option value="Mitra Kerja Sama">Mitra Kerja Sama (Puskesmas/Bank/dll)</option>
                    <option value="Peneliti / Akademisi">Peneliti / Akademisi / Mahasiswa</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Tamu Umum">Tamu Umum</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Party Size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Orang (Rombongan)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Purpose */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maksud / Tujuan Kunjungan
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as GuestPurpose)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Konsultasi Akademik / Kesiswaan">Konsultasi Akademik / Kesiswaan</option>
                    <option value="Administrasi & Keuangan">Administrasi & Keuangan</option>
                    <option value="Kunjungan Kerja / Kedinasan">Kunjungan Kerja / Kedinasan</option>
                    <option value="Kerja Sama / Audiensi">Kerja Sama / Audiensi</option>
                    <option value="Liputan / Media">Liputan / Publikasi / Media</option>
                    <option value="Pengantaran Dokumen / Surat">Pengantaran Dokumen / Surat</option>
                    <option value="Lainnya">Keperluan Lainnya</option>
                  </select>
                </div>

                {/* Person to meet */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bertemu Dengan (Tujuan)
                  </label>
                  <select
                    value={personToMeet}
                    onChange={(e) => setPersonToMeet(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Kepala Sekolah (Muhammad Muzamil, S.Pd.)">Kepala Sekolah (Muhammad Muzamil, S.Pd.)</option>
                    <option value="Koordinator Humas (Lutfi Maulana, S.Pd.)">Koordinator Humas (Lutfi Maulana, S.Pd.)</option>
                    <option value="Wali Kelas & Guru BK">Wali Kelas / Guru BK</option>
                    <option value="Staff Tata Usaha (Administrasi & Surat)">Staff Tata Usaha (Administrasi)</option>
                    <option value="Bendahara Sekolah (Keuangan/SPP)">Bendahara Sekolah (Keuangan/SPP)</option>
                    <option value="Panitia PPDB (Pendaftaran Murid Baru)">Panitia PPDB (Pendaftaran)</option>
                    <option value="Lainnya">Pejabat / Guru Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Detail need */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rincian Keperluan / Catatan Kunjungan
                </label>
                <textarea
                  rows={2}
                  value={detailNeed}
                  onChange={(e) => setDetailNeed(e.target.value)}
                  placeholder="Jelaskan secara ringkas maksud kedatangan Anda..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-800/30 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Simpan Kehadiran & Terbitkan Kartu Tamu Digital</span>
              </button>
            </form>
          </div>

          {/* Right Column: Receptionist Lobby QR Poster (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl space-y-5 border border-emerald-700/50">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Lobby Resepsionis
              </span>
              <h3 className="text-base font-bold text-white">
                Scan QR Buku Tamu
              </h3>
              <p className="text-xs text-emerald-200">
                Pindai menggunakan kamera smartphone pengunjung untuk membuka form ini langsung di HP
              </p>
            </div>

            {/* QR Card */}
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-slate-900">
              {receptionPosterQr ? (
                <img 
                  src={receptionPosterQr} 
                  alt="QR Code Resepsionis" 
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-lg" />
              )}
              <div className="mt-2 text-center">
                <div className="text-xs font-extrabold text-emerald-900">
                  SD ISLAM IMAMA SEMARANG
                </div>
                <div className="text-[10px] text-slate-500">
                  Resepsionis & Layanan Tamu
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-emerald-200 space-y-2 pt-1">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                  1
                </div>
                <span>Buka aplikasi Kamera / QR Scanner di HP</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                  2
                </div>
                <span>Arahkan ke QR Code di atas</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                  3
                </div>
                <span>Isi form dan simpan Kartu Tamu Digital Anda</span>
              </div>
            </div>

            {onNavigateToManagement && (
              <div className="pt-2 border-t border-emerald-700/60">
                <button
                  type="button"
                  onClick={onNavigateToManagement}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Buka Monitoring Tamu Resepsionis</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
