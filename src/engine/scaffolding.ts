import type { QuestionVisual } from '../engine/types';
import type { Question } from './types';
import { operandsOf } from './hint';

/**
 * Scaffolding (Fading Support) untuk sesi Practice:
 *
 * Pada sesi Practice:
 * - Soal ke-0 & ke-1 (dua soal pertama): berikan scaffold visual parsial
 *   (misal dekomposisi angka / kolom bantu kosong / bar model) jika soal belum memiliki gambar.
 * - Soal ke-2 dan seterusnya: bantuan memudar (fading) agar anak mandiri menyelesaikan soal murni simbolik.
 *
 * Sesi ujian (Mastery Check / quiz / master / speed / testout) TIDAK PERNAH memakai scaffold ini.
 */
export function scaffoldForQuestion(
  question: Question,
  questionIndex: number,
  sessionKind: string,
): QuestionVisual | null {
  // Hanya berlaku di sesi 'practice'
  if (sessionKind !== 'practice') return null;

  // Hanya 2 soal pertama yang mendapatkan scaffold pembimbing (fading support)
  if (questionIndex >= 2) return null;

  // Jika soal aslinya sudah memiliki gambar sendiri (jam, pecahan, sudut, bangun), jangan ditimpa
  if (question.visual) return null;

  // Analisis apakah soal operasi 2-digit / aritmetika
  const ops = operandsOf(question);
  if (!ops) return null;

  const { left, right, op } = ops;

  // Operasi penjumlahan / pengurangan 2-digit atau puluhan (< 1000)
  if ((op === '+' || op === '−') && left >= 10 && right >= 10 && left < 1000 && right < 1000) {
    // Tampilkan format kolom bersusun tanpa jumlah akhir sebagai tangga bantu
    return {
      kind: 'column-sum',
      a: left,
      b: right,
      op,
      showTotal: false,
    };
  }

  // Operasi bilangan kecil (<= 20)
  if (op === '+' && left <= 10 && right <= 10 && left + right <= 20) {
    return {
      kind: 'number-bond',
      whole: null,
      parts: [left, right],
      ask: 'whole',
    };
  }

  if (op === '−' && left <= 20 && right <= 10) {
    return {
      kind: 'number-bond',
      whole: left,
      parts: [right, null],
      ask: 'part1',
    };
  }

  return null;
}
