export type UserRole = 
  | 'super_admin' 
  | 'admin_humas' 
  | 'kepala_sekolah' 
  | 'petugas_humas' 
  | 'guru_staf' 
  | 'tamu';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  nip?: string;
  position: string; // e.g. "Kepala Sekolah", "Koordinator Humas", "Resepsionis"
  avatar?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface SchoolIdentity {
  namaSekolah: string;
  npsn: string;
  status: string;
  akreditasi: string;
  alamat: string;
  rtRw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaHumas: string;
  nipHumas: string;
  tahunBerdiri: string;
  logoUrl?: string;
  stempelUrl?: string;
  tandaTanganKepalaUrl?: string;
}

export type GuestCategory = 
  | 'Wali Murid' 
  | 'Calon Wali Murid' 
  | 'Instansi Pemerintah' 
  | 'Mitra Kerja Sama' 
  | 'Peneliti / Akademisi' 
  | 'Alumni' 
  | 'Tamu Umum' 
  | 'Lainnya';

export type GuestPurpose = 
  | 'Konsultasi Akademik / Kesiswaan' 
  | 'Administrasi & Keuangan' 
  | 'Kunjungan Kerja / Kedinasan' 
  | 'Kerja Sama / Audiensi' 
  | 'Liputan / Media' 
  | 'Pengantaran Dokumen / Surat' 
  | 'Lainnya';

export type VisitStatus = 'menunggu' | 'berkunjung' | 'selesai' | 'dibatalkan';

export interface GuestVisit {
  id: string;
  registrationNumber: string; // e.g. "TM-202610-001"
  fullName: string;
  institution: string; // Asal Instansi / Pekerjaan
  phone: string;
  category: GuestCategory;
  purpose: GuestPurpose;
  personToMeet: string; // e.g. "Kepala Sekolah", "Humas", "Wali Kelas 3A"
  partySize: number; // Jumlah rombongan
  detailNeed: string;
  additionalNotes?: string;
  visitDate: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm
  checkOutTime?: string; // HH:mm
  durationMinutes?: number;
  status: VisitStatus;
  qrVerificationToken: string;
  identityCardNumber?: string;
}

export type LetterType = 
  | 'undangan'
  | 'pemberitahuan'
  | 'tugas'
  | 'izin'
  | 'permohonan'
  | 'keterangan'
  | 'rekomendasi'
  | 'pengantar'
  | 'edaran'
  | 'balasan'
  | 'kerjasama'
  | 'panggilan'
  | 'berita_acara';

export type LetterTemplateType = LetterType;

export type LetterStatus = 
  | 'draf' 
  | 'menunggu_persetujuan' 
  | 'perlu_revisi' 
  | 'revisi'
  | 'disetujui' 
  | 'ditolak' 
  | 'terbit'
  | 'diterbitkan';

export interface OfficialLetter {
  id: string;
  letterNumber: string; // e.g. "421.2/085/SDI-IMAMA/X/2026"
  templateType: LetterType;
  title: string;
  regarding?: string; // Perihal
  subject?: string; // Alias for regarding
  attachmentCount?: string; // Lampiran, e.g. "1 Berkas" or "-"
  attachment?: string; // Alias for attachmentCount
  recipientName: string;
  recipientInstitution?: string;
  recipientAddress: string;
  letterDate: string; // Tanggal surat
  openingGreeting?: string; // e.g. "Assalamu'alaikum Warahmatullahi Wabarakatuh"
  bodyParagraphs?: string[];
  closingGreeting?: string; // e.g. "Wassalamu'alaikum Warahmatullahi Wabarakatuh"
  content?: {
    greeting?: string;
    opening?: string;
    bodyDetail?: string;
    closing?: string;
    closingGreeting?: string;
  };
  signerName?: string;
  signerPosition?: string;
  signerNip?: string;
  signer?: {
    name: string;
    position: string;
    nip?: string;
  };
  carbonCopy?: string[]; // Tembusan
  status: LetterStatus;
  approvalNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  isSignedElectronically?: boolean;
  qrVerificationToken: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
}

export interface DispositionItem {
  id: string;
  targetUserId?: string;
  targetUserName?: string;
  assignedTo?: string;
  instruction: string; // e.g. "Tindak lanjuti & buat laporan", "Hadir mewakili", dll.
  deadline: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'menunggu' | 'diproses' | 'selesai';
  notes?: string;
  createdAt?: string;
}

export interface IncomingLetter {
  id: string;
  agendaNumber: string; // e.g. "SM-2026-042"
  originNumber?: string;
  sourceLetterNumber?: string;
  sourceDate?: string;
  letterDate?: string;
  receivedDate: string;
  senderAgency?: string;
  sender?: string;
  regarding?: string;
  subject?: string;
  priority: 'Biasa' | 'Penting' | 'Segera' | 'Sangat Segera' | 'Sangat Rahasia' | 'Rahasia' | string;
  category?: string;
  attachmentFileName?: string;
  attachmentUrl?: string;
  summaryNotes?: string;
  description?: string;
  dispositions?: DispositionItem[];
  status: 'Baru' | 'Didisposisi' | 'Selesai' | 'diterima' | 'didisposisi' | 'selesai' | string;
  createdAt?: string;
}

export interface DigitalArchiveItem {
  id: string;
  title: string;
  documentNumber: string;
  category: 'Surat Keluar' | 'Surat Masuk' | 'MoU / Kerjasama' | 'Laporan Humas' | 'Dokumentasi' | 'SOP' | string;
  fileType: 'PDF' | 'DOCX' | 'JPG' | 'SCAN' | string;
  uploadDate: string;
  academicYear?: string;
  tags?: string[];
  notes?: string;
  downloadUrl?: string;
}

export interface HumasAgenda {
  id: string;
  title: string;
  date?: string;
  eventDate?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  pic?: string;
  personInCharge?: string;
  participants?: string;
  description: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai' | 'Dibatalkan' | 'akan_datang' | 'selesai' | string;
  documentationNotes?: string;
}

export interface PublicServiceTicket {
  id: string;
  ticketNumber: string; // e.g. "TIK-2026-001" or "LYN-202610-001"
  applicantName: string;
  applicantPhone?: string;
  phone?: string;
  applicantRole?: 'Wali Murid' | 'Masyarakat Umum' | 'Alumni' | 'Lembaga Mitra' | string;
  serviceType: 'Surat Keterangan Aktif' | 'Legalisir Dokumen' | 'Surat Rekomendasi Beasiswa' | 'Surat Pindah / Mutasi' | 'Permohonan Surat Keterangan' | 'Permintaan Informasi Sekolah' | 'Janji Temu Kepala Sekolah' | 'Konsultasi Kehumasan' | 'Lainnya' | string;
  studentName?: string;
  studentClass?: string;
  detailNeed?: string;
  description?: string;
  requestDate?: string;
  status: 'Menunggu Verifikasi' | 'Sedang Diproses' | 'Selesai' | 'Ditolak' | 'diajukan' | 'diproses' | 'siap_diambil' | 'selesai' | string;
  officerNotes?: string;
  assignedOfficerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CitizenComplaint {
  id: string;
  ticketNumber: string; // e.g. "ADU-2026-001" or "ASP-202610-001"
  complainantName?: string;
  reporterName?: string; // Can be anonymous or masked
  phone?: string;
  reporterPhone?: string;
  category: 'Pelayanan' | 'Sarana Prasarana' | 'Kesiswaan & Disiplin' | 'Akademik & Pembelajaran' | 'Keuangan' | 'Pelayanan Administrasi' | 'Sarana & Prasarana' | 'Keamanan & Ketertiban' | 'Kemitraan' | 'Lainnya' | string;
  title?: string;
  subject?: string;
  description: string;
  priority?: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat' | string;
  dateReported?: string;
  status: 'Baru' | 'Investigasi' | 'Tindak Lanjut' | 'Selesai' | 'menunggu' | 'diproses' | 'selesai' | string;
  response?: string;
  officerResponse?: string;
  respondedBy?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SchoolPartner {
  id: string;
  partnerName: string;
  category?: 'Instansi Kesehatan' | 'Kepolisian & Keamanan' | 'Perbankan & Keuangan' | 'Pondok Pesantren' | 'Perguruan Tinggi' | 'Dunia Usaha' | 'Komunitas' | string;
  agencyType?: 'Pemerintah' | 'Lembaga Pendidikan' | 'BUMN / Perusahaan' | 'Organisasi Sosial' | 'Komunitas' | string;
  address?: string;
  contactPerson?: string;
  picName?: string;
  phone?: string;
  picPhone?: string;
  email?: string;
  scopeOfWork?: string;
  cooperationField?: string; // Bidang kerja sama
  startDate: string;
  endDate: string;
  mouNumber?: string;
  status: 'Aktif' | 'Kedaluwarsa' | 'Dalam Pembahasan' | 'aktif' | 'kedaluwarsa' | string;
  notes?: string;
}

export interface HumasPublication {
  id: string;
  title: string;
  category: 'Berita' | 'Siaran Pers' | 'Media Sosial' | 'Pengumuman' | string;
  targetPlatform: 'Instagram' | 'Facebook' | 'Website' | 'Semua Platform' | string;
  content: string;
  publishDate: string;
  author: string;
  status: 'draf' | 'terbit' | string;
  imageUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
  isRead: boolean;
  linkView?: string;
}
