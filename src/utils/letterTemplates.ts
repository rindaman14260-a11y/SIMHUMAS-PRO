import { SchoolIdentity, OfficialLetter, LetterType } from '../types';

export function getRomanMonth(monthIndex = new Date().getMonth()): string {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return roman[monthIndex] || 'X';
}

export function generateLetterNumber(
  param1: number | OfficialLetter[] = 1,
  type: LetterType = 'undangan',
  customYear = new Date().getFullYear(),
  customMonth = new Date().getMonth()
): string {
  const year = customYear;
  const roman = getRomanMonth(customMonth);
  const prefixMap: Record<string, string> = {
    undangan: '421.2',
    pemberitahuan: '421.1',
    tugas: '090',
    izin: '421.3',
    permohonan: '421.4',
    keterangan: '421.5',
    rekomendasi: '421.6',
    pengantar: '045',
    edaran: '421.7',
    balasan: '421.8',
    kerjasama: 'MoU',
    panggilan: '421.9',
    berita_acara: 'BA'
  };

  const prefix = prefixMap[type] || '421.2';
  let seqNumber = 1;

  if (Array.isArray(param1)) {
    seqNumber = param1.filter(l => l.letterNumber && l.letterNumber.includes(year.toString())).length + 1;
  } else if (typeof param1 === 'number') {
    seqNumber = param1;
  }

  const seq = seqNumber.toString().padStart(3, '0');
  return `${prefix}/${seq}/SDI-IMAMA/${roman}/${year}`;
}

export function generateOfficialKopHtml(identity: SchoolIdentity): string {
  return `
    <div style="text-align: center; margin-bottom: 4px; font-family: 'Times New Roman', serif;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #064e3b;">
        YAYASAN PENDIDIKAN ISLAM IMAMA SEMARANG
      </div>
      <div style="font-size: 16pt; font-weight: 800; text-transform: uppercase; margin-top: 2px; color: #047857; letter-spacing: 0.5px;">
        ${identity.namaSekolah}
      </div>
      <div style="font-size: 9.5pt; font-weight: bold; color: #1f2937;">
        NPSN: ${identity.npsn} &bull; STATUS: ${identity.status.toUpperCase()} &bull; TERAKREDITASI "${identity.akreditasi}"
      </div>
      <div style="font-size: 9pt; margin-top: 3px; color: #374151;">
        ${identity.alamat}, ${identity.kota}, ${identity.provinsi} ${identity.kodePos}
      </div>
      <div style="font-size: 8.5pt; color: #4b5563; margin-top: 1px;">
        Telepon: ${identity.telepon} &bull; Email: ${identity.email} &bull; Website: ${identity.website}
      </div>
    </div>
    <div class="official-kop-divider" style="border-top: 2.5px solid #000; border-bottom: 1px solid #000; height: 3px; margin-top: 8px; margin-bottom: 20px;"></div>
  `;
}

// Alias
export const renderKopSuratHtml = generateOfficialKopHtml;

export function generateLetterHtml(
  letter: any,
  identity: SchoolIdentity,
  qrDataUrl?: string
): string {
  const kop = generateOfficialKopHtml(identity);
  const isApproved = letter.status === 'disetujui' || letter.status === 'terbit' || letter.status === 'diterbitkan';

  // Support both bodyParagraphs array and content object
  let bodyHtml = '';
  if (Array.isArray(letter.bodyParagraphs) && letter.bodyParagraphs.length > 0) {
    bodyHtml = letter.bodyParagraphs
      .map((p: string) => {
        if (p.includes('\n')) {
          return `<div style="margin-left: 15px; margin-top: 6px; margin-bottom: 8px; white-space: pre-line; line-height: 1.5; font-family: sans-serif; font-size: 10pt;">${p}</div>`;
        }
        return `<p style="text-align: justify; text-indent: 28px; margin: 8px 0; line-height: 1.5;">${p}</p>`;
      })
      .join('');
  } else if (letter.content) {
    const { opening, bodyDetail, closing } = letter.content;
    bodyHtml = `
      ${opening ? `<p style="text-align: justify; text-indent: 28px; margin: 8px 0; line-height: 1.5;">${opening}</p>` : ''}
      ${bodyDetail ? `<div style="margin: 8px 0 8px 15px; white-space: pre-line; line-height: 1.5; font-family: sans-serif; font-size: 10pt; background: #f9fafb; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb;">${bodyDetail}</div>` : ''}
      ${closing ? `<p style="text-align: justify; text-indent: 28px; margin: 8px 0; line-height: 1.5;">${closing}</p>` : ''}
    `;
  }

  // Greeting
  const greeting = letter.openingGreeting || letter.content?.greeting || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
  const closingGreeting = letter.closingGreeting || letter.content?.closingGreeting || "Wassalamu'alaikum Warahmatullahi Wabarakatuh";

  // Subject & Attachment
  const subject = letter.regarding || letter.subject || letter.title;
  const attachment = letter.attachmentCount || letter.attachment || '-';

  // Signer
  const signerName = letter.signer?.name || letter.signerName || identity.namaKepalaSekolah;
  const signerPosition = letter.signer?.position || letter.signerPosition || 'Kepala Sekolah';
  const signerNip = letter.signer?.nip || letter.signerNip || identity.nipKepalaSekolah;

  // QR Block
  const qrBlock = qrDataUrl
    ? `
      <div style="text-align: center; margin-top: 5px;">
        <img src="${qrDataUrl}" alt="QR Verifikasi Dokumen" style="width: 75px; height: 75px; margin: 0 auto; display: block; border: 1px solid #d1d5db; padding: 2px; border-radius: 4px;" />
        <div style="font-size: 7.5pt; color: #047857; font-weight: bold; margin-top: 3px; font-family: sans-serif;">
          Verifikasi Keaslian Dokumen
        </div>
        <div style="font-size: 7pt; color: #6b7280; font-family: monospace;">
          ${letter.qrVerificationToken || 'IMAMA-VERIFY-DOC'}
        </div>
      </div>
    `
    : '';

  // Signature Section (Strict 2-Column borderless parallel layout)
  const signatureSection = `
    <table class="signature-table" style="border: none !important; width: 100% !important; margin-top: 25px !important; margin-bottom: 10px !important;">
      <tbody>
        <tr style="border: none !important;">
          <td style="border: none !important; width: 50% !important; vertical-align: top !important; padding: 0 10px !important;">
            ${qrBlock}
          </td>
          <td style="border: none !important; width: 50% !important; text-align: left !important; vertical-align: top !important; padding: 0 10px !important;">
            <div>Semarang, ${letter.letterDate}</div>
            <div style="font-weight: bold;">${signerPosition} SD Islam Imama,</div>
            <div style="height: 55px; position: relative;">
              ${isApproved ? `
                <div style="position: absolute; top: 6px; left: 0; border: 1.5px solid #047857; color: #047857; padding: 3px 8px; font-size: 7.5pt; font-family: sans-serif; font-weight: bold; border-radius: 4px; background: rgba(236, 253, 245, 0.9);">
                  &#x2714; TERTANDA TANGAN ELEKTRONIK<br/>
                  <span style="font-size: 6.5pt; color: #064e3b; font-weight: normal;">Sistem SIMHUMAS IMAMA PRO</span>
                </div>
              ` : `
                <div style="position: absolute; top: 12px; left: 0; color: #9ca3af; font-size: 8pt; font-style: italic;">
                  [ Menunggu Persetujuan ]
                </div>
              `}
            </div>
            <div style="font-weight: bold; text-decoration: underline;">${signerName}</div>
            <div style="font-size: 10pt;">${signerNip ? `NIP. ${signerNip}` : 'NIY. 20010801'}</div>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="official-letter-page" style="font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; line-height: 1.4;">
      ${kop}
      
      <!-- Letter Header Metadata -->
      <table style="width: 100%; border: none !important; margin-bottom: 14px; font-size: 10.5pt; font-family: sans-serif;">
        <tr style="border: none !important;">
          <td style="border: none !important; width: 12%; font-weight: bold;">Nomor</td>
          <td style="border: none !important; width: 3%;">:</td>
          <td style="border: none !important; width: 45%; font-family: monospace; font-weight: bold;">${letter.letterNumber}</td>
          <td style="border: none !important; width: 40%; text-align: right;">Semarang, ${letter.letterDate}</td>
        </tr>
        <tr style="border: none !important;">
          <td style="border: none !important; font-weight: bold;">Lampiran</td>
          <td style="border: none !important;">:</td>
          <td style="border: none !important;" colspan="2">${attachment}</td>
        </tr>
        <tr style="border: none !important;">
          <td style="border: none !important; font-weight: bold;">Perihal</td>
          <td style="border: none !important;">:</td>
          <td style="border: none !important; font-weight: bold; text-decoration: underline;" colspan="2">${subject}</td>
        </tr>
      </table>

      <!-- Recipient Address -->
      <div style="margin-bottom: 14px; font-size: 10.5pt; font-family: sans-serif;">
        <div>Kepada Yth.</div>
        <div style="font-weight: bold;">${letter.recipientName}</div>
        ${letter.recipientAddress ? `<div>Di ${letter.recipientAddress}</div>` : '<div>Di Tempat</div>'}
      </div>

      <!-- Opening Greeting -->
      <div style="font-style: italic; margin-bottom: 6px;">
        ${greeting},
      </div>

      <!-- Paragraphs Body -->
      ${bodyHtml}

      <!-- Closing Greeting -->
      <div style="font-style: italic; margin-top: 10px; margin-bottom: 4px;">
        ${closingGreeting},
      </div>

      <!-- Signatures -->
      ${signatureSection}
    </div>
  `;
}
