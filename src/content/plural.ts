/**
 * Bentuk tunggal/jamak untuk soal cerita.
 *
 * Soal dibuat dari aturan berparameter, jadi satu kalimat harus benar untuk SEMUA
 * nilai parameternya — termasuk 1. Tanpa ini lahir "Ana has 1 apples", dan yang
 * membacanya justru anak kelas 1 yang sedang belajar membaca. Angka salah ketahuan
 * dari jawabannya; tata bahasa salah tidak ketahuan siapa pun, ia hanya diam-diam
 * mengajarkan bentuk yang keliru.
 *
 * Dijaga aturan lint `story-grammar`.
 */
export function pl(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
