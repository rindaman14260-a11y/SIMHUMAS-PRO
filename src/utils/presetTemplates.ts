import { LetterType } from '../types';

export interface LetterTemplatePreset {
  type: LetterType;
  label: string;
  name: string;
  title: string;
  regarding: string;
  subject: string;
  attachmentCount: string;
  defaultRecipient: string;
  defaultAddress: string;
  recipientName: string;
  recipientAddress: string;
  opening: string;
  bodyDetail: string;
  closing: string;
  bodyParagraphs: string[];
}

export const LETTER_PRESETS: LetterTemplatePreset[] = [
  {
    type: 'undangan',
    label: 'Surat Undangan Resmi',
    name: 'Surat Undangan Rapat / Wali Murid',
    title: 'Surat Undangan Pertemuan & Silaturahmi Paguyuban',
    regarding: 'Undangan Rapat Koordinasi & Silaturahmi',
    subject: 'Undangan Rapat Koordinasi & Silaturahmi',
    attachmentCount: '1 (satu) Berkas',
    defaultRecipient: 'Bapak/Ibu Orang Tua / Wali Murid',
    defaultAddress: 'Di Tempat',
    recipientName: 'Bapak/Ibu Orang Tua / Wali Murid',
    recipientAddress: 'Di Tempat',
    opening: 'Puji syukur senantiasa kita panjatkan ke hadirat Allah SWT atas limpahan rahmat dan karunia-Nya. Shalawat dan salam semoga tercurah kepada Nabi Muhammad SAW.',
    bodyDetail: 'Hari/Tanggal : Sabtu, 7 November 2026\nWaktu : Pukul 08.30 - 11.00 WIB\nTempat : Aula Utama SD Islam Imama, Mijen\nAgenda : Sosialisasi Program Tahfidz & Parenting Islami',
    closing: 'Mengingat pentingnya agenda tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya. Atas perhatian dan kehadirannya kami sampaikan terima kasih.',
    bodyParagraphs: [
      'Puji syukur senantiasa kita panjatkan ke hadirat Allah SWT atas limpahan rahmat dan karunia-Nya. Shalawat dan salam semoga tercurah kepada Nabi Muhammad SAW.',
      'Dalam rangka mempererat tali silaturahmi serta mensosialisasikan program pembelajaran semester aktif dan penguatan akhlak peserta didik, kami mengharap kehadiran Bapak/Ibu pada:',
      'Hari/Tanggal : Sabtu, 7 November 2026\nWaktu : Pukul 08.30 - 11.00 WIB\nTempat : Aula Utama SD Islam Imama, Mijen\nAgenda : Sosialisasi Program Tahfidz & Parenting Islami',
      'Mengingat pentingnya agenda tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya. Atas perhatian dan kehadirannya kami sampaikan terima kasih.'
    ]
  },
  {
    type: 'pemberitahuan',
    label: 'Surat Pemberitahuan Kegiatan',
    name: 'Surat Pemberitahuan Sekolah',
    title: 'Surat Pemberitahuan Pelaksanaan Asesmen Semester',
    regarding: 'Pemberitahuan Pelaksanaan Ujian Asesmen & Libur',
    subject: 'Pemberitahuan Pelaksanaan Ujian Asesmen & Libur',
    attachmentCount: '-',
    defaultRecipient: 'Seluruh Orang Tua / Wali Murid SD Islam Imama',
    defaultAddress: 'Di Tempat',
    recipientName: 'Seluruh Orang Tua / Wali Murid SD Islam Imama',
    recipientAddress: 'Di Tempat',
    opening: 'Dengan memohon ridho dan taufik Allah SWT, semoga Bapak/Ibu senantiasa dalam lindungan-Nya dalam menjalankan aktivitas sehari-hari.',
    bodyDetail: 'Diberitahukan bahwa rangkaian kegiatan Sumatif Akhir Semester (SAS) Ganjil Tahun Pelajaran 2026/2027 akan dilaksanakan pada tanggal 1 - 8 Desember 2026.',
    closing: 'Demikian surat pemberitahuan ini kami sampaikan. Atas kerja sama dan perhatian yang baik, kami haturkan terima kasih.',
    bodyParagraphs: [
      'Dengan memohon ridho dan taufik Allah SWT, semoga Bapak/Ibu senantiasa dalam lindungan-Nya dalam menjalankan aktivitas sehari-hari.',
      'Diberitahukan dengan hormat bahwa rangkaian kegiatan Sumatif Akhir Semester (SAS) Ganjil Tahun Pelajaran 2026/2027 akan dilaksanakan mulai tanggal 1 hingga 8 Desember 2026.',
      'Sehubungan dengan hal tersebut, kami mengimbau kepada Bapak/Ibu untuk mendampingi putra-putrinya dalam belajar dan menjaga kesehatan selama masa penilaian berlangsung.',
      'Demikian surat pemberitahuan ini kami sampaikan. Atas kerja sama dan perhatian yang baik, kami haturkan terima kasih.'
    ]
  },
  {
    type: 'tugas',
    label: 'Surat Tugas Guru / Karyawan',
    name: 'Surat Tugas Kedinasan',
    title: 'Surat Tugas Pembimbingan Delegasi Lomba',
    regarding: 'Surat Tugas Pembimbingan Delegasi Lomba',
    subject: 'Penugasan Pembimbing Lomba Tingkat Kecamatan Mijen',
    attachmentCount: '-',
    defaultRecipient: 'Ahmad Syukron, S.Pd.I',
    defaultAddress: 'SD Islam Imama Semarang',
    recipientName: 'Ahmad Syukron, S.Pd.I',
    recipientAddress: 'SD Islam Imama Semarang',
    opening: 'Yang bertanda tangan di bawah ini Kepala SD Islam Imama Kecamatan Mijen Kota Semarang memberikan tugas kedinasan kepada:',
    bodyDetail: 'Nama : Ahmad Syukron, S.Pd.I\nJabatan : Guru PAI & Pembina Tahfidz SD Islam Imama\nNIP : 19910515 201802 1 003\nUntuk mendampingi delegasi lomba MAPSI di Islamic Center.',
    closing: 'Demikian surat tugas ini diberikan agar dilaksanakan dengan penuh tanggung jawab dan melaporkan hasilnya setelah kegiatan selesai.',
    bodyParagraphs: [
      'Yang bertanda tangan di bawah ini Kepala SD Islam Imama Kecamatan Mijen Kota Semarang memberikan tugas kedinasan kepada:',
      'Nama : Ahmad Syukron, S.Pd.I\nJabatan : Guru PAI & Pembina Tahfidz SD Islam Imama\nNIP : 19910515 201802 1 003',
      'Untuk mendampingi serta membimbing peserta didik delegasi SD Islam Imama dalam ajang Festival Anak Sholeh Indonesia (FASI) Tingkat Kota Semarang yang diselenggarakan pada tanggal 12-14 November 2026 bertempat di Islamic Center Jawa Tengah.',
      'Demikian surat tugas ini diberikan agar dilaksanakan dengan penuh tanggung jawab dan melaporkan hasilnya setelah kegiatan selesai.'
    ]
  },
  {
    type: 'izin',
    label: 'Surat Izin Kegiatan / Tempat',
    name: 'Surat Izin Pemakaian Tempat / Kunjungan',
    title: 'Surat Permohonan Izin Pembelajaran Luar Kelas',
    regarding: 'Permohonan Izin Kunjungan Edukatif',
    subject: 'Permohonan Izin Kunjungan Edukatif',
    attachmentCount: '1 Proposal',
    defaultRecipient: 'Kepala Balai Pengelola Cagar Budaya / Museum',
    defaultAddress: 'Semarang',
    recipientName: 'Kepala Balai Pengelola Cagar Budaya / Museum',
    recipientAddress: 'Semarang',
    opening: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh. Semoga rahmat dan keberkahan Allah SWT senantiasa menyertai Bapak/Ibu dalam mengemban amanah kedinasan.',
    bodyDetail: 'Hari/Tanggal : Rabu, 18 November 2026\nWaktu : Pukul 09.00 - 13.00 WIB\nJumlah Peserta : 65 Siswa Kelas 4 dan 6 Guru Pendamping.',
    closing: 'Besar harapan kami kiranya permohonan izin ini dapat dikabulkan. Atas perkenan dan kerja samanya kami ucapkan terima kasih.',
    bodyParagraphs: [
      'Assalamu\'alaikum Warahmatullahi Wabarakatuh. Semoga rahmat dan keberkahan Allah SWT senantiasa menyertai Bapak/Ibu dalam mengemban amanah kedinasan.',
      'Dalam rangka memperluas wawasan peserta didik mengenai sejarah peradaban dan kebudayaan daerah, SD Islam Imama merencanakan kegiatan outdoor learning.',
      'Hari/Tanggal : Rabu, 18 November 2026\nWaktu : Pukul 09.00 - 13.00 WIB\nJumlah Peserta : 65 Siswa Kelas 4 dan 6 Guru Pendamping.',
      'Besar harapan kami kiranya permohonan izin ini dapat dikabulkan. Atas perkenan dan kerja samanya kami ucapkan terima kasih.'
    ]
  },
  {
    type: 'permohonan',
    label: 'Surat Permohonan Kerjasama / Bantuan',
    name: 'Surat Permohonan',
    title: 'Surat Permohonan Narasumber Sosialisasi',
    regarding: 'Permohonan Narasumber Edukasi Kesehatan Siswa',
    subject: 'Permohonan Narasumber Edukasi Kesehatan Siswa',
    attachmentCount: '1 Jadwal',
    defaultRecipient: 'Kepala Puskesmas Kecamatan Mijen',
    defaultAddress: 'Jl. Raya Semarang-Boja',
    recipientName: 'Kepala Puskesmas Kecamatan Mijen',
    recipientAddress: 'Jl. Raya Semarang-Boja',
    opening: 'Teriring doa semoga Bapak/Ibu beserta seluruh jajaran senantiasa dalam keadaan sehat dan sukses dalam menjalankan pengabdian kepada masyarakat.',
    bodyDetail: 'Hari/Tanggal : Kamis, 12 November 2026\nWaktu : Pukul 08.00 - 10.00 WIB\nTopik : Makanan Sehat Bergizi & Pencegahan Anemia Sejak Dini.',
    closing: 'Demikian surat permohonan ini kami sampaikan. Atas kesediaan dan dukungan Bapak/Ibu kami sampaikan terima kasih yang sebesar-besarnya.',
    bodyParagraphs: [
      'Teriring doa semoga Bapak/Ibu beserta seluruh jajaran senantiasa dalam keadaan sehat dan sukses dalam menjalankan pengabdian kepada masyarakat.',
      'Sehubungan dengan pelaksanaan program Sekolah Sehat dan Pembiasaan Hidup Bersih di SD Islam Imama, kami memohon kesediaan petugas medis untuk menjadi narasumber.',
      'Hari/Tanggal : Kamis, 12 November 2026\nWaktu : Pukul 08.00 - 10.00 WIB\nTopik : Makanan Sehat Bergizi & Pencegahan Anemia Sejak Dini.',
      'Demikian surat permohonan ini kami sampaikan. Atas kesediaan dan dukungan Bapak/Ibu kami sampaikan terima kasih yang sebesar-besarnya.'
    ]
  },
  {
    type: 'keterangan',
    label: 'Surat Keterangan Aktif Siswa',
    name: 'Surat Keterangan Aktif Siswa',
    title: 'Surat Keterangan Masih Aktif Belajar',
    regarding: 'Surat Keterangan Siswa Aktif Sekolah',
    subject: 'Surat Keterangan Siswa Aktif Sekolah',
    attachmentCount: '-',
    defaultRecipient: 'Orang Tua / Wali Siswa',
    defaultAddress: 'Di Tempat',
    recipientName: 'Orang Tua / Wali Siswa',
    recipientAddress: 'Di Tempat',
    opening: 'Yang bertanda tangan di bawah ini Kepala SD Islam Imama Kota Semarang menerangkan bahwa:',
    bodyDetail: 'Nama Siswa : Muhammad Fathir Al-Ghifari\nNISN : 0148921102\nKelas : IV-B (Empat B)\nAdalah benar siswa aktif pada Tahun Pelajaran 2026/2027.',
    closing: 'Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.',
    bodyParagraphs: [
      'Yang bertanda tangan di bawah ini Kepala SD Islam Imama Kota Semarang menerangkan dengan sesungguhnya bahwa:',
      'Nama Siswa : Muhammad Fathir Al-Ghifari\nNISN : 0148921102\nKelas : IV-B (Empat B)\nNama Orang Tua : Bambang Irawan',
      'Adalah benar peserta didik yang tercatat aktif menuntut ilmu di SD Islam Imama Semarang pada Tahun Pelajaran 2026/2027 dan berkelakuan baik.',
      'Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.'
    ]
  },
  {
    type: 'rekomendasi',
    label: 'Surat Rekomendasi Lomba / Beasiswa',
    name: 'Surat Rekomendasi Siswa',
    title: 'Surat Rekomendasi Beasiswa Prestasi Tahfidz',
    regarding: 'Rekomendasi Peserta Seleksi Beasiswa',
    subject: 'Rekomendasi Peserta Seleksi Beasiswa',
    attachmentCount: '1 Berkas Portofolio',
    defaultRecipient: 'Panitia Seleksi Beasiswa Pendidikan Baznas',
    defaultAddress: 'Kota Semarang',
    recipientName: 'Panitia Seleksi Beasiswa Pendidikan Baznas',
    recipientAddress: 'Kota Semarang',
    opening: 'Berdasarkan rekam jejak akademik, hafalan Al-Quran, dan akhlakul karimah peserta didik, Kepala SD Islam Imama memberikan rekomendasi kepada:',
    bodyDetail: 'Nama : Aisyah Humaira Putri\nKelas : VI-A\nCapaian : Juara 1 Tahfidz Juz 30 Tingkat Kecamatan.',
    closing: 'Besar harapan kami ananda dapat dipertimbangkan dalam penerimaan beasiswa tersebut. Terima kasih.',
    bodyParagraphs: [
      'Berdasarkan rekam jejak akademik, hafalan Al-Quran, dan akhlakul karimah peserta didik, Kepala SD Islam Imama memberikan rekomendasi kepada:',
      'Nama : Aisyah Humaira Putri\nKelas : VI-A\nCapaian : Juara 1 Tahfidz Juz 30 Tingkat Kecamatan.',
      'Siswa yang bersangkutan memiliki motivasi belajar yang tinggi, santun, dan sangat layak memperoleh dukungan beasiswa.',
      'Besar harapan kami ananda dapat dipertimbangkan dalam penerimaan beasiswa tersebut. Terima kasih.'
    ]
  },
  {
    type: 'pengantar',
    label: 'Surat Pengantar Berkas Dinas',
    name: 'Surat Pengantar',
    title: 'Surat Pengantar Pengiriman Berkas Laporan',
    regarding: 'Pengantar Laporan Evaluasi Kesiapan Akreditasi',
    subject: 'Pengantar Laporan Evaluasi Kesiapan Akreditasi',
    attachmentCount: '2 (dua) Bendel Dokumen',
    defaultRecipient: 'Kepala Bidang Pembinaan SD Dinas Pendidikan',
    defaultAddress: 'Kota Semarang',
    recipientName: 'Kepala Bidang Pembinaan SD Dinas Pendidikan',
    recipientAddress: 'Kota Semarang',
    opening: 'Bersama ini kami kirimkan dengan hormat berkas laporan administrasi kelembagaan SD Islam Imama sebagaimana rincian berikut:',
    bodyDetail: '1. Berkas Evaluasi Diri Sekolah (EDS) : 1 Bendel\n2. Dokumen Kesiapan Pemutakhiran Akreditasi : 1 Bendel.',
    closing: 'Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya.',
    bodyParagraphs: [
      'Bersama ini kami kirimkan dengan hormat berkas laporan administrasi kelembagaan SD Islam Imama sebagaimana rincian berikut:',
      '1. Berkas Evaluasi Diri Sekolah (EDS) : 1 Bendel\n2. Dokumen Kesiapan Pemutakhiran Akreditasi : 1 Bendel.',
      'Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya.'
    ]
  },
  {
    type: 'edaran',
    label: 'Surat Edaran Libur / Ketertiban',
    name: 'Surat Edaran Wali Murid',
    title: 'Surat Edaran Pembiasaan Shalat & Amaliyah Ramadhan',
    regarding: 'Edaran Amaliyah Ramadhan & Libur Idul Fitri',
    subject: 'Edaran Amaliyah Ramadhan & Libur Idul Fitri',
    attachmentCount: '1 Buku Panduan Mutabaah',
    defaultRecipient: 'Bapak/Ibu Wali Murid Kelas 1 - 6',
    defaultAddress: 'Di Tempat',
    recipientName: 'Bapak/Ibu Wali Murid Kelas 1 - 6',
    recipientAddress: 'Di Tempat',
    opening: 'Marhaban Ya Ramadhan. Semoga kita semua dikaruniai kekuatan lahir batin dalam meraih ketaqwaan sejati.',
    bodyDetail: '1. Pembelajaran tatap muka di madrasah/sekolah dimulai pukul 08.00 WIB.\n2. Pembiasaan Shalat Dhuha dan Tadarus bersama setiap pagi.\n3. Pengisian Buku Mutabaah Yaumiyyah diparaf orang tua setiap hari.',
    closing: 'Semoga ibadah kita diterima oleh Allah SWT. Atas perhatian dan kerjasamanya kami ucapkan jazakumullah khairan.',
    bodyParagraphs: [
      'Marhaban Ya Ramadhan. Semoga kita semua dikaruniai kekuatan lahir batin dalam meraih ketaqwaan sejati.',
      'Sehubungan dengan memasuki bulan suci, kami mengimbau kepada seluruh orang tua untuk mengawal pembiasaan ibadah ananda di rumah.',
      '1. Pembiasaan Shalat Dhuha dan Tadarus bersama setiap pagi.\n2. Pengisian Buku Mutabaah Yaumiyyah diparaf orang tua setiap hari.',
      'Semoga ibadah kita diterima oleh Allah SWT. Atas perhatian dan kerjasamanya kami ucapkan jazakumullah khairan.'
    ]
  },
  {
    type: 'balasan',
    label: 'Surat Balasan Permohonan Studi Tiru',
    name: 'Surat Balasan',
    title: 'Surat Balasan Persetujuan Kunjungan Studi Tiru',
    regarding: 'Konfirmasi Penerimaan Kunjungan Studi Tiru',
    subject: 'Konfirmasi Penerimaan Kunjungan Studi Tiru',
    attachmentCount: '-',
    defaultRecipient: 'Kepala SDIT Al-Madinah Boyolali',
    defaultAddress: 'Di Tempat',
    recipientName: 'Kepala SDIT Al-Madinah Boyolali',
    recipientAddress: 'Di Tempat',
    opening: 'Menjawab surat Saudara Nomor: 120/SDIT-AM/X/2026 perihal permohonan kunjungan studi tiru program tahfidz dan tata kelola humas digital, kami menyambut baik maksud mulia tersebut.',
    bodyDetail: 'Waktu : Selasa, 10 November 2026 pukul 09.00 - 12.00 WIB\nTempat : Ruang Multimedia & Laboratorium Digital SD Islam Imama.',
    closing: 'Demikian surat balasan ini kami sampaikan. Kami menantikan kehadiran sahabat pendidik sekalian.',
    bodyParagraphs: [
      'Menjawab surat Saudara Nomor: 120/SDIT-AM/X/2026 perihal permohonan kunjungan studi tiru program tahfidz dan tata kelola humas digital, kami menyambut baik maksud mulia tersebut.',
      'Waktu : Selasa, 10 November 2026 pukul 09.00 - 12.00 WIB\nTempat : Ruang Multimedia & Laboratorium Digital SD Islam Imama.',
      'Demikian surat balasan ini kami sampaikan. Kami menantikan kehadiran sahabat pendidik sekalian.'
    ]
  },
  {
    type: 'kerjasama',
    label: 'Surat Perjanjian Kerja Sama (MoU)',
    name: 'Surat Perjanjian Kerja Sama (MoU)',
    title: 'Surat Perjanjian Kemitraan Literasi & Tabungan',
    regarding: 'Nota Kesepakatan Program Tabungan Pelajar',
    subject: 'Nota Kesepakatan Program Tabungan Pelajar',
    attachmentCount: '2 Berkas MoU',
    defaultRecipient: 'Pimpinan Bank Syariah Indonesia (BSI) KCP Ngaliyan',
    defaultAddress: 'Semarang',
    recipientName: 'Pimpinan Bank Syariah Indonesia (BSI) KCP Ngaliyan',
    recipientAddress: 'Semarang',
    opening: 'Pada hari ini sepakat mengikatkan diri dalam kemitraan edukasi antara SD Islam Imama dengan Bank Syariah Indonesia.',
    bodyDetail: 'Penyelenggaraan program pembukaan rekening tabungan Simpanan Pelajar (SimPel) Syariah bebas biaya administrasi untuk seluruh peserta didik.',
    closing: 'Perjanjian kerja sama ini berlaku selama 3 (tiga) tahun terhitung sejak ditandatanganinya naskah ini.',
    bodyParagraphs: [
      'Pada hari ini sepakat mengikatkan diri dalam kemitraan edukasi antara SD Islam Imama dengan Bank Syariah Indonesia.',
      'Penyelenggaraan program pembukaan rekening tabungan Simpanan Pelajar (SimPel) Syariah bebas biaya administrasi untuk seluruh peserta didik.',
      'Perjanjian kerja sama ini berlaku selama 3 (tiga) tahun terhitung sejak ditandatanganinya naskah ini.'
    ]
  },
  {
    type: 'panggilan',
    label: 'Surat Panggilan Orang Tua / Wali',
    name: 'Surat Panggilan Orang Tua',
    title: 'Surat Panggilan Konseling & Pembinaan Siswa',
    regarding: 'Panggilan Musyawarah Pembinaan Khusus Siswa',
    subject: 'Panggilan Musyawarah Pembinaan Khusus Siswa',
    attachmentCount: '-',
    defaultRecipient: 'Orang Tua / Wali Ananda Farhan',
    defaultAddress: 'Di Tempat',
    recipientName: 'Orang Tua / Wali Ananda Farhan',
    recipientAddress: 'Di Tempat',
    opening: 'Teriring salam dan doa semoga Bapak/Ibu senantiasa dalam keadaan sehat wal afiat.',
    bodyDetail: 'Hari/Tanggal : Kamis, 5 November 2026\nWaktu : Pukul 10.00 WIB\nTempat : Ruang Konseling & Kehumasan SD Islam Imama\nMenemui : Tim Bimbingan Konseling & Wali Kelas 6A.',
    closing: 'Kehadiran Bapak/Ibu secara langsung tanpa diwakilkan sangat kami harapkan demi kebaikan dan masa depan ananda tercinta. Terima kasih.',
    bodyParagraphs: [
      'Teriring salam dan doa semoga Bapak/Ibu senantiasa dalam keadaan sehat wal afiat.',
      'Sehubungan dengan adanya beberapa hal penting mengenai perkembangan belajar ananda di sekolah, kami mengharap kehadiran Bapak/Ibu.',
      'Hari/Tanggal : Kamis, 5 November 2026\nWaktu : Pukul 10.00 WIB\nTempat : Ruang Konseling & Kehumasan SD Islam Imama\nMenemui : Tim Bimbingan Konseling & Wali Kelas 6A.',
      'Kehadiran Bapak/Ibu secara langsung tanpa diwakilkan sangat kami harapkan demi kebaikan dan masa depan ananda tercinta. Terima kasih.'
    ]
  },
  {
    type: 'berita_acara',
    label: 'Berita Acara Kegiatan',
    name: 'Berita Acara Serah Terima',
    title: 'Berita Acara Serah Terima Bantuan Buku',
    regarding: 'Berita Acara Serah Terima Hibah Buku',
    subject: 'Berita Acara Serah Terima Hibah Buku',
    attachmentCount: '1 Daftar Rincian',
    defaultRecipient: 'Yayasan Pendidikan Islam Imama',
    defaultAddress: 'Semarang',
    recipientName: 'Yayasan Pendidikan Islam Imama',
    recipientAddress: 'Semarang',
    opening: 'Pada hari ini telah dilaksanakan serah terima hibah buku bacaan islami kepada pihak Sekolah Dasar Islam Imama.',
    bodyDetail: 'Pihak Pertama telah menyerahkan sejumlah 250 eksemplar buku cerita nabi dan ensiklopedia sains islam dalam kondisi baru dan baik kepada Pihak Kedua.',
    closing: 'Demikian Berita Acara ini dibuat dengan sebenarnya dalam rangkap 2 (dua) yang mempunyai kekuatan pembuktian yang sama.',
    bodyParagraphs: [
      'Pada hari ini telah dilaksanakan serah terima hibah buku bacaan islami kepada pihak Sekolah Dasar Islam Imama.',
      'Pihak Pertama telah menyerahkan sejumlah 250 eksemplar buku cerita nabi dan ensiklopedia sains islam dalam kondisi baru dan baik kepada Pihak Kedua.',
      'Demikian Berita Acara ini dibuat dengan sebenarnya dalam rangkap 2 (dua) yang mempunyai kekuatan pembuktian yang sama.'
    ]
  }
];

export function getPresetTemplate(type: LetterType): LetterTemplatePreset {
  const found = LETTER_PRESETS.find(p => p.type === type);
  return found || LETTER_PRESETS[0];
}

export const PRESET_TEMPLATES: Record<LetterType, LetterTemplatePreset> = LETTER_PRESETS.reduce(
  (acc, item) => {
    acc[item.type] = item;
    return acc;
  },
  {} as Record<LetterType, LetterTemplatePreset>
);
