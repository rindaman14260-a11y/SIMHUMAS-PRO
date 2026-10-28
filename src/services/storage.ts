import { 
  User, 
  SchoolIdentity, 
  GuestVisit, 
  OfficialLetter, 
  IncomingLetter, 
  DigitalArchiveItem, 
  HumasAgenda, 
  PublicServiceTicket, 
  CitizenComplaint, 
  SchoolPartner, 
  HumasPublication, 
  SystemNotification 
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'simhumas_curr_user',
  USERS: 'simhumas_users',
  SCHOOL_IDENTITY: 'simhumas_school_identity',
  GUESTS: 'simhumas_guest_visits',
  OFFICIAL_LETTERS: 'simhumas_official_letters',
  INCOMING_LETTERS: 'simhumas_incoming_letters',
  ARCHIVES: 'simhumas_archives',
  AGENDAS: 'simhumas_agendas',
  PUBLIC_SERVICES: 'simhumas_public_services',
  COMPLAINTS: 'simhumas_complaints',
  PARTNERS: 'simhumas_partners',
  PUBLICATIONS: 'simhumas_publications',
  NOTIFICATIONS: 'simhumas_notifications'
};

export const DEFAULT_SCHOOL_IDENTITY: SchoolIdentity = {
  namaSekolah: 'SD ISLAM IMAMA',
  npsn: '20329252',
  status: 'Swasta',
  akreditasi: 'A',
  alamat: 'Jl. Dawung RT 08 / RW 05, Kelurahan Kedungpani, Kecamatan Mijen',
  rtRw: 'RT 08 / RW 05',
  kelurahan: 'Kedungpani',
  kecamatan: 'Mijen',
  kota: 'Kota Semarang',
  provinsi: 'Jawa Tengah',
  kodePos: '50211',
  telepon: '(024) 76631095',
  email: 'sdislamimama25@gmail.com',
  website: 'https://www.sdislamimama.sch.id/',
  namaKepalaSekolah: 'Muhammad Muzamil, S.Pd.',
  nipKepalaSekolah: '19820715 201001 1 012',
  namaHumas: 'Lutfi Maulana, S.Pd.',
  nipHumas: '19890412 201503 1 008',
  tahunBerdiri: '2001',
  logoUrl: '',
  stempelUrl: '',
  tandaTanganKepalaUrl: ''
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr_superadmin',
    username: 'superadmin',
    password: 'admin123',
    name: 'Super Administrator',
    role: 'super_admin',
    position: 'Kepala Pusat Data & Sistem Informasi',
    phone: '081223344550',
    email: 'admin.simhumas@sdislamimama.sch.id',
    isActive: true
  },
  {
    id: 'usr_admin_humas',
    username: 'humas',
    password: 'humas123',
    name: 'Lutfi Maulana, S.Pd.',
    role: 'admin_humas',
    nip: '19890412 201503 1 008',
    position: 'Koordinator Hubungan Masyarakat',
    phone: '081234567890',
    email: 'lutfi.humas@sdislamimama.sch.id',
    isActive: true
  },
  {
    id: 'usr_kepsek',
    username: 'kepsek',
    password: 'kepsek123',
    name: 'Muhammad Muzamil, S.Pd.',
    role: 'kepala_sekolah',
    nip: '19820715 201001 1 012',
    position: 'Kepala Sekolah SD Islam Imama',
    phone: '081398765432',
    email: 'kepsek@sdislamimama.sch.id',
    isActive: true
  },
  {
    id: 'usr_petugas_humas',
    username: 'petugas',
    password: 'petugas123',
    name: 'Siti Rahmawati, A.Md.',
    role: 'petugas_humas',
    position: 'Front Desk & Resepsionis Humas',
    phone: '085712345678',
    email: 'frontdesk@sdislamimama.sch.id',
    isActive: true
  },
  {
    id: 'usr_guru_staf',
    username: 'guru',
    password: 'guru123',
    name: 'Ahmad Syukron, S.Pd.I',
    role: 'guru_staf',
    position: 'Wali Kelas 5A & Pembina Keagamaan',
    phone: '081566778899',
    email: 'syukron@sdislamimama.sch.id',
    isActive: true
  }
];

export const DEFAULT_GUESTS: GuestVisit[] = [
  {
    id: 'vis_001',
    registrationNumber: 'TM-202610-001',
    fullName: 'Drs. H. Sugiyanto, M.Pd.',
    institution: 'Dinas Pendidikan Kota Semarang - Pengawas Wilayah Mijen',
    phone: '081234511223',
    category: 'Instansi Pemerintah',
    purpose: 'Koordinasi Lembaga',
    personToMeet: 'Kepala Sekolah (Muhammad Muzamil, S.Pd.)',
    partySize: 2,
    detailNeed: 'Monitoring evaluasi asesmen kesiapan Kurikulum & akreditasi berkala.',
    additionalNotes: 'Tamu VIP, diarahkan langsung ke ruang Kepala Sekolah.',
    visitDate: new Date().toISOString().split('T')[0],
    checkInTime: '08:30',
    checkOutTime: '10:15',
    durationMinutes: 105,
    status: 'selesai',
    qrVerificationToken: 'IMAMA-VISIT-7782A-001'
  },
  {
    id: 'vis_002',
    registrationNumber: 'TM-202610-002',
    fullName: 'dr. Anindita Rahmawati',
    institution: 'Puskesmas Kecamatan Mijen',
    phone: '081390123456',
    category: 'Mitra Kerja Sama',
    purpose: 'Kerja Sama / Audiensi',
    personToMeet: 'Koordinator Humas (Lutfi Maulana, S.Pd.)',
    partySize: 3,
    detailNeed: 'Penyusunan jadwal imunisasi berkala & skrining kesehatan gigi siswa kelas 1-3.',
    additionalNotes: 'Membawa berkas proposal program Bulan Imunisasi Anak Sekolah (BIAS).',
    visitDate: new Date().toISOString().split('T')[0],
    checkInTime: '09:15',
    checkOutTime: undefined,
    durationMinutes: undefined,
    status: 'berkunjung',
    qrVerificationToken: 'IMAMA-VISIT-9921B-002'
  },
  {
    id: 'vis_003',
    registrationNumber: 'TM-202610-003',
    fullName: 'H. Bambang Irawan, S.E.',
    institution: 'Wali Murid Ananda Fathir (Kelas 4B)',
    phone: '081298765412',
    category: 'Wali Murid',
    purpose: 'Konsultasi Akademik / Kesiswaan',
    personToMeet: 'Wali Kelas & Guru BK',
    partySize: 1,
    detailNeed: 'Konsultasi pembinaan program tahfidz Juz 30 dan kesiapan lomba tartil tingkat kota.',
    additionalNotes: 'Sangat kooperatif dan siap mendukung program sekolah.',
    visitDate: new Date().toISOString().split('T')[0],
    checkInTime: '10:00',
    checkOutTime: undefined,
    durationMinutes: undefined,
    status: 'berkunjung',
    qrVerificationToken: 'IMAMA-VISIT-3310C-003'
  },
  {
    id: 'vis_004',
    registrationNumber: 'TM-202610-004',
    fullName: 'Ibu Nabila Kusuma Dewi',
    institution: 'Calon Wali Murid (Warga Kedungpani)',
    phone: '085811223344',
    category: 'Calon Wali Murid',
    purpose: 'Administrasi & Keuangan',
    personToMeet: 'Petugas Humas / Panitia PPDB',
    partySize: 2,
    detailNeed: 'Informasi alur pendaftaran inden PPDB Tahun Pelajaran baru & rincian sarana tahfidz.',
    visitDate: new Date().toISOString().split('T')[0],
    checkInTime: '10:45',
    checkOutTime: undefined,
    durationMinutes: undefined,
    status: 'menunggu',
    qrVerificationToken: 'IMAMA-VISIT-1144D-004'
  }
];

export const DEFAULT_OFFICIAL_LETTERS: OfficialLetter[] = [
  {
    id: 'ltr_001',
    letterNumber: '421.2/085/SDI-IMAMA/X/2026',
    templateType: 'undangan',
    title: 'Surat Undangan Rapat Koordinasi Komite Sekolah & Persiapan Milad',
    regarding: 'Undangan Rapat Pleno Komite & Parenting Akbar',
    attachmentCount: '1 (satu) Lembar Jadwal',
    recipientName: 'Bapak/Ibu Pengurus Komite & Perwakilan Paguyuban Kelas',
    recipientAddress: 'Di Tempat',
    letterDate: '24 Oktober 2026',
    openingGreeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    bodyParagraphs: [
      'Segala puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT, yang telah melimpahkan rahmat, taufik, serta inayah-Nya kepada kita semua. Shalawat dan salam semoga senantiasa tercurah kepada junjungan kita Nabi Muhammad SAW, beserta keluarga, sahabat, dan umatnya yang istiqamah hingga akhir zaman.',
      'Sehubungan dengan agenda tahunan program sekolah serta pemantapan rangkaian kegiatan Milad dan Parenting Akbar Semester Ganjil Tahun Pelajaran 2026/2027, kami mengundang Bapak/Ibu untuk hadir pada rapat koordinasi yang insya Allah akan dilaksanakan pada:',
      'Hari/Tanggal : Sabtu, 31 Oktober 2026\nWaktu : Pukul 08.30 WIB - 11.30 WIB\nTempat : Aula Utama SD Islam Imama, Jl. Dawung RT 08/05 Kedungpani, Mijen\nAgenda : 1. Sosialisasi Rencana Milad Sekolah & Gelar Karya Siswa\n2. Pembahasan Program Penguatan Karakter Islami Bersama Orang Tua',
      'Mengingat sangat pentingnya musyawarah ini demi kemaslahatan pendidikan putra-putri kita, kehadiran dan sumbangsih pemikiran Bapak/Ibu sangat kami harapkan.'
    ],
    closingGreeting: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    signerName: 'Muhammad Muzamil, S.Pd.',
    signerPosition: 'Kepala Sekolah',
    signerNip: '19820715 201001 1 012',
    carbonCopy: [
      'Ketua Yayasan Pendidikan Islam Imama',
      'Arsip Bagian Hubungan Masyarakat'
    ],
    status: 'diterbitkan',
    isSignedElectronically: true,
    qrVerificationToken: 'IMAMA-VERIF-DOC-88912-2026',
    createdAt: '2026-10-24 09:30',
    createdBy: 'Lutfi Maulana, S.Pd.'
  },
  {
    id: 'ltr_002',
    letterNumber: '090/042/SDI-IMAMA/TUGAS/X/2026',
    templateType: 'tugas',
    title: 'Surat Tugas Pembimbingan Lomba MAPSI (Mata Pelajaran & Seni Islami)',
    regarding: 'Penugasan Pembimbing Lomba Tingkat Kecamatan Mijen',
    attachmentCount: '-',
    recipientName: 'Ahmad Syukron, S.Pd.I & Siti Fatimah, S.Pd.',
    recipientAddress: 'SD Islam Imama Semarang',
    letterDate: '26 Oktober 2026',
    openingGreeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    bodyParagraphs: [
      'Yang bertanda tangan di bawah ini Kepala SD Islam Imama Kecamatan Mijen Kota Semarang, memberikan tugas kedinasan kepada guru yang namanya tercantum di bawah ini:',
      '1. Nama : Ahmad Syukron, S.Pd.I (Pembimbing Cabang Tartil & Hifdzil Quran)\n2. Nama : Siti Fatimah, S.Pd. (Pembimbing Cabang Kaligrafi & Cerdas Cermat Islam)',
      'Untuk mendampingi dan membimbing kafilah delegasi SD Islam Imama pada ajang Lomba Mata Pelajaran dan Seni Islami (MAPSI) Ke-26 Tingkat Kecamatan Mijen.',
      'Demikian surat tugas ini diberikan agar dilaksanakan dengan penuh amanah, tanggung jawab, dan dedikasi tinggi.'
    ],
    closingGreeting: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    signerName: 'Muhammad Muzamil, S.Pd.',
    signerPosition: 'Kepala Sekolah',
    signerNip: '19820715 201001 1 012',
    status: 'menunggu_persetujuan',
    isSignedElectronically: false,
    qrVerificationToken: 'IMAMA-VERIF-DOC-09042-2026',
    createdAt: '2026-10-26 14:10',
    createdBy: 'Siti Rahmawati, A.Md.'
  }
];

export const DEFAULT_INCOMING_LETTERS: IncomingLetter[] = [
  {
    id: 'inc_001',
    agendaNumber: 'SM-2026-081',
    sourceLetterNumber: '420/1298/X/2026',
    sourceDate: '2026-10-22',
    receivedDate: '2026-10-23',
    sender: 'Dinas Pendidikan Kota Semarang',
    regarding: 'Undangan Workshop Implementasi Kurikulum & Tata Kelola Kehumasan Sekolah Berbasis Digital',
    priority: 'Penting',
    category: 'Undangan Dinas',
    attachmentFileName: 'Surat_Undangan_Workshop_Disdik.pdf',
    summaryNotes: 'Workshop diadakan pada Rabu, 4 November 2026 di Hotel Grasia Semarang. Dihadiri Kepala Sekolah dan 1 orang Koordinator Humas.',
    dispositions: [
      {
        id: 'disp_001',
        targetUserId: 'usr_admin_humas',
        targetUserName: 'Lutfi Maulana, S.Pd. (Humas)',
        instruction: 'Harap mendampingi Kepala Sekolah dan menyiapkan materi profil kehumasan digital.',
        deadline: '2026-11-03',
        status: 'Diproses',
        notes: 'Draf presentasi dan laporan publikasi sudah mulai disusun.'
      }
    ],
    status: 'Didisposisi'
  },
  {
    id: 'inc_002',
    agendaNumber: 'SM-2026-082',
    sourceLetterNumber: '440/Pusk.Mjn/X/2026',
    sourceDate: '2026-10-25',
    receivedDate: '2026-10-26',
    sender: 'Puskesmas Kecamatan Mijen',
    regarding: 'Pemberitahuan Pelaksanaan Program BIAS (Bulan Imunisasi Anak Sekolah) DT/Td',
    priority: 'Segera',
    category: 'Kesehatan & UKS',
    attachmentFileName: 'Jadwal_BIAS_Mijen_2026.pdf',
    summaryNotes: 'Pemberian imunisasi untuk peserta didik kelas 1, 2, dan 5 dijadwalkan pada hari Selasa, 10 November 2026.',
    dispositions: [
      {
        id: 'disp_002',
        targetUserId: 'usr_guru_staf',
        targetUserName: 'Ahmad Syukron, S.Pd.I (Pembina UKS)',
        instruction: 'Koordinasikan dengan wali kelas dan buat surat edaran persetujuan kepada orang tua/wali murid.',
        deadline: '2026-11-02',
        status: 'Menunggu'
      }
    ],
    status: 'Didisposisi'
  }
];

export const DEFAULT_AGENDAS: HumasAgenda[] = [
  {
    id: 'agd_001',
    title: 'Rapat Koordinasi Paguyuban Wali Murid Kelas 1 - 6',
    date: '2026-10-31',
    time: '08:30 - 11:30 WIB',
    location: 'Aula SD Islam Imama',
    personInCharge: 'Lutfi Maulana, S.Pd. (Humas)',
    participants: 'Pengurus Komite, Perwakilan Paguyuban, Kepala Sekolah, Dewan Guru',
    description: 'Musyawarah program parenting islami semester ganjil dan penyelarasan kegiatan keagamaan anak di rumah.',
    status: 'Mendatang'
  },
  {
    id: 'agd_002',
    title: 'Audiensi Kunjungan Kemitraan Bank Syariah Indonesia (BSI)',
    date: '2026-11-05',
    time: '10:00 - 11:30 WIB',
    location: 'Ruang Tamu Utama Humas',
    personInCharge: 'Muhammad Muzamil, S.Pd.',
    participants: 'Tim BSI Cabang Ngaliyan, Kepala Sekolah, Bendahara',
    description: 'Sosialisasi program Tabungan SimPel (Simpanan Pelajar) Syariah dan beasiswa anak berprestasi.',
    status: 'Mendatang'
  }
];

export const DEFAULT_PUBLIC_SERVICES: PublicServiceTicket[] = [
  {
    id: 'srv_001',
    ticketNumber: 'TIK-2026-001',
    applicantName: 'Fauzan Akbar',
    applicantPhone: '081234890011',
    applicantRole: 'Wali Murid',
    serviceType: 'Permohonan Surat Keterangan',
    description: 'Permohonan Surat Keterangan Aktif Belajar untuk keperluan beasiswa instansi BUMN ananda Muhammad Rizky (Kelas 3B).',
    status: 'Selesai',
    officerNotes: 'Surat telah diterbitkan dan diarsipkan. Pemohon telah mengambil berkas bertanda tangan basah dan stempel.',
    assignedOfficerName: 'Siti Rahmawati, A.Md.',
    createdAt: '2026-10-25 09:15',
    updatedAt: '2026-10-25 14:00'
  },
  {
    id: 'srv_002',
    ticketNumber: 'TIK-2026-002',
    applicantName: 'Hj. Mardhiyah',
    applicantPhone: '085712399881',
    applicantRole: 'Wali Murid',
    serviceType: 'Janji Temu Kepala Sekolah',
    description: 'Permohonan waktu silaturahmi menyampaikan wakaf buku ensiklopedia sains islam untuk perpustakaan sekolah.',
    status: 'Sedang Diproses',
    officerNotes: 'Telah dijadwalkan pada hari Kamis, 29 Oktober 2026 pukul 09.00 WIB.',
    assignedOfficerName: 'Lutfi Maulana, S.Pd.',
    createdAt: '2026-10-26 11:20',
    updatedAt: '2026-10-26 13:00'
  }
];

export const DEFAULT_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'cpl_001',
    ticketNumber: 'ADU-2026-001',
    reporterName: 'Wali Murid Kelas 2 (Anonim)',
    reporterPhone: '081298811223',
    category: 'Sarana & Prasarana',
    subject: 'Kondisi Atap Kanopi Parkiran Sepeda Siswa Bagian Barat',
    description: 'Mohon dicek kanopi penutup parkiran sepeda siswa di bagian barat yang sedikit miring akibat hembusan angin kencang kemarin.',
    priority: 'Sedang',
    status: 'Tindak Lanjut',
    officerResponse: 'Terima kasih atas kepedulian Bapak/Ibu. Petugas sarpras sekolah telah melakukan pengecekan dan perbaikan penguatan baut pada siang ini.',
    createdAt: '2026-10-26 08:00',
    resolvedAt: '2026-10-26 14:30'
  }
];

export const DEFAULT_PARTNERS: SchoolPartner[] = [
  {
    id: 'prt_001',
    partnerName: 'Puskesmas Kecamatan Mijen Kota Semarang',
    agencyType: 'Pemerintah',
    address: 'Jl. Raya Semarang-Boja No. 12, Mijen, Semarang',
    contactPerson: 'dr. Anindita Rahmawati',
    phone: '(024) 7711223',
    email: 'pusk.mijen@semarangkota.go.id',
    cooperationField: 'Pelayanan Kesehatan Sekolah, Imunisasi BIAS, Pemeriksaan Gigi, & Edukasi Gizi Seimbang',
    startDate: '2025-01-10',
    endDate: '2027-01-10',
    mouNumber: 'MoU/004/SDI-IMAMA/2025',
    status: 'Aktif'
  },
  {
    id: 'prt_002',
    partnerName: 'Bank Syariah Indonesia (BSI) KCP Ngaliyan',
    agencyType: 'BUMN / Perusahaan',
    address: 'Jl. Prof. Hamka No. 88, Ngaliyan, Semarang',
    contactPerson: 'Rizki Kurniawan (Branch Manager)',
    phone: '(024) 7622334',
    email: 'kc.ngaliyan@bankbsi.co.id',
    cooperationField: 'Tabungan Simpanan Pelajar (SimPel) Syariah & Program Edukasi Literasi Keuangan Syariah',
    startDate: '2024-08-01',
    endDate: '2027-08-01',
    mouNumber: 'MoU/012/SDI-IMAMA/2024',
    status: 'Aktif'
  }
];

export const DEFAULT_PUBLICATIONS: HumasPublication[] = [
  {
    id: 'pub_001',
    title: 'Prestasi Membanggakan: Kafilah SD Islam Imama Raih Juara Umum MAPSI Kecamatan Mijen 2026',
    category: 'Berita Sekolah',
    date: '2026-10-25',
    author: 'Tim Media & Humas SD Islam Imama',
    content: 'Alhamdulillah, puji syukur ke hadirat Allah SWT, delegasi siswa SD Islam Imama berhasil menorehkan prestasi gemilang dengan meraih 4 medali emas dan 2 medali perak pada ajang Lomba Mata Pelajaran dan Seni Islami (MAPSI) tingkat Kecamatan Mijen.',
    captionInstagram: '✨ Alhamdulillah, kabar gembira dari ajang MAPSI Mijen 2026! 🏆🥇\n\nSelamat atas torehan prestasi ananda santri SD Islam Imama yang berhasil mempersembahkan Juara Umum! Semoga semakin memacu semangat belajar Al-Qur\'an dan akhlak mulia. Barakallahu fikum! 🌿💚\n\n#SDIslamImama #SekolahTeladanSemarang #MAPSI2026 #GenerasiRabbani',
    captionWhatsapp: 'Assalamu\'alaikum wr. wb. Bapak/Ibu wali murid dan keluarga besar SD Islam Imama, alhamdulillah kafilah sekolah kita berhasil meraih Juara Umum MAPSI Kecamatan Mijen. Terima kasih atas doa dan dukungannya. Jazakumullahu khairan katsiran.',
    status: 'Terbit'
  }
];

export const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_001',
    title: 'Tamu Baru Tiba di Sekolah',
    message: 'Drs. H. Sugiyanto, M.Pd. (Dinas Pendidikan) sedang berkunjung menemui Kepala Sekolah.',
    type: 'tamu',
    isRead: false,
    createdAt: 'Baru saja',
    linkView: 'daftar_tamu'
  },
  {
    id: 'notif_002',
    title: 'Surat Masuk Baru Membutuhkan Disposisi',
    message: 'Surat dari Puskesmas Mijen perihal Program BIAS memerlukan disposisi pimpinan.',
    type: 'surat',
    isRead: false,
    createdAt: '1 jam yang lalu',
    linkView: 'surat_masuk'
  }
];

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Storage read error for ${key}:`, e);
    return fallback;
  }
}

function set<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('simhumas_data_updated', { detail: { key } }));
  } catch (e) {
    console.error(`Storage write error for ${key}:`, e);
  }
}

export const StorageService = {
  // Current User
  getCurrentUser(): User | null {
    return get<User | null>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USERS[0]);
  },
  setCurrentUser(u: User | null): void {
    set(STORAGE_KEYS.CURRENT_USER, u);
  },

  // Users
  getUsers(): User[] {
    return get<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  },
  saveUser(u: User): void {
    const list = this.getUsers();
    const idx = list.findIndex(x => x.id === u.id);
    if (idx >= 0) list[idx] = u;
    else list.push(u);
    set(STORAGE_KEYS.USERS, list);
  },
  deleteUser(id: string): void {
    const list = this.getUsers().filter(x => x.id !== id);
    set(STORAGE_KEYS.USERS, list);
  },

  // School Identity
  getSchoolIdentity(): SchoolIdentity {
    return get<SchoolIdentity>(STORAGE_KEYS.SCHOOL_IDENTITY, DEFAULT_SCHOOL_IDENTITY);
  },
  updateSchoolIdentity(identity: SchoolIdentity): void {
    set(STORAGE_KEYS.SCHOOL_IDENTITY, identity);
  },

  // Guest Visits (Buku Tamu Digital)
  getGuestVisits(): GuestVisit[] {
    return get<GuestVisit[]>(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
  },
  saveGuestVisit(visit: GuestVisit): void {
    const list = this.getGuestVisits();
    const idx = list.findIndex(v => v.id === visit.id);
    if (idx >= 0) list[idx] = visit;
    else list.unshift(visit);
    set(STORAGE_KEYS.GUESTS, list);
  },
  deleteGuestVisit(id: string): void {
    const list = this.getGuestVisits().filter(v => v.id !== id);
    set(STORAGE_KEYS.GUESTS, list);
  },

  // Official Letters (Surat Keluar / Draf)
  getOfficialLetters(): OfficialLetter[] {
    return get<OfficialLetter[]>(STORAGE_KEYS.OFFICIAL_LETTERS, DEFAULT_OFFICIAL_LETTERS);
  },
  saveOfficialLetter(ltr: OfficialLetter): void {
    const list = this.getOfficialLetters();
    const idx = list.findIndex(l => l.id === ltr.id);
    if (idx >= 0) list[idx] = ltr;
    else list.unshift(ltr);
    set(STORAGE_KEYS.OFFICIAL_LETTERS, list);
  },
  deleteOfficialLetter(id: string): void {
    const list = this.getOfficialLetters().filter(l => l.id !== id);
    set(STORAGE_KEYS.OFFICIAL_LETTERS, list);
  },

  // Incoming Letters
  getIncomingLetters(): IncomingLetter[] {
    return get<IncomingLetter[]>(STORAGE_KEYS.INCOMING_LETTERS, DEFAULT_INCOMING_LETTERS);
  },
  saveIncomingLetter(ltr: IncomingLetter): void {
    const list = this.getIncomingLetters();
    const idx = list.findIndex(l => l.id === ltr.id);
    if (idx >= 0) list[idx] = ltr;
    else list.unshift(ltr);
    set(STORAGE_KEYS.INCOMING_LETTERS, list);
  },
  deleteIncomingLetter(id: string): void {
    const list = this.getIncomingLetters().filter(l => l.id !== id);
    set(STORAGE_KEYS.INCOMING_LETTERS, list);
  },

  // Agendas
  getAgendas(): HumasAgenda[] {
    return get<HumasAgenda[]>(STORAGE_KEYS.AGENDAS, DEFAULT_AGENDAS);
  },
  saveAgenda(agenda: HumasAgenda): void {
    const list = this.getAgendas();
    const idx = list.findIndex(a => a.id === agenda.id);
    if (idx >= 0) list[idx] = agenda;
    else list.unshift(agenda);
    set(STORAGE_KEYS.AGENDAS, list);
  },
  deleteAgenda(id: string): void {
    const list = this.getAgendas().filter(a => a.id !== id);
    set(STORAGE_KEYS.AGENDAS, list);
  },

  // Public Services
  getPublicServices(): PublicServiceTicket[] {
    return get<PublicServiceTicket[]>(STORAGE_KEYS.PUBLIC_SERVICES, DEFAULT_PUBLIC_SERVICES);
  },
  savePublicService(srv: PublicServiceTicket): void {
    const list = this.getPublicServices();
    const idx = list.findIndex(s => s.id === srv.id);
    if (idx >= 0) list[idx] = srv;
    else list.unshift(srv);
    set(STORAGE_KEYS.PUBLIC_SERVICES, list);
  },

  // Complaints
  getComplaints(): CitizenComplaint[] {
    return get<CitizenComplaint[]>(STORAGE_KEYS.COMPLAINTS, DEFAULT_COMPLAINTS);
  },
  saveComplaint(c: CitizenComplaint): void {
    const list = this.getComplaints();
    const idx = list.findIndex(x => x.id === c.id);
    if (idx >= 0) list[idx] = c;
    else list.unshift(c);
    set(STORAGE_KEYS.COMPLAINTS, list);
  },

  // Partners
  getPartners(): SchoolPartner[] {
    return get<SchoolPartner[]>(STORAGE_KEYS.PARTNERS, DEFAULT_PARTNERS);
  },
  savePartner(p: SchoolPartner): void {
    const list = this.getPartners();
    const idx = list.findIndex(x => x.id === p.id);
    if (idx >= 0) list[idx] = p;
    else list.unshift(p);
    set(STORAGE_KEYS.PARTNERS, list);
  },
  deletePartner(id: string): void {
    const list = this.getPartners().filter(x => x.id !== id);
    set(STORAGE_KEYS.PARTNERS, list);
  },

  // Publications
  getPublications(): HumasPublication[] {
    return get<HumasPublication[]>(STORAGE_KEYS.PUBLICATIONS, DEFAULT_PUBLICATIONS);
  },
  savePublication(pub: HumasPublication): void {
    const list = this.getPublications();
    const idx = list.findIndex(x => x.id === pub.id);
    if (idx >= 0) list[idx] = pub;
    else list.unshift(pub);
    set(STORAGE_KEYS.PUBLICATIONS, list);
  },
  deletePublication(id: string): void {
    const list = this.getPublications().filter(x => x.id !== id);
    set(STORAGE_KEYS.PUBLICATIONS, list);
  },

  // Notifications
  getNotifications(): SystemNotification[] {
    return get<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  },
  markNotificationRead(id: string): void {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    set(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // Reset Factory
  resetAll(): void {
    localStorage.clear();
    set(STORAGE_KEYS.SCHOOL_IDENTITY, DEFAULT_SCHOOL_IDENTITY);
    set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    set(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
    set(STORAGE_KEYS.OFFICIAL_LETTERS, DEFAULT_OFFICIAL_LETTERS);
    set(STORAGE_KEYS.INCOMING_LETTERS, DEFAULT_INCOMING_LETTERS);
    set(STORAGE_KEYS.AGENDAS, DEFAULT_AGENDAS);
    set(STORAGE_KEYS.PUBLIC_SERVICES, DEFAULT_PUBLIC_SERVICES);
    set(STORAGE_KEYS.COMPLAINTS, DEFAULT_COMPLAINTS);
    set(STORAGE_KEYS.PARTNERS, DEFAULT_PARTNERS);
    set(STORAGE_KEYS.PUBLICATIONS, DEFAULT_PUBLICATIONS);
    set(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    this.setCurrentUser(DEFAULT_USERS[0]);
  }
};
