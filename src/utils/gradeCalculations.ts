export interface GradeInput {
  formatif1?: number;
  formatif2?: number;
  formatif3?: number;
  sumatifLM1?: number;
  sumatifLM2?: number;
  sumatifSAS?: number;
}

export interface ComputedGradeResult {
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  isPassed: boolean;
  description: string;
}

/**
 * Calculates Final Grade (Nilai Akhir) based on Kurikulum Merdeka guidelines:
 * 40% Formatif average + 30% Sumatif Lingkup Materi average + 30% SAS
 */
export function calculateKurikulumMerdekaGrade(
  input: GradeInput,
  tpDescription = 'kompetensi materi pokok'
): ComputedGradeResult {
  const f1 = input.formatif1 ?? 0;
  const f2 = input.formatif2 ?? 0;
  const f3 = input.formatif3 ?? 0;
  const avgFormatif = (f1 + f2 + f3) / 3;

  const lm1 = input.sumatifLM1 ?? 0;
  const lm2 = input.sumatifLM2 ?? 0;
  const avgSumatifLM = (lm1 + lm2) / 2;

  const sas = input.sumatifSAS ?? 0;

  const finalScore = Math.round((avgFormatif * 0.4) + (avgSumatifLM * 0.3) + (sas * 0.3));

  let predicate: 'A' | 'B' | 'C' | 'D' = 'D';
  let isPassed = false;
  let description = '';

  if (finalScore >= 90) {
    predicate = 'A';
    isPassed = true;
    description = `Menunjukkan penguasaan sangat tinggi dalam ${tpDescription.toLowerCase()}`;
  } else if (finalScore >= 80) {
    predicate = 'B';
    isPassed = true;
    description = `Menguasai dengan baik kompetensi dalam ${tpDescription.toLowerCase()}`;
  } else if (finalScore >= 70) {
    predicate = 'C';
    isPassed = true;
    description = `Cukup menguasai kompetensi dasar, perlu sedikit penguatan.`;
  } else {
    predicate = 'D';
    isPassed = false;
    description = `Perlu bimbingan intensif dan remidial terstruktur.`;
  }

  return {
    finalScore,
    predicate,
    isPassed,
    description
  };
}
