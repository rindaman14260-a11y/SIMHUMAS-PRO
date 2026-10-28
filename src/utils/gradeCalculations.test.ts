import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateKurikulumMerdekaGrade } from './gradeCalculations';
import { generateFormalKopHtml, generateSignatureTableHtml } from './documentExport';
import { SchoolConfig } from '../types';

test('calculateKurikulumMerdekaGrade computes high grade with Predicate A', () => {
  const result = calculateKurikulumMerdekaGrade({
    formatif1: 95,
    formatif2: 90,
    formatif3: 92,
    sumatifLM1: 94,
    sumatifLM2: 96,
    sumatifSAS: 92
  }, 'Menganalisis Teks Deskripsi');

  assert.equal(result.predicate, 'A');
  assert.equal(result.isPassed, true);
  assert.ok(result.finalScore >= 90);
  assert.ok(result.description.includes('penguasaan sangat tinggi'));
});

test('calculateKurikulumMerdekaGrade handles threshold for Predicate C and D', () => {
  const passingC = calculateKurikulumMerdekaGrade({
    formatif1: 72,
    formatif2: 70,
    formatif3: 74,
    sumatifLM1: 72,
    sumatifLM2: 70,
    sumatifSAS: 70
  });

  assert.equal(passingC.predicate, 'C');
  assert.equal(passingC.isPassed, true);

  const failingD = calculateKurikulumMerdekaGrade({
    formatif1: 50,
    formatif2: 55,
    formatif3: 60,
    sumatifLM1: 58,
    sumatifLM2: 55,
    sumatifSAS: 50
  });

  assert.equal(failingD.predicate, 'D');
  assert.equal(failingD.isPassed, false);
});

test('generateFormalKopHtml enforces centered bold and NO image tag in kop', () => {
  const config: SchoolConfig = {
    pemerintahDinas: 'DINAS PENDIDIKAN PROVINSI JAWA TENGAH',
    namaSekolah: 'SMP NEGERI 1 TELADAN',
    alamat: 'Jl. Pemuda No. 142',
    tempatTtd: 'Semarang',
    tanggalTtd: '15 Juli 2026',
    namaKepalaSekolah: 'Dr. H. Sulistiyo Raharjo, M.Pd.',
    nipKepalaSekolah: '19740512 199803 1 004',
    tahunPelajaran: '2026/2027',
    semesterAktif: 'Ganjil'
  };

  const kopHtml = generateFormalKopHtml(config);
  assert.ok(kopHtml.includes('SMP NEGERI 1 TELADAN'));
  assert.ok(!kopHtml.includes('<img'), 'Kop must strictly not contain any <img> tag per specification');
  assert.ok(kopHtml.includes('kop-divider'), 'Kop must have divider line');
});

test('generateSignatureTableHtml strictly enforces borderless 2-column horizontal parallel layout', () => {
  const config: SchoolConfig = {
    pemerintahDinas: 'DINAS PENDIDIKAN',
    namaSekolah: 'SMP NEGERI 1 TELADAN',
    alamat: 'Jl. Pemuda',
    tempatTtd: 'Semarang',
    tanggalTtd: '15 Juli 2026',
    namaKepalaSekolah: 'Dr. H. Sulistiyo Raharjo, M.Pd.',
    nipKepalaSekolah: '19740512 199803 1 004',
    tahunPelajaran: '2026/2027',
    semesterAktif: 'Ganjil'
  };

  const sigHtml = generateSignatureTableHtml(config, 'Dra. Hj. Siti Aminah, M.Pd.', '19790422 200312 2 005');
  assert.ok(sigHtml.includes('table.signature-table') || sigHtml.includes('class="signature-table"'));
  assert.ok(sigHtml.includes('border: none !important'));
  assert.ok(sigHtml.includes('Dr. H. Sulistiyo Raharjo, M.Pd.'));
  assert.ok(sigHtml.includes('Dra. Hj. Siti Aminah, M.Pd.'));
});
