import { SchoolConfig } from '../types';
import { generateFormalKopHtml, generateSignatureTableHtml } from '../utils/documentExport';

export interface DocGenerationParams {
  docType: string;
  mapel: string;
  kelas: string;
  fase: string;
  semester: string;
  materiPokok?: string;
  alokasiJp?: number;
  modelPembelajaran?: string;
  namaGuru: string;
  nipGuru?: string;
  schoolConfig: SchoolConfig;
}

export function generateTemplateDocument(params: DocGenerationParams): { html: string; orientation: 'portrait' | 'landscape'; title: string } {
  const { docType, mapel, kelas, fase, semester, materiPokok = 'Materi Pembelajaran Terpadu', alokasiJp = 4, modelPembelajaran = 'Problem-Based Learning (PBL)', namaGuru, nipGuru, schoolConfig } = params;
  const kop = generateFormalKopHtml(schoolConfig);
  const ttd = generateSignatureTableHtml(schoolConfig, namaGuru, nipGuru);

  switch (docType) {
    case 'ADM-CP': {
      const title = `ANALISIS CAPAIAN PEMBELAJARAN (CP) - ${mapel.toUpperCase()} FASE ${fase}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">ANALISIS CAPAIAN PEMBELAJARAN (ADM-CP)</h2>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 4px;">KURIKULUM MERDEKA TAHUN PELAJARAN ${schoolConfig.tahunPelajaran}</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 16px;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 22%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="border: none !important; width: 3%;">:</td>
            <td style="border: none !important; width: 25%;">${schoolConfig.namaSekolah}</td>
            <td style="border: none !important; width: 22%; font-weight: bold;">Fase / Kelas</td>
            <td style="border: none !important; width: 3%;">:</td>
            <td style="border: none !important; width: 25%;">Fase ${fase} / Kelas ${kelas}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${mapel}</td>
            <td style="border: none !important; font-weight: bold;">Tahun Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${schoolConfig.tahunPelajaran}</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-top: 14px; font-size: 11pt;">I. RASIONAL MATA PELAJARAN</div>
        <p style="text-align: justify; text-indent: 28px; margin: 4px 0 10px 0;">
          Mata pelajaran ${mapel} pada Fase ${fase} membekali peserta didik dengan kompetensi berpikir kritis, analitis, kreatif, dan berintegritas tinggi. Pembelajaran dirancang secara kontekstual, berorientasi pada pemecahan masalah dunia nyata, serta memfasilitasi pembentukan Profil Pelajar Pancasila yang mandiri dan berwawasan global.
        </p>

        <div style="font-weight: bold; margin-top: 14px; font-size: 11pt;">II. TUJUAN MATA PELAJARAN</div>
        <ol style="margin: 4px 0 10px 20px; padding: 0;">
          <li>Mengembangkan pemahaman konseptual dan prosedural yang mendalam mengenai ${materiPokok}.</li>
          <li>Menumbuhkan kecakapan nalar kritis dalam mengidentifikasi, menganalisis, dan memecahkan permasalahan.</li>
          <li>Menginternalisasi nilai-nilai kebhinekaan global, gotong royong, dan integritas dalam karya ilmiah serta praktik keseharian.</li>
        </ol>

        <div style="font-weight: bold; margin-top: 14px; font-size: 11pt;">III. KARAKTERISTIK & ELEMEN PEMBELAJARAN</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
          <thead>
            <tr>
              <th style="width: 25%;">Elemen</th>
              <th style="width: 75%;">Deskripsi Elemen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">Pemahaman Konsep</td>
              <td>Peserta didik memiliki kemampuan memahami materi ${materiPokok}, mengaitkan fenomena, dan mengorganisasikan informasi ke dalam struktur pemikiran logis.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Keterampilan Proses</td>
              <td>Peserta didik terampil mengamati, menanya, merencanakan penyelidikan, mengumpulkan data, menginterpretasi, dan mengomunikasikan hasil penemuan secara ilmiah.</td>
            </tr>
          </tbody>
        </table>

        <div style="font-weight: bold; margin-top: 14px; font-size: 11pt;">IV. CAPAIAN PEMBELAJARAN FASE & PENJABARAN KKO</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
          <thead>
            <tr>
              <th style="width: 8%;">No</th>
              <th style="width: 20%;">Elemen CP</th>
              <th style="width: 42%;">Kalimat Capaian Pembelajaran (CP)</th>
              <th style="width: 15%;">KKO Bloom</th>
              <th style="width: 15%;">Dimensi Profil</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">1</td>
              <td style="font-weight: bold;">Pemahaman Konsep</td>
              <td>Peserta didik mampu menganalisis prinsip-prinsip ${materiPokok} dan menerapkannya dalam menyelesaikan masalah kontekstual.</td>
              <td>Menganalisis (C4), Menerapkan (C3)</td>
              <td>Bernalar Kritis, Mandiri</td>
            </tr>
            <tr>
              <td style="text-align: center;">2</td>
              <td style="font-weight: bold;">Keterampilan Proses</td>
              <td>Peserta didik mampu merancang penyelidikan mandiri, menyajikan data terstruktur, serta merefleksikan solusi alternatif.</td>
              <td>Merancang (C6), Menyajikan (P3)</td>
              <td>Kreatif, Gotong Royong</td>
            </tr>
          </tbody>
        </table>

        <div style="font-weight: bold; margin-top: 14px; font-size: 11pt;">V. PEMETAAN 8 DIMENSI PROFIL LULUSAN</div>
        <p style="margin: 4px 0 8px 0;">Terintegrasi penuh: Keimanan & Ketakwaan, Kewargaan Global, Penalaran Kritis, Kreativitas, Kemandirian, Kolaborasi/Gotong Royong, Komunikasi Efektif, dan Kesehatan Jasmani & Rohani.</p>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'ADM-TP': {
      const title = `TUJUAN PEMBELAJARAN (TP) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">PERUMUSAN TUJUAN PEMBELAJARAN (ADM-TP)</h2>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 4px;">KURIKULUM MERDEKA TAHUN PELAJARAN ${schoolConfig.tahunPelajaran}</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 16px;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 20%; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important; width: 3%;">:</td>
            <td style="border: none !important; width: 30%;">${mapel}</td>
            <td style="border: none !important; width: 20%; font-weight: bold;">Kelas / Semester</td>
            <td style="border: none !important; width: 3%;">:</td>
            <td style="border: none !important; width: 24%;">${kelas} / ${semester}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Fase</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">Fase ${fase}</td>
            <td style="border: none !important; font-weight: bold;">Tahun Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${schoolConfig.tahunPelajaran}</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-top: 10px; font-size: 11pt;">I. PANDUAN PENGKODEAN TUJUAN PEMBELAJARAN (TP)</div>
        <p style="margin: 4px 0 8px 0; font-size: 10pt;">
          Format Kode: <strong>TP [Tingkat].[Nomor Urut]</strong> (Contoh: TP 7.1 = TP Kelas 7 No 1). Setiap perumusan TP memenuhi kaidah <strong>ABCD</strong> (<em>Audience, Behavior, Condition, Degree</em>) dengan KKO Taksonomi Bloom level C2 - C5.
        </p>

        <div style="font-weight: bold; margin-top: 12px; font-size: 11pt;">II. DAFTAR TUJUAN PEMBELAJARAN PER ELEMEN</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
          <thead>
            <tr>
              <th style="width: 10%;">Kode TP</th>
              <th style="width: 18%;">Elemen</th>
              <th style="width: 42%;">Rumusan Tujuan Pembelajaran (ABCD)</th>
              <th style="width: 18%;">Aspek Kompetensi & KKO</th>
              <th style="width: 12%;">Alokasi JP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${kelas.split('-')[0] || '7'}.1</td>
              <td>Pemahaman Konsep</td>
              <td>Melalui pengamatan fenomena kontekstual, peserta didik mampu mengidentifikasi dan menjelaskan konsep dasar ${materiPokok} dengan tepat dan terstruktur.</td>
              <td>Kognitif (C2/Memahami)</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${kelas.split('-')[0] || '7'}.2</td>
              <td>Pemahaman Konsep</td>
              <td>Melalui diskusi kolaboratif, peserta didik mampu menerapkan prinsip ${materiPokok} dalam menyelesaikan persoalan nyata dengan tingkat akurasi minimal 80%.</td>
              <td>Kognitif (C3/Menerapkan)</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${kelas.split('-')[0] || '7'}.3</td>
              <td>Keterampilan Proses</td>
              <td>Melalui studi kasus berbasis investigasi kelompok, peserta didik mampu menganalisis hubungan sebab-akibat pada ${materiPokok} secara mendalam dan kritis.</td>
              <td>Kognitif (C4/Menganalisis)</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp + 2} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${kelas.split('-')[0] || '7'}.4</td>
              <td>Keterampilan Proses</td>
              <td>Secara mandiri dan kreatif, peserta didik mampu menyajikan gagasan inovatif berupa laporan atau infografis terkait pemecahan masalah ${materiPokok}.</td>
              <td>Psikomotorik (P3/Menyajikan)</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background-color: #f8fafc;">
              <td colspan="4" style="text-align: right; padding-right: 12px;">TOTAL ALOKASI JP SEMESTER INI</td>
              <td style="text-align: center;">${alokasiJp * 3 + alokasiJp + 2} JP</td>
            </tr>
          </tfoot>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'ADM-ATP': {
      const title = `ALUR TUJUAN PEMBELAJARAN (ATP) - ${mapel.toUpperCase()} FASE ${fase}`;
      const gradeNum = kelas.split('-')[0] || '7';
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">ALUR TUJUAN PEMBELAJARAN (ADM-ATP)</h2>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px;">FORMAT RESMI A4 LANDSCAPE - KURIKULUM MERDEKA</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 12px; font-size: 9.5pt;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 15%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 33%;">${schoolConfig.namaSekolah}</td>
            <td style="border: none !important; width: 15%; font-weight: bold;">Fase / Kelas</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 33%;">Fase ${fase} / Kelas ${kelas}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${mapel}</td>
            <td style="border: none !important; font-weight: bold;">Tahun Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${schoolConfig.tahunPelajaran}</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-bottom: 6px; font-size: 10pt;">DIAGRAM VISUAL ALUR TUJUAN PEMBELAJARAN:</div>
        <div style="background-color: #f8fafc; border: 1px dashed #64748b; padding: 10px; border-radius: 4px; margin-bottom: 14px; text-align: center;">
          <span style="display: inline-block; background-color: #dbeafe; color: #1e3a8a; font-weight: bold; padding: 4px 10px; border-radius: 4px; border: 1px solid #93c5fd;">[Mulai] TP ${gradeNum}.1 (C2)</span>
          <span style="font-size: 14pt; color: #64748b; margin: 0 8px;">➔</span>
          <span style="display: inline-block; background-color: #dbeafe; color: #1e3a8a; font-weight: bold; padding: 4px 10px; border-radius: 4px; border: 1px solid #93c5fd;">TP ${gradeNum}.2 (C3)</span>
          <span style="font-size: 14pt; color: #64748b; margin: 0 8px;">➔</span>
          <span style="display: inline-block; background-color: #fef08a; color: #854d0e; font-weight: bold; padding: 4px 10px; border-radius: 4px; border: 1px solid #fde047;">TP ${gradeNum}.3 (C4 - Lanjutan)</span>
          <span style="font-size: 14pt; color: #64748b; margin: 0 8px;">➔</span>
          <span style="display: inline-block; background-color: #bbf7d0; color: #166534; font-weight: bold; padding: 4px 10px; border-radius: 4px; border: 1px solid #86efac;">TP ${gradeNum}.4 (P3/C5 - Final Proyek)</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr>
              <th style="width: 8%;">Kode TP</th>
              <th style="width: 12%;">Elemen</th>
              <th style="width: 28%;">Tujuan Pembelajaran (TP)</th>
              <th style="width: 18%;">Materi Pokok</th>
              <th style="width: 9%;">Level Bloom</th>
              <th style="width: 12%;">Profil Pelajar</th>
              <th style="width: 6%;">JP</th>
              <th style="width: 7%;">Semester</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.1</td>
              <td>Pemahaman Konsep</td>
              <td>Mengidentifikasi dan menjelaskan konsep dasar ${materiPokok} secara runut.</td>
              <td>Pengantar ${materiPokok}</td>
              <td style="text-align: center;">C2 (Memahami)</td>
              <td>Bernalar Kritis</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp}</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.2</td>
              <td>Pemahaman Konsep</td>
              <td>Menerapkan prinsip hitung dan penyelesaian masalah pada materi ${materiPokok}.</td>
              <td>Aplikasi ${materiPokok}</td>
              <td style="text-align: center;">C3 (Menerapkan)</td>
              <td>Mandiri</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp}</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.3</td>
              <td>Keterampilan Proses</td>
              <td>Menganalisis hubungan variabel serta implikasi kontekstual dari ${materiPokok}.</td>
              <td>Eksplorasi Lanjutan</td>
              <td style="text-align: center;">C4 (Menganalisis)</td>
              <td>Bernalar Kritis, Kreatif</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp + 2}</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.4</td>
              <td>Keterampilan Proses</td>
              <td>Menyajikan karya atau solusi praktis atas permasalahan ${materiPokok}.</td>
              <td>Gelar Karya / Proyek</td>
              <td style="text-align: center;">P3 / C5</td>
              <td>Gotong Royong, Kreatif</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp}</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background-color: #f1f5f9;">
              <td colspan="6" style="text-align: right; padding-right: 10px;">TOTAL ALOKASI JP EFEKTIF PEMBELAJARAN</td>
              <td style="text-align: center;">${alokasiJp * 3 + alokasiJp + 2}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'landscape', title };
    }

    case 'ADM-PROTA': {
      const title = `PROGRAM TAHUNAN (PROTA) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const gradeNum = kelas.split('-')[0] || '7';
      const jpPerWeek = alokasiJp;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">PROGRAM TAHUNAN (ADM-PROTA)</h2>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px;">TAHUN PELAJARAN ${schoolConfig.tahunPelajaran}</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 14px;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 18%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">${schoolConfig.namaSekolah}</td>
            <td style="border: none !important; width: 18%; font-weight: bold;">Kelas / Fase</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">${kelas} / Fase ${fase}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${mapel}</td>
            <td style="border: none !important; font-weight: bold;">Beban Jam / Minggu</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${jpPerWeek} JP / Minggu</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-bottom: 6px; font-size: 11pt;">I. DISTRIBUSI ALOKASI WAKTU MINGGU EFEKTIF</div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr>
              <th style="width: 10%;">Semester</th>
              <th style="width: 20%;">Jumlah Minggu Kalender</th>
              <th style="width: 25%;">Minggu Tidak Efektif</th>
              <th style="width: 25%;">Jumlah Minggu Efektif</th>
              <th style="width: 20%;">Total JP (${jpPerWeek} JP/Mgg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">1 (Ganjil)</td>
              <td style="text-align: center;">26 Minggu</td>
              <td style="text-align: center;">8 Minggu (MPLS, PTS, PAS, Libur)</td>
              <td style="text-align: center; font-weight: bold;">18 Minggu</td>
              <td style="text-align: center; font-weight: bold;">${18 * jpPerWeek} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">2 (Genap)</td>
              <td style="text-align: center;">26 Minggu</td>
              <td style="text-align: center;">10 Minggu (Libur, US, PAT, Rapor)</td>
              <td style="text-align: center; font-weight: bold;">16 Minggu</td>
              <td style="text-align: center; font-weight: bold;">${16 * jpPerWeek} JP</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="text-align: center;">TOTAL TAHUNAN</td>
              <td style="text-align: center;">52 Minggu</td>
              <td style="text-align: center;">18 Minggu</td>
              <td style="text-align: center;">34 Minggu</td>
              <td style="text-align: center;">${34 * jpPerWeek} JP</td>
            </tr>
          </tbody>
        </table>

        <div style="font-weight: bold; margin-bottom: 6px; font-size: 11pt;">II. MATRIKS RENCANA PROGRAM TAHUNAN</div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="width: 8%;">Smt</th>
              <th style="width: 12%;">No / Kode TP</th>
              <th style="width: 48%;">Materi Pokok & Deskripsi Tujuan Pembelajaran</th>
              <th style="width: 16%;">Alokasi Waktu</th>
              <th style="width: 16%;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="5" style="text-align: center; font-weight: bold; vertical-align: top;">1 (Ganjil)</td>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.1</td>
              <td>Memahami konsep esensial dan pengantar materi ${materiPokok}.</td>
              <td style="text-align: center;">${jpPerWeek * 3} JP</td>
              <td>Pembelajaran Reguler</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.2</td>
              <td>Menerapkan prinsip analisis perhitungan dan pemecahan masalah ${materiPokok}.</td>
              <td style="text-align: center;">${jpPerWeek * 4} JP</td>
              <td>Pembelajaran Reguler</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.3</td>
              <td>Menganalisis hubungan konseptual dan penyelidikan kasus kontekstual.</td>
              <td style="text-align: center;">${jpPerWeek * 5} JP</td>
              <td>Pembelajaran Berbasis Proyek</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.4</td>
              <td>Menyajikan karya kreatif dan gelar portofolio unjuk kerja peserta didik.</td>
              <td style="text-align: center;">${jpPerWeek * 4} JP</td>
              <td>Unjuk Kerja & Asesmen</td>
            </tr>
            <tr style="background-color: #fef9c3; font-weight: bold;">
              <td style="text-align: center;">CADANGAN</td>
              <td><strong>JAM CADANGAN SEMESTER GANJIL</strong> (Remedial, Pengayaan, & Antisipasi Jam Hilang)</td>
              <td style="text-align: center;">${(18 * jpPerWeek) - (jpPerWeek * 16)} JP</td>
              <td>Waktu Cadangan</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td colspan="3" style="text-align: right; padding-right: 12px;">SUBTOTAL SEMESTER 1 (GANJIL)</td>
              <td style="text-align: center;">${18 * jpPerWeek} JP</td>
              <td>18 Minggu Efektif</td>
            </tr>
            <tr>
              <td rowspan="3" style="text-align: center; font-weight: bold; vertical-align: top;">2 (Genap)</td>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.5</td>
              <td>Mengevaluasi fenomena lanjutan dan integrasi antarelemen materi.</td>
              <td style="text-align: center;">${jpPerWeek * 7} JP</td>
              <td>Pembelajaran Reguler</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.6</td>
              <td>Menciptakan karya inovasi berbasis kontekstual dan asesmen sumatif akhir jenjang.</td>
              <td style="text-align: center;">${jpPerWeek * 7} JP</td>
              <td>Proyek & Asesmen</td>
            </tr>
            <tr style="background-color: #fef9c3; font-weight: bold;">
              <td style="text-align: center;">CADANGAN</td>
              <td><strong>JAM CADANGAN SEMESTER GENAP</strong> (Pemantapan & Pengayaan Akhir Tahun)</td>
              <td style="text-align: center;">${(16 * jpPerWeek) - (jpPerWeek * 14)} JP</td>
              <td>Waktu Cadangan</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td colspan="3" style="text-align: right; padding-right: 12px;">SUBTOTAL SEMESTER 2 (GENAP)</td>
              <td style="text-align: center;">${16 * jpPerWeek} JP</td>
              <td>16 Minggu Efektif</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background-color: #e2e8f0; font-size: 10.5pt;">
              <td colspan="3" style="text-align: right; padding-right: 12px;">TOTAL ALOKASI WAKTU 1 TAHUN PELAJARAN</td>
              <td style="text-align: center;">${34 * jpPerWeek} JP</td>
              <td>34 Minggu Efektif</td>
            </tr>
          </tfoot>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'ADM-PROSEM': {
      const title = `PROGRAM SEMESTER (PROSEM) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const gradeNum = kelas.split('-')[0] || '7';
      const jpPerWeek = alokasiJp;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 14px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">PROGRAM SEMESTER (ADM-PROSEM) - FORMAT RESMI A4 LANDSCAPE</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px;">SEMESTER ${semester.toUpperCase()} - TAHUN PELAJARAN ${schoolConfig.tahunPelajaran}</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 10px; font-size: 9.5pt;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 15%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 33%;">${schoolConfig.namaSekolah}</td>
            <td style="border: none !important; width: 15%; font-weight: bold;">Kelas / Fase</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 33%;">${kelas} / Fase ${fase}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${mapel}</td>
            <td style="border: none !important; font-weight: bold;">Alokasi JP / Minggu</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${jpPerWeek} Jam Pelajaran</td>
          </tr>
        </table>

        <div style="display: flex; gap: 12px; margin-bottom: 10px; font-size: 8.5pt; font-weight: bold;">
          <div style="padding: 3px 8px; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 3px;">Biru: JP Pembelajaran</div>
          <div style="padding: 3px 8px; background-color: #fef08a; border: 1px solid #fde047; border-radius: 3px;">Kuning: STS / PTS</div>
          <div style="padding: 3px 8px; background-color: #bbf7d0; border: 1px solid #86efac; border-radius: 3px;">Hijau: SAS / PAS</div>
          <div style="padding: 3px 8px; background-color: #fecaca; border: 1px solid #fca5a5; border-radius: 3px;">Merah: Libur Semester / Nasional</div>
          <div style="padding: 3px 8px; background-color: #e2e8f0; border: 1px solid #cbd5e1; border-radius: 3px;">Abu-abu: Jam Cadangan</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 8pt; text-align: center;">
          <thead>
            <tr>
              <th rowspan="2" style="width: 5%;">No</th>
              <th rowspan="2" style="width: 25%;">Tujuan Pembelajaran / Materi Pokok</th>
              <th rowspan="2" style="width: 5%;">Jml JP</th>
              <th colspan="4">Juli</th>
              <th colspan="5">Agustus</th>
              <th colspan="4">September</th>
              <th colspan="5">Oktober</th>
              <th colspan="4">November</th>
              <th colspan="5">Desember</th>
              <th rowspan="2" style="width: 14%;">Model Pembelajaran</th>
            </tr>
            <tr style="font-size: 7.5pt;">
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td style="text-align: left; font-weight: bold;">MPLS & Asesmen Diagnostik Awal</td>
              <td>-</td>
              <td class="bg-red">L</td><td class="bg-yellow">M</td><td class="bg-yellow">M</td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td>Orientasi & Refleksi</td>
            </tr>
            <tr>
              <td>2</td>
              <td style="text-align: left;"><strong>TP ${gradeNum}.1</strong>: Memahami konsep dasar ${materiPokok}</td>
              <td style="font-weight: bold;">${jpPerWeek * 3}</td>
              <td></td><td></td><td></td><td class="bg-blue">${jpPerWeek}</td>
              <td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td>Discovery Learning</td>
            </tr>
            <tr>
              <td>3</td>
              <td style="text-align: left;"><strong>TP ${gradeNum}.2</strong>: Menerapkan prinsip analisis perhitungan</td>
              <td style="font-weight: bold;">${jpPerWeek * 4}</td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td>
              <td class="bg-blue">${jpPerWeek}</td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td>Problem-Based Learning</td>
            </tr>
            <tr>
              <td>4</td>
              <td style="text-align: left; font-weight: bold;">Sumatif Tengah Semester (STS)</td>
              <td>-</td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td class="bg-yellow">STS</td><td class="bg-yellow">STS</td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td>Tes Tertulis & Kinerja</td>
            </tr>
            <tr>
              <td>5</td>
              <td style="text-align: left;"><strong>TP ${gradeNum}.3</strong>: Menganalisis investigasi & studi kasus</td>
              <td style="font-weight: bold;">${jpPerWeek * 5}</td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td class="bg-blue">${jpPerWeek}</td>
              <td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td>Project-Based Learning</td>
            </tr>
            <tr>
              <td>6</td>
              <td style="text-align: left;"><strong>TP ${gradeNum}.4</strong>: Gelar karya dan unjuk kerja kreatif</td>
              <td style="font-weight: bold;">${jpPerWeek * 4}</td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td class="bg-blue">${jpPerWeek}</td>
              <td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td>Deep Learning & Proyek</td>
            </tr>
            <tr>
              <td>7</td>
              <td style="text-align: left; font-weight: bold;">Jam Cadangan / Remedial / Pengayaan</td>
              <td style="font-weight: bold;">${jpPerWeek * 2}</td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td class="bg-gray">${jpPerWeek}</td>
              <td class="bg-gray">${jpPerWeek}</td><td></td><td></td><td></td><td></td>
              <td>Klinik Belajar</td>
            </tr>
            <tr>
              <td>8</td>
              <td style="text-align: left; font-weight: bold;">Sumatif Akhir Semester (SAS) & Rapor</td>
              <td>-</td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td class="bg-green">SAS</td><td class="bg-green">SAS</td><td class="bg-yellow">Rapor</td><td class="bg-red">Libur</td>
              <td>Evaluasi Menyeluruh</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'landscape', title };
    }

    case 'ADM-KKTP': {
      const title = `KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const gradeNum = kelas.split('-')[0] || '7';
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (ADM-KKTP)</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px;">FORMAT RESMI A4 LANDSCAPE - SESUAI PERMENDIKBUDRISTEK NO. 21 TAHUN 2022</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 12px; font-size: 9.5pt;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 15%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 33%;">${schoolConfig.namaSekolah}</td>
            <td style="border: none !important; width: 15%; font-weight: bold;">Kelas / Fase</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 33%;">${kelas} / Fase ${fase}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${mapel}</td>
            <td style="border: none !important; font-weight: bold;">Tahun Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${schoolConfig.tahunPelajaran}</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-bottom: 4px; font-size: 10pt;">I. DASAR HUKUM & DESKRIPSI INTERVAL CAPAIAN:</div>
        <p style="margin: 0 0 10px 0; font-size: 9pt;">
          Berdasarkan Panduan Pembelajaran dan Asesmen Kurikulum Merdeka (Kemendikbudristek 2022), ketercapaian kompetensi diukur melalui 4 tingkatan:
          <strong>(1) Mulai Berkembang (0-69%)</strong>: Perlu bimbingan intensif; 
          <strong>(2) Layak (✓ KKTP 70-79%)</strong>: Mencapai ketuntasan minimum kompetensi; 
          <strong>(3) Cakap (80-89%)</strong>: Menguasai secara mandiri dengan baik; 
          <strong>(4) Mahir (90-100%)</strong>: Menguasai secara komprehensif dan mampu menularkan kepada rekan sebaya.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
          <thead>
            <tr>
              <th rowspan="2" style="width: 8%;">Kode TP</th>
              <th rowspan="2" style="width: 22%;">Tujuan Pembelajaran</th>
              <th rowspan="2" style="width: 22%;">Indikator Ketercapaian TP (IKTP)</th>
              <th colspan="4" style="width: 36%;">Kriteria / Interval Ketercapaian</th>
              <th rowspan="2" style="width: 12%;">Tindak Lanjut Rekomendasi</th>
            </tr>
            <tr style="font-size: 8pt;">
              <th style="width: 9%; background-color: #fee2e2;">Mulai Berkembang (0-69%)</th>
              <th style="width: 9%; background-color: #dbeafe;">Layak ✓ (70-79%)</th>
              <th style="width: 9%; background-color: #fef08a;">Cakap (80-89%)</th>
              <th style="width: 9%; background-color: #dcfce7;">Mahir (90-100%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.1</td>
              <td>Memahami konsep dasar dan terminologi ${materiPokok}.</td>
              <td>
                1. Menyebutkan definisi istilah utama.<br>
                2. Menjelaskan prinsip dasar dengan kata-kata sendiri.
              </td>
              <td>Belum mampu menjelaskan konsep esensial tanpa bantuan penuh guru.</td>
              <td>Mampu menjelaskan sebagian besar konsep esensial dengan bantuan sesekali.</td>
              <td>Mampu menjelaskan seluruh konsep secara mandiri, runtut, dan benar.</td>
              <td>Mampu menganalisis contoh kasus baru serta membimbing teman sebaya.</td>
              <td>Peserta didik pada kategori Mulai Berkembang diberikan remidial modul ajar terfokus.</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.2</td>
              <td>Menerapkan prosedur pemecahan masalah pada materi ${materiPokok}.</td>
              <td>
                1. Menuliskan langkah penyelesaian secara tepat.<br>
                2. Menghasilkan jawaban yang akurat.
              </td>
              <td>Langkah pengerjaan belum runtut dan hasil akhir masih banyak kekeliruan.</td>
              <td>Langkah pengerjaan runtut dengan hasil akhir mencapai akurasi minimal 75%.</td>
              <td>Langkah kerja sangat teratur dan hasil akhir akurat secara mandiri.</td>
              <td>Mampu menemukan cara penyelesaian alternatif yang lebih efektif dan efisien.</td>
              <td>Diberikan pengayaan problem-solving kontekstual untuk kategori Cakap dan Mahir.</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP ${gradeNum}.3</td>
              <td>Menganalisis studi kasus nyata terkait implikasi ${materiPokok}.</td>
              <td>
                1. Mengidentifikasi variabel masalah.<br>
                2. Memberikan argumen logis dan solusi alternatif.
              </td>
              <td>Belum mampu membedakan variabel pokok dalam kasus yang disajikan.</td>
              <td>Mampu memetakan variabel pokok dan mengajukan 1 usulan solusi dasar.</td>
              <td>Mampu menganalisis hubungan antarvariabel serta memberikan argumen logis.</td>
              <td>Menghasilkan evaluasi kritis mendalam dan solusi inovatif berwawasan luas.</td>
              <td>Pembelajaran kelompok tutor sebaya dipimpin peserta didik level Mahir.</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'landscape', title };
    }

    case 'MODUL-AJAR': {
      const title = `MODUL AJAR KURIKULUM MERDEKA (DEEP LEARNING) - ${mapel.toUpperCase()}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">MODUL AJAR KURIKULUM MERDEKA</h2>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 3px; color: #1e3a8a;">BERBASIS DEEP LEARNING (MINDFUL, MEANINGFUL, & JOYFUL LEARNING)</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <th colspan="4" style="background-color: #f1f5f9; text-align: left; padding: 6px 10px;">A. INFORMASI UMUM</th>
          </tr>
          <tr>
            <td style="width: 25%; font-weight: bold;">Nama Penyusun</td>
            <td style="width: 25%;">${namaGuru}</td>
            <td style="width: 25%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="width: 25%;">${schoolConfig.namaSekolah}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Tahun Penyusunan</td>
            <td>${schoolConfig.tahunPelajaran}</td>
            <td style="font-weight: bold;">Jenjang / Kelas</td>
            <td>SMP / Kelas ${kelas}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Mata Pelajaran</td>
            <td>${mapel}</td>
            <td style="font-weight: bold;">Alokasi Waktu</td>
            <td>${alokasiJp} Jam Pelajaran (1 Pertemuan)</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Kompetensi Awal</td>
            <td colspan="3">Peserta didik telah memahami pengantar dasar materi dan operasi logika sederhana.</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Profil Pelajar Pancasila</td>
            <td colspan="3">1. Beriman & Bertakwa, 2. Bernalar Kritis, 3. Gotong Royong, 4. Kreatif, 5. Mandiri.</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Sarana & Prasarana</td>
            <td colspan="3">LCD Proyektor, LKPD Terstruktur, Video Pembelajaran, Laptop/Gadget, Bahan Ajar Kontekstual.</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Model Pembelajaran</td>
            <td colspan="3"><strong>${modelPembelajaran}</strong> Terintegrasi Deep Learning (Mindful, Meaningful, & Joyful Learning).</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <th colspan="2" style="background-color: #f1f5f9; text-align: left; padding: 6px 10px;">B. KOMPONEN INTI</th>
          </tr>
          <tr>
            <td style="width: 25%; font-weight: bold;">Tujuan Pembelajaran</td>
            <td>Peserta didik mampu memahami konsep esensial, menganalisis fenomena kontekstual, dan memecahkan persoalan nyata terkait ${materiPokok} dengan tepat.</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Pemahaman Bermakna (Meaningful)</td>
            <td>Pemahaman atas ${materiPokok} membantu peserta didik membuat keputusan logis dan bertanggung jawab dalam kehidupan sehari-hari.</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Pertanyaan Pemantik</td>
            <td><em>"Bagaimana cara kita mengetahui dampak nyata fenomena ${materiPokok} dalam lingkungan sekitar kita saat ini?"</em></td>
          </tr>
        </table>

        <div style="font-weight: bold; margin: 12px 0 6px 0; font-size: 11pt;">C. KEGIATAN PEMBELAJARAN (DEEP LEARNING WORKFLOW)</div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="width: 20%;">Tahapan</th>
              <th style="width: 65%;">Aktivitas Guru & Peserta Didik</th>
              <th style="width: 15%;">Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">Pendahuluan<br><span style="font-size: 8.5pt; color: #0284c7;">(Mindful Learning)</span></td>
              <td>
                1. Guru membuka dengan salam santun, doa bersama, dan presensi.<br>
                2. <strong>Mindful Moment</strong>: Guru mengajak teknik STOP (Stop, Take a breath, Observe, Proceed) selama 2 menit agar peserta didik hadir utuh secara fisik dan mental.<br>
                3. Apersepsi bermakna mengaitkan materi dengan pengalaman nyata peserta didik.<br>
                4. Penyampaian tujuan pembelajaran dan kriteria keberhasilan.
              </td>
              <td style="text-align: center;">15 Menit</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Kegiatan Inti<br><span style="font-size: 8.5pt; color: #16a34a;">(Meaningful & Joyful)</span></td>
              <td>
                <strong>Fase 1 - Orientasi Masalah:</strong> Guru menyajikan video/studi kasus kontekstual mengenai ${materiPokok}. Peserta didik menanggapi dengan antusias.<br>
                <strong>Fase 2 - Pengorganisasian Belajar:</strong> Pembagian kelompok diferensiasi sesuai minat dan kesiapan belajar.<br>
                <strong>Fase 3 - Penyelidikan Mandiri/Kelompok:</strong> Peserta didik mengeksplorasi LKPD dengan bimbingan scaffolded dari guru.<br>
                <strong>Fase 4 - Mengembangkan & Menyajikan Hasil:</strong> Setiap kelompok menyajikan solusi kreatif (infografis/sketsa/paparan lisan).<br>
                <strong>Fase 5 - Joyful Reflection:</strong> Games kuis interaktif singkat yang menyenangkan untuk menguji pemahaman esensial.
              </td>
              <td style="text-align: center;">50 Menit</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Penutup<br><span style="font-size: 8.5pt; color: #9333ea;">(Refleksi & Apresiasi)</span></td>
              <td>
                1. Peserta didik bersama guru menyimpulkan inti pembelajaran.<br>
                2. Refleksi 3-2-1: 3 hal baru yang dipelajari, 2 hal yang paling menarik, 1 hal yang ingin ditanyakan lagi.<br>
                3. Apresiasi kinerja kolaboratif seluruh kelas dan doa penutup.
              </td>
              <td style="text-align: center;">15 Menit</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'ASESMEN-SUMATIF': {
      const title = `ASESMEN SUMATIF LINGKUP MATERI - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="font-size: 13pt; margin: 0; text-transform: uppercase;">NASKAH ASESMEN SUMATIF LINGKUP MATERI (HOTS)</h2>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px;">KURIKULUM MERDEKA - TAHUN PELAJARAN ${schoolConfig.tahunPelajaran}</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 16px; font-size: 10pt;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 18%; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">${mapel}</td>
            <td style="border: none !important; width: 18%; font-weight: bold;">Nama Siswa</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">........................................</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Kelas / Semester</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${kelas} / ${semester}</td>
            <td style="border: none !important; font-weight: bold;">Nomor Absen</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">........................................</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Materi Pokok</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${materiPokok}</td>
            <td style="border: none !important; font-weight: bold;">Waktu Pengerjaan</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">80 Menit</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-bottom: 6px;">BAGIAN I: PILIHAN GANDA BERBOBOT TINGGI (HOTS)</div>
        <p style="margin: 0 0 10px 0; font-size: 9.5pt;">Pilihlah salah satu jawaban yang paling tepat dengan memberikan tanda silang (X) pada huruf A, B, C, atau D!</p>
        
        <div style="margin-bottom: 12px; font-size: 10pt;">
          <div><strong>1. Stimulus Konseptual:</strong> Perhatikan fenomena pada materi ${materiPokok}. Dalam sebuah situasi uji coba, terjadi perubahan kondisi yang memengaruhi hasil akhir secara signifikan. Berdasarkan prinsip keteraturan yang telah dipelajari, manakah tindakan analisis yang paling valid untuk membuktikan hipotesis tersebut?</div>
          <div style="margin-left: 18px; margin-top: 4px;">
            A. Mengabaikan variabel pengganggu dan langsung mengambil kesimpulan awal.<br>
            B. Memisahkan variabel bebas, variabel terikat, dan variabel kontrol lalu menguji ulang secara terukur.<br>
            C. Mengganti seluruh data uji dengan estimasi teoretis tanpa verifikasi empiris.<br>
            D. Menyerahkan hasil pengamatan kepada pihak lain tanpa dokumentasi catatan proses.
          </div>
        </div>

        <div style="margin-bottom: 12px; font-size: 10pt;">
          <div><strong>2. Aplikasi Praktis:</strong> Ketika seseorang mengaplikasikan konsep ${materiPokok} dalam situasi lingkungan nyata di sekolah, kendala utama yang sering dihadapi adalah keterbatasan sumber daya. Strategi pemecahan masalah yang paling tepat dan bernalar kritis adalah...</div>
          <div style="margin-left: 18px; margin-top: 4px;">
            A. Menghentikan program sampai dana tambahan tersedia sepenuhnya.<br>
            B. Menggunakan model inovasi sederhana berbasis daur ulang dan kolaborasi gotong royong.<br>
            C. Mengurangi jumlah anggota kelompok hingga tersisa satu orang saja.<br>
            D. Menghilangkan tahapan evaluasi agar kegiatan selesai lebih cepat.
          </div>
        </div>

        <div style="font-weight: bold; margin: 16px 0 6px 0;">BAGIAN II: SOAL URAIAN ANALITIS & REFLEKTIF</div>
        <div style="margin-bottom: 10px; font-size: 10pt;">
          <div><strong>1.</strong> Jelaskan hubungan sebab-akibat antara pemahaman konsep ${materiPokok} dengan kemampuan pengambilan keputusan yang bertanggung jawab! Sertakan contoh konkret di lingkungan Anda.</div>
          <div style="height: 60px; border-bottom: 1px dotted #94a3b8; margin-top: 6px;"></div>
        </div>
        <div style="margin-bottom: 10px; font-size: 10pt;">
          <div><strong>2.</strong> Rancanglah satu ide perbaikan sederhana apabila konsep ${materiPokok} tersebut diterapkan untuk memajukan kehidupan masyarakat sekitar!</div>
          <div style="height: 60px; border-bottom: 1px dotted #94a3b8; margin-top: 6px;"></div>
        </div>

        <div style="font-weight: bold; margin: 18px 0 6px 0;">RUBRIK PENSKORAN & KUNCI JAWABAN:</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr>
              <th style="width: 15%;">Bagian</th>
              <th style="width: 25%;">Bentuk Soal</th>
              <th style="width: 20%;">Kunci Jawaban</th>
              <th style="width: 20%;">Skor Maksimal</th>
              <th style="width: 20%;">Bobot Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bagian I</td>
              <td>Pilihan Ganda (HOTS)</td>
              <td>1. B, 2. B</td>
              <td style="text-align: center;">20 (10/soal)</td>
              <td style="text-align: center;">40%</td>
            </tr>
            <tr>
              <td>Bagian II</td>
              <td>Uraian Analitis</td>
              <td>Rubrik terlampir (Argumen + Bukti)</td>
              <td style="text-align: center;">30 (15/soal)</td>
              <td style="text-align: center;">60%</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td colspan="3" style="text-align: right; padding-right: 12px;">TOTAL NILAI AKHIR SUMATIF</td>
              <td style="text-align: center;">50</td>
              <td style="text-align: center;">100%</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    // ==========================================
    // KURIKULUM BERBASIS CINTA (KBC & PPRA)
    // ==========================================
    case 'ACP-KBC': {
      const title = `ANALISIS CAPAIAN PEMBELAJARAN KBC (ACP-KBC) - ${mapel.toUpperCase()} FASE ${fase}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">ANALISIS CAPAIAN PEMBELAJARAN BERBASIS CINTA (ACP-KBC)</h2>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 3px; color: #9f1239;">TERINTEGRASI PANCA CINTA & 10 NILAI PROFIL PELAJAR RAHMATAN LIL 'ALAMIN (PPRA)</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 14px;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 20%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="border: none !important; width: 3%;">:</td>
            <td style="border: none !important; width: 27%;">${schoolConfig.namaSekolah}</td>
            <td style="border: none !important; width: 20%; font-weight: bold;">Fase / Kelas</td>
            <td style="border: none !important; width: 3%;">:</td>
            <td style="border: none !important; width: 27%;">Fase ${fase} / Kelas ${kelas}</td>
          </tr>
          <tr style="border: none !important;">
            <td style="border: none !important; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${mapel} (Terpadu KBC)</td>
            <td style="border: none !important; font-weight: bold;">Tahun Pelajaran</td>
            <td style="border: none !important;">:</td>
            <td style="border: none !important;">${schoolConfig.tahunPelajaran}</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-bottom: 4px; font-size: 11pt;">I. FILOSOFI & LANDASAN KURIKULUM BERBASIS CINTA (KBC)</div>
        <p style="text-align: justify; text-indent: 28px; margin: 4px 0 10px 0;">
          Kurikulum Berbasis Cinta (KBC) memandang pendidikan sebagai proses penyemaian kasih sayang semesta (<em>rahmatan lil 'alamin</em>). Seluruh proses pembelajaran ${mapel} pada Fase ${fase} mengintegrasikan <strong>Panca Cinta</strong>: (1) Cinta Allah & Rasul-Nya, (2) Cinta Diri Sendiri & Sesama, (3) Cinta Ilmu Pengetahuan & Kebenaran, (4) Cinta Bangsa & Tanah Air, serta (5) Cinta Lingkungan & Alam Semesta.
        </p>

        <div style="font-weight: bold; margin-bottom: 4px; font-size: 11pt;">II. MATRIKS INTEGRASI CP KBC & 10 NILAI PPRA</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
          <thead>
            <tr>
              <th style="width: 18%;">Elemen Mapel</th>
              <th style="width: 32%;">Capaian Pembelajaran (CP)</th>
              <th style="width: 25%;">Integrasi Panca Cinta</th>
              <th style="width: 25%;">Integrasi Nilai PPRA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">Pemahaman Konsep</td>
              <td>Peserta didik mampu memahami keteraturan sistematis dalam ${materiPokok} sebagai bukti keagungan ciptaan Ilahi.</td>
              <td><strong>Cinta Allah & Rasul</strong> (Tafakkur ayat kauniyah) & <strong>Cinta Ilmu</strong></td>
              <td><em>Berkeadaban (Ta'addub)</em>, <em>Keteladanan (Qudwah)</em></td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Keterampilan Proses & Aksi</td>
              <td>Peserta didik mampu berkolaborasi memecahkan masalah kontekstual dengan empati, kesantunan, dan kepedulian lingkungan.</td>
              <td><strong>Cinta Sesama</strong> & <strong>Cinta Lingkungan Hidup</strong></td>
              <td><em>Musyawarah (Syura)</em>, <em>Toleransi (Tasamuh)</em>, <em>Dinamis & Inovatif (Tathawwur wa Ibtikar)</em></td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'TP-KBC': {
      const title = `TUJUAN PEMBELAJARAN KBC (TP-KBC) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const gradeNum = kelas.split('-')[0] || '7';
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">PERUMUSAN TUJUAN PEMBELAJARAN KBC (TP-KBC)</h2>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px; color: #9f1239;">PENDEKATAN PANCA CINTA & NILAI RAHMATAN LIL 'ALAMIN</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 14px;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 18%; font-weight: bold;">Mata Pelajaran</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">${mapel}</td>
            <td style="border: none !important; width: 18%; font-weight: bold;">Kelas / Semester</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">${kelas} / ${semester}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="width: 10%;">Kode TP</th>
              <th style="width: 40%;">Rumusan Tujuan Pembelajaran KBC</th>
              <th style="width: 25%;">Fokus Panca Cinta</th>
              <th style="width: 15%;">Nilai PPRA</th>
              <th style="width: 10%;">Alokasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC ${gradeNum}.1</td>
              <td>Melalui perenungan tadabbur, peserta didik mampu mengagumi dan menjelaskan konsep dasar ${materiPokok} dengan penuh rasa syukur.</td>
              <td>Cinta Allah & Cinta Ilmu Pengetahuan</td>
              <td><em>Ta'addub & Qudwah</em></td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC ${gradeNum}.2</td>
              <td>Melalui kerja sama empatik, peserta didik mampu menyelesaikan permasalahan ${materiPokok} dengan saling menghargai pendapat.</td>
              <td>Cinta Diri & Sesama Insan</td>
              <td><em>Tasamuh & Syura</em></td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC ${gradeNum}.3</td>
              <td>Peserta didik mampu mengaplikasikan ilmu ${materiPokok} untuk merawat kelestarian lingkungan sekolah dengan ramah dan penuh cinta.</td>
              <td>Cinta Lingkungan & Alam Semesta</td>
              <td><em>Ishlah & Tathawwur</em></td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp + 2} JP</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'ATP-KBC': {
      const title = `ALUR TUJUAN PEMBELAJARAN KBC (ATP-KBC) - ${mapel.toUpperCase()} FASE ${fase}`;
      const gradeNum = kelas.split('-')[0] || '7';
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">ALUR TUJUAN PEMBELAJARAN KURIKULUM BERBASIS CINTA (ATP-KBC)</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px; color: #9f1239;">FORMAT RESMI A4 LANDSCAPE TERINTEGRASI PANCA CINTA & PPRA</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr>
              <th style="width: 8%;">Kode</th>
              <th style="width: 25%;">Tujuan Pembelajaran KBC</th>
              <th style="width: 18%;">Materi Pokok</th>
              <th style="width: 18%;">Panca Cinta & Karakter Kasih</th>
              <th style="width: 15%;">Nilai PPRA Terpadu</th>
              <th style="width: 8%;">Alokasi JP</th>
              <th style="width: 8%;">Semester</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC ${gradeNum}.1</td>
              <td>Menjelaskan fenomena ${materiPokok} dengan penuh rasa takjub atas keteraturan alam semesta.</td>
              <td>Pengenalan ${materiPokok}</td>
              <td>Cinta Allah & Kebenaran Ilmu</td>
              <td>Ta'addub (Berkeadaban)</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC ${gradeNum}.2</td>
              <td>Menerapkan prinsip ${materiPokok} dalam kolaborasi saling mengasihi dan menguatkan rekan sebaya.</td>
              <td>Praktik Pemecahan Masalah</td>
              <td>Cinta Sesama Insan</td>
              <td>Tasamuh & Syura</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp} JP</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC ${gradeNum}.3</td>
              <td>Menciptakan karya cinta lingkungan nyata berbasis implementasi konsep ${materiPokok}.</td>
              <td>Karya Cinta Lingkungan</td>
              <td>Cinta Lingkungan & Bangsa</td>
              <td>Ishlah (Perbaikan Semesta)</td>
              <td style="text-align: center; font-weight: bold;">${alokasiJp + 2} JP</td>
              <td style="text-align: center;">${semester}</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'landscape', title };
    }

    case 'PROTA-KBC': {
      const title = `PROGRAM TAHUNAN KBC (PROTA-KBC) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const jpPerWeek = alokasiJp;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">PROGRAM TAHUNAN BERBASIS CINTA (PROTA-KBC)</h2>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px; color: #9f1239;">INTEGRASI SPIRITUALITAS, KEMANUSIAAN, DAN NILAI PPRA</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
          <thead>
            <tr>
              <th style="width: 8%;">Smt</th>
              <th style="width: 14%;">Kode TP</th>
              <th style="width: 44%;">Deskripsi Pembelajaran KBC</th>
              <th style="width: 20%;">Pilar Panca Cinta</th>
              <th style="width: 14%;">Alokasi Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="3" style="text-align: center; font-weight: bold;">Ganjil</td>
              <td style="text-align: center; font-weight: bold;">TP-KBC 7.1</td>
              <td>Membangun kesadaran cinta belajar melalui eksplorasi materi ${materiPokok}.</td>
              <td>Cinta Allah & Ilmu</td>
              <td style="text-align: center;">${jpPerWeek * 7} JP</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC 7.2</td>
              <td>Praktik kolaborasi peduli sesama dalam pemecahan masalah kontekstual.</td>
              <td>Cinta Sesama Insan</td>
              <td style="text-align: center;">${jpPerWeek * 8} JP</td>
            </tr>
            <tr style="background-color: #fef9c3; font-weight: bold;">
              <td style="text-align: center;">CADANGAN</td>
              <td>Jam Cadangan Penguatan Karakter Cinta & Konseling Kasih Sayang</td>
              <td>Panca Cinta Terpadu</td>
              <td style="text-align: center;">${jpPerWeek * 3} JP</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td colspan="4" style="text-align: right; padding-right: 12px;">TOTAL SEMESTER GANJIL</td>
              <td style="text-align: center;">${jpPerWeek * 18} JP</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'PROSEM-KBC': {
      const title = `PROGRAM SEMESTER KBC (PROSEM-KBC) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const jpPerWeek = alokasiJp;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 14px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">PROGRAM SEMESTER KURIKULUM BERBASIS CINTA (PROSEM-KBC)</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px; color: #9f1239;">FORMAT RESMI A4 LANDSCAPE - MATRIKS JP PANCA CINTA & PPRA</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 8pt; text-align: center;">
          <thead>
            <tr>
              <th rowspan="2" style="width: 5%;">No</th>
              <th rowspan="2" style="width: 25%;">Tujuan Pembelajaran KBC</th>
              <th rowspan="2" style="width: 15%;">Fokus Panca Cinta</th>
              <th rowspan="2" style="width: 6%;">JP</th>
              <th colspan="4">Bulan 1</th>
              <th colspan="4">Bulan 2</th>
              <th colspan="4">Bulan 3</th>
              <th colspan="4">Bulan 4</th>
              <th colspan="4">Bulan 5</th>
              <th rowspan="2" style="width: 15%;">Model Sentuhan Kasih</th>
            </tr>
            <tr style="font-size: 7.5pt;">
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td style="text-align: left; font-weight: bold;">Tadabbur Lingkungan & Cinta Allah</td>
              <td>Cinta Allah & Alam</td>
              <td style="font-weight: bold;">${jpPerWeek * 2}</td>
              <td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td>Mindful Reflection</td>
            </tr>
            <tr>
              <td>2</td>
              <td style="text-align: left; font-weight: bold;">Studi ${materiPokok} Peduli Teman</td>
              <td>Cinta Diri & Sesama</td>
              <td style="font-weight: bold;">${jpPerWeek * 4}</td>
              <td></td><td></td><td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td>
              <td class="bg-blue">${jpPerWeek}</td><td class="bg-blue">${jpPerWeek}</td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td><td></td>
              <td>Emphatic Group Work</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'landscape', title };
    }

    case 'KKTP-KBC': {
      const title = `KRITERIA KETERCAPAIAN TP KBC (KKTP-KBC) - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN KBC (KKTP-KBC)</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px; color: #9f1239;">FORMAT RESMI A4 LANDSCAPE - RUBRIK KASIH & KARAKTER PPRA</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
          <thead>
            <tr>
              <th rowspan="2" style="width: 8%;">Kode</th>
              <th rowspan="2" style="width: 22%;">Tujuan Pembelajaran</th>
              <th rowspan="2" style="width: 22%;">Indikator Sikap & Karakter Kasih</th>
              <th colspan="4" style="width: 36%;">Level Ketercapaian Karakter Cinta</th>
              <th rowspan="2" style="width: 12%;">Sentuhan Edukasi</th>
            </tr>
            <tr style="font-size: 8pt;">
              <th style="width: 9%; background-color: #fee2e2;">1 (Perlu Bimbingan Kasih)</th>
              <th style="width: 9%; background-color: #dbeafe;">2 (Mulai Terbina Kasih)</th>
              <th style="width: 9%; background-color: #fef08a;">3 (Tumbuh Cinta)</th>
              <th style="width: 9%; background-color: #dcfce7;">4 (Qudwah / Teladan Kasih)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">TP-KBC 7.1</td>
              <td>Menginternalisasi nilai keteraturan dalam ${materiPokok}.</td>
              <td>Mampu bersyukur, tenang, dan santun saat menghadapi materi sulit.</td>
              <td>Masih sering mengeluh dan enggan menerima bantuan.</td>
              <td>Mulai mampu mengendalikan emosi dan mau mendengarkan saran.</td>
              <td>Tenang, fokus, serta menghargai proses pembelajaran.</td>
              <td>Menjadi inspirasi teladan bagi rekan sebaya dalam kesabaran dan cinta belajar.</td>
              <td>Konseling hangat dari guru dan pendampingan tutor kasih.</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'landscape', title };
    }

    case 'MODUL-KBC': {
      const title = `MODUL AJAR KURIKULUM BERBASIS CINTA (MODUL KBC) - ${mapel.toUpperCase()}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">MODUL AJAR KURIKULUM BERBASIS CINTA (KBC)</h2>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 3px; color: #9f1239;">TERINTEGRASI PANCA CINTA & PROFIL PELAJAR RAHMATAN LIL 'ALAMIN (PPRA)</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <th colspan="4" style="background-color: #fdf2f8; text-align: left; padding: 6px 10px; color: #9d174d;">I. IDENTITAS & NILAI KASIH</th>
          </tr>
          <tr>
            <td style="width: 25%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="width: 25%;">${schoolConfig.namaSekolah}</td>
            <td style="width: 25%; font-weight: bold;">Penyusun / Guru</td>
            <td style="width: 25%;">${namaGuru}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Mata Pelajaran</td>
            <td>${mapel}</td>
            <td style="font-weight: bold;">Fase / Kelas</td>
            <td>Fase ${fase} / Kelas ${kelas}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Fokus Panca Cinta</td>
            <td colspan="3"><strong>1. Cinta Diri & Sesama Insan, 2. Cinta Ilmu Pengetahuan & Kebenaran.</strong></td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Nilai Utama PPRA</td>
            <td colspan="3"><strong>Berkeadaban (Ta'addub), Keteladanan (Qudwah), dan Toleransi Penuh Kasih (Tasamuh).</strong></td>
          </tr>
        </table>

        <div style="font-weight: bold; margin: 12px 0 6px 0; font-size: 11pt;">II. SKENARIO PEMBELAJARAN BERBASIS CINTA (DENGAN TAG PANCA CINTA & PPRA)</div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="width: 20%;">Tahap Pembelajaran</th>
              <th style="width: 65%;">Aktivitas Guru & Peserta Didik Berbasis Kasih</th>
              <th style="width: 15%;">Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">Awal Pertemuan<br><span style="font-size: 8.5pt; color: #be123c;">(Sentuhan Jiwa)</span></td>
              <td>
                1. <strong>Sapaan Kasih Sayang</strong>: Guru menyambut siswa dengan senyuman hangat dan tatapan penuh penghargaan <em>(PC: Cinta Sesama | PPRA: Ta'addub)</em>.<br>
                2. Doa bersama dan tadabbur 1 menit atas nikmat akal dan kesehatan <em>(PC: Cinta Allah & Rasul | PPRA: Qudwah)</em>.<br>
                3. Refleksi perasaan: Guru bertanya lembut: <em>"Bagaimana kabar hatimu hari ini, anak-anak hebat?"</em>
              </td>
              <td style="text-align: center;">15 Menit</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Inti Pembelajaran<br><span style="font-size: 8.5pt; color: #047857;">(Eksplorasi Kasih)</span></td>
              <td>
                1. <strong>Menghadirkan Masalah Empatik</strong>: Guru menayangkan kondisi nyata di mana pemahaman ${materiPokok} dapat menolong sesama yang kesulitan <em>(PC: Cinta Sesama | PPRA: Ishlah)</em>.<br>
                2. <strong>Diskusi Kelompok Santun</strong>: Siswa berdiskusi dengan kesepakatan tidak boleh mencela kesalahan rekan sebaya; setiap saran disampaikan dengan kata santun <em>(PC: Cinta Diri & Sesama | PPRA: Tasamuh)</em>.<br>
                3. <strong>Apresiasi Antarteman</strong>: Setiap kelompok memberikan kalimat apresiasi kepada kelompok yang tampil <em>(PC: Cinta Sesama | PPRA: Syura)</em>.
              </td>
              <td style="text-align: center;">50 Menit</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Penutup Kasih<br><span style="font-size: 8.5pt; color: #6d28d9;">(Refleksi Hati)</span></td>
              <td>
                1. Menuliskan pesan kebaikan dan rasa terima kasih pada selembar kertas kecil untuk teman sebangku.<br>
                2. Doa penutup dengan memohon agar ilmu yang dipelajari menjadi berkah dan bermanfaat bagi alam semesta.
              </td>
              <td style="text-align: center;">15 Menit</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'LKPD-KBC': {
      const title = `LEMBAR KERJA PESERTA DIDIK KBC (LKPD-KBC) - ${mapel.toUpperCase()}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="font-size: 13pt; margin: 0; text-transform: uppercase;">LEMBAR KERJA PESERTA DIDIK BERBASIS CINTA (LKPD-KBC)</h2>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px; color: #9f1239;">"BELAJAR DENGAN HATI, BERKARYA DENGAN CINTA"</div>
        </div>

        <table style="width: 100%; border: none !important; margin-bottom: 14px; font-size: 9.5pt;">
          <tr style="border: none !important;">
            <td style="border: none !important; width: 18%; font-weight: bold;">Nama Sahabat Belajar</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">1. ................................. 2. .................................</td>
            <td style="border: none !important; width: 18%; font-weight: bold;">Kelas / Kelompok</td>
            <td style="border: none !important; width: 2%;">:</td>
            <td style="border: none !important; width: 30%;">${kelas} / Kelompok Cinta ......</td>
          </tr>
        </table>

        <div style="background-color: #fdf2f8; border: 1px dashed #f43f5e; padding: 10px; border-radius: 4px; margin-bottom: 14px;">
          <div style="font-weight: bold; color: #9f1239;">💖 PESAN KASIH & PETUNJUK EMPATIK:</div>
          <p style="margin: 4px 0 0 0; font-size: 9.5pt; color: #334155;">
            Anak-anakku yang hebat, kerjakan lembar ini bersama sahabat kelompokmu. Saling mendengarkanlah dengan sabar, hargai setiap gagasan, dan ingatlah bahwa usaha belajarmu hari ini adalah wujud baktimu kepada orang tua dan rasa cintamu kepada ilmu pengetahuan.
          </p>
        </div>

        <div style="font-weight: bold; margin: 10px 0 6px 0;">TAHAP 1: TADABBUR FENOMENA (${materiPokok.toUpperCase()}) 🔍</div>
        <p style="margin: 0 0 6px 0; font-size: 10pt;">Amati gambar/kasus yang telah disediakan guru. Diskusikan dengan penuh kasih apa hikmah yang dapat kamu ambil bagi kehidupan kita bersama!</p>
        <div style="height: 60px; border-bottom: 1px dotted #94a3b8; margin-bottom: 16px;"></div>

        <div style="font-weight: bold; margin: 10px 0 6px 0;">TAHAP 2: KOLABORASI & PEMECAHAN MASALAH KASIH 🤝</div>
        <p style="margin: 0 0 6px 0; font-size: 10pt;">Tuliskan langkah pemecahan masalah terbaik yang kalian sepakati bersama secara adil dan bijaksana:</p>
        <div style="height: 80px; border-bottom: 1px dotted #94a3b8; margin-bottom: 16px;"></div>

        <div style="font-weight: bold; margin: 10px 0 6px 0;">TAHAP 3: REFLEKSI PERSONAL BERBASIS CINTA (KBC) 🌱</div>
        <p style="margin: 0 0 6px 0; font-size: 10pt;"><em>"Kebaikan apa yang berhasil aku persembahkan kepada sahabat dan lingkungan belajarku pada kegiatan hari ini?"</em></p>
        <div style="height: 50px; border-bottom: 1px dotted #94a3b8; margin-bottom: 16px;"></div>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'RUBRIK-FORMATIF-KBC': {
      const title = `RUBRIK ASESMEN FORMATIF KBC - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-size: 13pt; margin: 0; text-transform: uppercase;">RUBRIK PENILAIAN FORMATIF KURIKULUM BERBASIS CINTA (KBC)</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px; color: #9f1239;">PENILAIAN PROSES, EMPATI SOSIAL, DAN INTEGRASI PANCA CINTA</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr>
              <th style="width: 20%;">Dimensi Penilaian</th>
              <th style="width: 20%;">Level 1 (Perlu Pendampingan Kasih)</th>
              <th style="width: 20%;">Level 2 (Mulai Berkembang)</th>
              <th style="width: 20%;">Level 3 (Berkembang Sesuai Harapan)</th>
              <th style="width: 20%;">Level 4 (Qudwah / Sangat Berbudi)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">Kesantunan & Empati Rekan Sebaya</td>
              <td>Sering memotong pembicaraan teman dan kurang mendengarkan.</td>
              <td>Mulai mendengarkan dengan bimbingan dan pengingat dari guru.</td>
              <td>Mendengarkan secara aktif dan menggunakan bahasa santun saat menanggapi.</td>
              <td>Sangat santun, menyemangati teman yang kesulitan, dan menghargai keberagaman.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Ketekunan Belajar (Cinta Ilmu)</td>
              <td>Mudah menyerah ketika menemukan soal atau materi sulit.</td>
              <td>Mencoba kembali hanya jika diajak teman kelompoknya.</td>
              <td>Gigih mencari referensi dan menyelesaikan tugas tepat waktu.</td>
              <td>Menunjukkan gairah belajar tinggi dan membimbing teman tanpa rasa sombong.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Kepedulian Lingkungan Kelas</td>
              <td>Meninggalkan meja belajar dalam keadaan berantakan.</td>
              <td>Membersihkan sampah jika ditegur oleh guru piket.</td>
              <td>Menjaga kebersihan dan kerapian area belajarnya sendiri.</td>
              <td>Inisiatif merawat fasilitas kelas dan mengajak rekan menjaga kebersihan bersama.</td>
            </tr>
          </tbody>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    case 'RUBRIK-SUMATIF-KBC': {
      const title = `RUBRIK ASESMEN SUMATIF KBC - ${mapel.toUpperCase()} KELAS ${kelas}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-size: 13pt; margin: 0; text-transform: uppercase;">RUBRIK PENILAIAN SUMATIF KURIKULUM BERBASIS CINTA (KBC)</h2>
          <div style="font-size: 10pt; font-weight: bold; margin-top: 3px; color: #9f1239;">PEMBOBOTAN KOMPREHENSIF (100%) - PENGETAHUAN, KINERJA, & KARAKTER QUDWAH</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr>
              <th style="width: 15%;">Komponen Penilaian</th>
              <th style="width: 10%;">Bobot</th>
              <th style="width: 18%;">Skor 1 (Kurang)</th>
              <th style="width: 18%;">Skor 2 (Cukup)</th>
              <th style="width: 18%;">Skor 3 (Baik)</th>
              <th style="width: 21%;">Skor 4 (Istimewa / Qudwah)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">1. Penguasaan Konseptual & Analitis</td>
              <td style="text-align: center; font-weight: bold;">35%</td>
              <td>Konsep dasar belum dipahami dengan benar.</td>
              <td>Memahami konsep namun butuh bimbingan teratur.</td>
              <td>Memahami konsep dan mampu menyelesaikan soal secara mandiri.</td>
              <td>Penguasaan sangat mendalam, akurat, dan mampu mengaitkan dengan ayat kauniyah.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">2. Karya Portofolio & Solusi Nyata</td>
              <td style="text-align: center; font-weight: bold;">35%</td>
              <td>Karya belum tuntas dan kurang rapi.</td>
              <td>Karya selesai namun belum mencerminkan solusi aplikatif.</td>
              <td>Karya rapi, terstruktur, dan memberi manfaat praktis.</td>
              <td>Karya sangat inovatif, estetik, dan memberi dampak nyata bagi lingkungan.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">3. Integritas, Empati & Karakter Kasih</td>
              <td style="text-align: center; font-weight: bold;">30%</td>
              <td>Belum menunjukkan sikap saling menghargai.</td>
              <td>Menunjukkan kepedulian bila diarahkan secara eksplisit.</td>
              <td>Konsisten menjaga integritas, kejujuran, dan kesantunan berbahasa.</td>
              <td>Menjadi figur teladan (Qudwah), penuh kasih sayang, dan menginspirasi seisi kelas.</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background-color: #f1f5f9;">
              <td style="text-align: right; padding-right: 12px;">TOTAL BOBOT</td>
              <td style="text-align: center;">100%</td>
              <td colspan="4" style="text-align: center;">Nilai Akhir = Σ (Skor Perolehan / 4 × Bobot Komponen) × 100</td>
            </tr>
          </tfoot>
        </table>

        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }

    default: {
      const title = `DOKUMEN ADMINISTRASI PEMBELAJARAN - ${mapel.toUpperCase()}`;
      const html = `
        ${kop}
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">DOKUMEN ADMINISTRASI PEMBELAJARAN TERPADU</h2>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 3px;">${mapel.toUpperCase()} - FASE ${fase} / KELAS ${kelas}</div>
        </div>
        <p>Dokumen administrasi untuk ${materiPokok} berhasil dipersiapkan sesuai standar Kurikulum Nasional.</p>
        ${ttd}
      `;
      return { html, orientation: 'portrait', title };
    }
  }
}
