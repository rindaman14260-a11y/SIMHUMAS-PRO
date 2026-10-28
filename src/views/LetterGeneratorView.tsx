import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Sparkles, 
  Printer, 
  Download, 
  Send, 
  Save, 
  Eye, 
  RotateCcw, 
  CheckCircle,
  FileText,
  BadgeCheck,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { OfficialLetter, LetterTemplateType, SchoolIdentity, User } from '../types';
import { LETTER_PRESETS, getPresetTemplate } from '../utils/presetTemplates';
import { generateLetterNumber, generateLetterHtml, renderKopSuratHtml } from '../utils/letterTemplates';
import { exportHtmlToWord, printHtmlContent, generateQrDataUrl } from '../utils/documentExport';
import Swal from 'sweetalert2';

interface LetterGeneratorViewProps {
  schoolIdentity: SchoolIdentity;
  currentUser: User;
  onSaveLetter: (letter: OfficialLetter) => void;
  onSubmitForApproval: (letter: OfficialLetter) => void;
  existingLetterToEdit?: OfficialLetter | null;
}

export const LetterGeneratorView: React.FC<LetterGeneratorViewProps> = ({
  schoolIdentity,
  currentUser,
  onSaveLetter,
  onSubmitForApproval,
  existingLetterToEdit
}) => {
  const [templateType, setTemplateType] = useState<LetterTemplateType>(
    existingLetterToEdit?.templateType || 'undangan'
  );
  const [letterNumber, setLetterNumber] = useState<string>(
    existingLetterToEdit?.letterNumber || generateLetterNumber(1, 'undangan')
  );
  const [title, setTitle] = useState(existingLetterToEdit?.title || '');
  const [letterDate, setLetterDate] = useState(
    existingLetterToEdit?.letterDate || new Date().toISOString().split('T')[0]
  );
  const [recipientName, setRecipientName] = useState(existingLetterToEdit?.recipientName || '');
  const [recipientAddress, setRecipientAddress] = useState(existingLetterToEdit?.recipientAddress || '');
  const [attachment, setAttachment] = useState(existingLetterToEdit?.attachment || '-');
  const [subject, setSubject] = useState(existingLetterToEdit?.subject || '');

  // Letter content sections
  const [greeting, setGreeting] = useState("Assalamu'alaikum Warahmatullahi Wabarakatuh,");
  const [opening, setOpening] = useState('');
  const [bodyDetail, setBodyDetail] = useState('');
  const [closing, setClosing] = useState('');
  const [closingGreeting, setClosingGreeting] = useState("Wassalamu'alaikum Warahmatullahi Wabarakatuh.");

  // Signer
  const [signerRole, setSignerRole] = useState<'kepala_sekolah' | 'humas'>('kepala_sekolah');

  // Preview & QR
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [currentLetterId, setCurrentLetterId] = useState<string>(
    existingLetterToEdit?.id || `ltr_${Date.now()}`
  );

  // Load preset defaults when templateType changes
  useEffect(() => {
    if (!existingLetterToEdit) {
      const preset = getPresetTemplate(templateType);
      setTitle(preset.title);
      setSubject(preset.subject);
      setOpening(preset.opening);
      setBodyDetail(preset.bodyDetail);
      setClosing(preset.closing);
      setRecipientName(preset.defaultRecipient);
      setRecipientAddress(preset.defaultAddress);
      setLetterNumber(generateLetterNumber(Math.floor(80 + Math.random() * 20), templateType));
    }
  }, [templateType, existingLetterToEdit]);

  // Generate QR code token
  useEffect(() => {
    const token = `IMAMA-VERIFY-LTR-${currentLetterId.replace('ltr_', '')}`;
    const qrData = JSON.stringify({
      inst: 'SD Islam Imama',
      npsn: schoolIdentity.npsn,
      noSurat: letterNumber,
      hal: subject,
      tgl: letterDate,
      token
    });
    generateQrDataUrl(qrData, 160).then(url => {
      setQrCodeDataUrl(url);
    });
  }, [letterNumber, subject, letterDate, currentLetterId, schoolIdentity]);

  // Signer details
  const signerName = signerRole === 'kepala_sekolah' ? schoolIdentity.namaKepalaSekolah : schoolIdentity.namaHumas;
  const signerNip = signerRole === 'kepala_sekolah' ? schoolIdentity.nipKepalaSekolah : schoolIdentity.nipHumas;
  const signerPosition = signerRole === 'kepala_sekolah' ? 'Kepala SD Islam Imama' : 'Koordinator Humas';

  // Construct complete letter object
  const constructLetter = (status: OfficialLetter['status']): OfficialLetter => {
    const preset = getPresetTemplate(templateType);
    return {
      id: currentLetterId,
      letterNumber,
      templateType,
      title: title || preset.title,
      letterDate,
      recipientName,
      recipientAddress,
      attachment,
      subject,
      content: {
        greeting,
        opening,
        bodyDetail,
        closing,
        closingGreeting
      },
      signer: {
        name: signerName,
        nip: signerNip,
        position: signerPosition
      },
      status,
      qrVerificationToken: `IMAMA-VERIFY-LTR-${currentLetterId.replace('ltr_', '')}`,
      createdAt: existingLetterToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSaveDraft = () => {
    const letter = constructLetter('draf');
    onSaveLetter(letter);
    Swal.fire({
      title: 'Draf Disimpan',
      text: 'Surat resmi berhasil disimpan ke arsip draf.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    });
  };

  const handleSubmitApproval = () => {
    const letter = constructLetter('menunggu_persetujuan');
    onSubmitForApproval(letter);
    Swal.fire({
      title: 'Diajukan ke Kepala Sekolah',
      text: 'Surat telah dikirim ke alur persetujuan Kepala Sekolah.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false
    });
  };

  const handleGenerateAiEnhancement = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/gemini/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterType: templateType,
          subject,
          recipient: recipientName,
          keyPoints: bodyDetail,
          schoolIdentity
        })
      });

      const data = await response.json();
      if (data.opening) setOpening(data.opening);
      if (data.bodyDetail) setBodyDetail(data.bodyDetail);
      if (data.closing) setClosing(data.closing);

      Swal.fire({
        title: 'Bahasa Surat Diperhalus!',
        text: 'AI Humas telah menyempurnakan redaksi surat resmi menjadi formal, santun, dan sesuai standar bahasa dinas Islam.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Info AI',
        text: 'Format template lokal tetap dapat digunakan secara lengkap.',
        icon: 'info',
        confirmButtonColor: '#047857'
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleExportWord = () => {
    const letter = constructLetter('draf');
    const fullHtml = generateLetterHtml(letter, schoolIdentity, qrCodeDataUrl);
    exportHtmlToWord(fullHtml, `${letter.title.replace(/\s+/g, '_')}_${letter.letterNumber.replace(/\//g, '-')}`);
  };

  const handlePrint = () => {
    const letter = constructLetter('draf');
    const fullHtml = generateLetterHtml(letter, schoolIdentity, qrCodeDataUrl);
    printHtmlContent(fullHtml);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-emerald-700" />
            <span>Smart Letter Generator SD Islam Imama</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pembuatan surat dinas otomatis dengan format Kop resmi, nomor surat kedinasan, dan QR Code verifikasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateAiEnhancement}
            disabled={isGeneratingAi}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGeneratingAi ? 'Menulis via AI...' : 'Perhalus Redaksi AI'}</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Draf</span>
          </button>

          <button
            onClick={handleSubmitApproval}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            <span>Ajukan Persetujuan</span>
          </button>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Word (.doc)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Surat</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Controls (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Pengaturan & Rincian Surat
            </h2>
          </div>

          {/* Preset Selector (13 Types) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Jenis Template Resmi (13 Pilihan)
            </label>
            <select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value as LetterTemplateType)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium outline-none"
            >
              {LETTER_PRESETS.map(p => (
                <option key={p.type} value={p.type}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Letter Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Surat Resmi
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={letterNumber}
                  onChange={(e) => setLetterNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLetterNumber(generateLetterNumber(Math.floor(100 + Math.random() * 800), templateType))}
                  title="Generate Nomor Baru"
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Letter Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Surat
              </label>
              <input
                type="date"
                value={letterDate}
                onChange={(e) => setLetterDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Perihal (Hal)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Perihal surat..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lampiran
              </label>
              <input
                type="text"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                placeholder="Contoh: 1 (Satu) Berkas / -"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kepada Yth. (Nama Penerima)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Contoh: Bapak/Ibu Wali Murid Kelas 1-6"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Recipient Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Di (Tempat / Alamat)
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Contoh: Tempat / Semarang"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Paragraph Opening */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paragraf Pembuka
            </label>
            <textarea
              rows={3}
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Body / Detail Event */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Isi Utama / Rincian Acara / Keterangan
            </label>
            <textarea
              rows={4}
              value={bodyDetail}
              onChange={(e) => setBodyDetail(e.target.value)}
              placeholder="Isi rincian kegiatan, jadwal, atau muatan surat..."
              className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Paragraph Closing */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paragraf Penutup
            </label>
            <textarea
              rows={2}
              value={closing}
              onChange={(e) => setClosing(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Signer Selection */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pejabat Penandatangan Surat
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSignerRole('kepala_sekolah')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  signerRole === 'kepala_sekolah'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Kepala Sekolah</div>
                <div className="text-[10px] text-slate-600">{schoolIdentity.namaKepalaSekolah}</div>
              </button>

              <button
                type="button"
                onClick={() => setSignerRole('humas')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  signerRole === 'humas'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Koordinator Humas</div>
                <div className="text-[10px] text-slate-600">{schoolIdentity.namaHumas}</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Letter Preview (6 cols) */}
        <div className="lg:col-span-6 bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-inner">
          <div className="flex items-center justify-between pb-2 text-xs text-slate-600 font-semibold">
            <span>Pratinjau Kertas A4 Kedinasan</span>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-300">
              KOP Resmi SD Islam Imama
            </span>
          </div>

          {/* Simulated A4 Paper */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-slate-900 font-serif text-[11px] leading-relaxed space-y-4 min-h-[750px]">
            {/* Kop Surat */}
            <div className="border-b-[3px] border-double border-slate-900 pb-3 text-center space-y-0.5">
              <div className="text-[11px] font-bold tracking-widest uppercase">
                YAYASAN PENDIDIKAN ISLAM IMAMA
              </div>
              <div className="text-[15px] font-extrabold tracking-wide uppercase text-slate-900">
                {schoolIdentity.namaSekolah} SEMARANG
              </div>
              <div className="text-[9px] font-semibold text-slate-700">
                NPSN: {schoolIdentity.npsn} • STATUS: {schoolIdentity.status.toUpperCase()} • TERAKREDITASI: {schoolIdentity.akreditasi}
              </div>
              <div className="text-[8.5px] text-slate-600">
                {schoolIdentity.alamat}, {schoolIdentity.kodePos}
              </div>
              <div className="text-[8.5px] text-slate-600">
                Telp: {schoolIdentity.telepon} • Email: {schoolIdentity.email} • Website: {schoolIdentity.website}
              </div>
            </div>

            {/* Letter Metadata */}
            <div className="flex justify-between items-start pt-2 font-sans text-[10px]">
              <div className="space-y-0.5">
                <div>Nomor : <span className="font-mono font-bold">{letterNumber}</span></div>
                <div>Lamp. : <span>{attachment}</span></div>
                <div>Hal : <span className="font-bold underline">{subject}</span></div>
              </div>
              <div className="text-right">
                <div>Semarang, {letterDate}</div>
              </div>
            </div>

            {/* Recipient */}
            <div className="pt-2 font-sans text-[10px]">
              <div>Kepada Yth.</div>
              <div className="font-bold">{recipientName}</div>
              <div>Di {recipientAddress}</div>
            </div>

            {/* Greetings & Opening */}
            <div className="pt-2 space-y-2 text-justify">
              <div className="italic font-medium">{greeting}</div>
              <p>{opening}</p>
            </div>

            {/* Body Detail */}
            <div className="py-1 px-4 bg-slate-50/60 rounded border border-slate-100 font-sans text-[10px] whitespace-pre-line leading-relaxed">
              {bodyDetail}
            </div>

            {/* Closing */}
            <div className="space-y-2 text-justify">
              <p>{closing}</p>
              <div className="italic font-medium">{closingGreeting}</div>
            </div>

            {/* Signature Block (Strict 2-Column Parallel Layout with QR) */}
            <div className="pt-4 font-sans text-[10px]">
              <table className="w-full border-none" style={{ border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '45%', verticalAlign: 'top', border: 'none' }}>
                      <div className="text-[9px] text-slate-500">
                        Verifikasi Keabsahan Dokumen:
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {qrCodeDataUrl ? (
                          <img 
                            src={qrCodeDataUrl} 
                            alt="QR Seal" 
                            className="w-16 h-16 border border-slate-300 p-0.5 rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100" />
                        )}
                        <div className="text-[8px] text-slate-500 leading-tight">
                          <div className="font-bold text-emerald-800">SIMHUMAS PRO</div>
                          <div>SD Islam Imama</div>
                          <div className="font-mono text-[7px]">{currentLetterId}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ width: '10%', border: 'none' }}></td>

                    <td style={{ width: '45%', textAlign: 'center', verticalAlign: 'top', border: 'none' }}>
                      <div>Semarang, {letterDate}</div>
                      <div className="font-bold">{signerPosition}</div>
                      <div className="h-14 flex items-center justify-center">
                        <span className="text-[9px] text-emerald-700 font-semibold border border-dashed border-emerald-300 px-2 py-0.5 rounded bg-emerald-50">
                          [ Tanda Tangan Elektronik ]
                        </span>
                      </div>
                      <div className="font-bold underline text-[10.5px]">{signerName}</div>
                      <div className="text-[9px] text-slate-600">NIP. {signerNip}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
