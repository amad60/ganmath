# Skema Penyimpanan & Backup

Satu-satunya penyimpanan adalah **localStorage** (keputusan user: tanpa database, tanpa backend).

## 1. Kunci localStorage

| Key | Isi |
|---|---|
| `ganmath.v1.progress` | seluruh state anak (di bawah) |
| `ganmath.v1.session` | sesi berjalan (agar tidak hilang kalau app tertutup di tengah) |
| `ganmath.meta` | `{ lastBackupAt, installPromptShown, schemaVersion }` — **tidak pernah dimigrasi**, dipakai untuk mendeteksi kehilangan data |

## 2. Skema `progress` (final)

```ts
type ProgressState = {
  schemaVersion: 1;
  createdAt: string;              // ISO
  updatedAt: string;

  profile: { name: string; avatar: 'fox'|'panda'|'tiger'|'koala' };

  xp: number;
  level: number;                  // turunan dari xp, disimpan agar tak dihitung ulang
  badges: string[];               // badge id

  streak: {
    current: number;
    best: number;
    lastActiveDate: string;       // YYYY-MM-DD, waktu LOKAL
    freezes: number;              // maks 2, diisi ulang tiap Senin
  };

  modules: Record<string, ModuleState>;
  skills:  Record<string, SkillStat>;   // agregat lintas modul, untuk diagnosis
  reviewQueue: { moduleId: string; dueAt: string; stage: 1|2|3|4 }[];

  settings: {
    sound: boolean;               // default true
    reducedMotion: boolean | null;// null = ikut sistem
    theme: 'system'|'light'|'dark';
    masteryAccuracyOverride: number | null;  // diatur orang tua
    dailyReminder: boolean;       // default false
  };
};

type ModuleState = {
  status: 'available'|'learning'|'practiced'|'mastered'|'needs_review'|'retained';
  stars: 0|1|2|3;
  learnCompletedAt?: string;
  masteredAt?: string;
  reviewStage: 0|1|2|3|4;
  attempts: Attempt[];            // ★ maksimal 10 terakhir (lihat §3)
  totals: { sessions: number; questions: number; correct: number };
};

type Attempt = {
  date: string;                   // YYYY-MM-DD
  kind: 'practice'|'quiz'|'review';
  accuracy: number;               // 0..1
  medianThinkMs: number;
  medianTotalMs: number;
  passed: boolean;
};

type SkillStat = { seen: number; correct: number; medianThinkMs: number };
```

`status: 'locked'` **tidak disimpan** — terkunci adalah keadaan turunan dari prasyarat + path
order, dihitung oleh `engine/unlock.ts`. Menyimpannya akan membuat data kadaluwarsa setiap kali
kurikulum bertambah.

## 3. Batas ukuran

localStorage praktis aman sampai ~5MB, tapi kita jaga jauh di bawah itu supaya export/import
tetap ringan dan Safari tidak rewel.

| Aturan | Nilai |
|---|---|
| `attempts` per modul | simpan **10 terakhir** saja; sisanya diringkas ke `totals` |
| Target ukuran total | **< 200KB** untuk 6 grade penuh (±240 modul) |
| Cek saat menyimpan | kalau > 1MB, ringkas `attempts` jadi 5 dan catat peringatan di Parent Area |

## 4. Migrasi versi

```ts
const migrations: Record<number, (s: any) => any> = {
  // 1: bentuk awal — tidak ada migrasi
  // 2: (contoh) menambah field baru dengan default aman
};

function load(raw: string): ProgressState {
  let s = JSON.parse(raw);
  while (s.schemaVersion < CURRENT) s = migrations[s.schemaVersion + 1](s);
  return s;
}
```

Aturan wajib:
1. Migrasi **hanya menambah**, tidak pernah menghapus data anak.
2. **ID modul tidak pernah berubah.** Modul yang dipecah menyimpan alias di layer migrasi.
3. Kurikulum yang bertambah **bukan** perubahan skema — modul baru muncul sebagai `available`
   tanpa migrasi apa pun. Ini alasan `locked` tidak disimpan.
4. Setiap migrasi punya test di Vitest dengan contoh state versi lama yang nyata.

## 5. Risiko iOS Safari (nyata, bukan teoretis)

Safari menghapus penyimpanan yang ditulis skrip untuk situs yang **tidak dibuka ±7 hari**. Anak
libur seminggu = progress hilang. Tiga lapis pertahanan:

1. **Dorong instal ke home screen.** PWA terinstal tidak terkena aturan itu. Prompt muncul setelah
   modul pertama selesai (saat anak sudah punya sesuatu untuk dijaga).
2. **`navigator.storage.persist()`** dipanggil setelah modul pertama — di Chrome/Android
   memberi status penyimpanan permanen.
3. **Backup file** (§6) — pertahanan terakhir yang tidak bergantung pada browser.

Deteksi kehilangan: `ganmath.meta` hilang **tapi** ada tanda pemakaian sebelumnya → tampilkan
layar "Welcome back! Load your progress from a file?" alih-alih diam-diam memulai dari nol.

## 6. Export / Import file

**Format** — sengaja dibungkus, bukan state telanjang, supaya bisa diperiksa & divalidasi:

```jsonc
{
  "app": "ganmath",
  "fileVersion": 1,
  "exportedAt": "2026-09-08T10:00:00+07:00",
  "appVersion": "0.1.0",
  "profileName": "…",
  "progress": { /* ProgressState */ }
}
```

- Nama file: `ganmath-progress-<nama>-YYYY-MM-DD.json`
- **Save**: `Blob` + `URL.createObjectURL` + `<a download>`. Di iOS Safari ini membuka lembar
  Share — sudah cukup (anak/orang tua simpan ke Files atau kirim ke diri sendiri).
- **Load**: `<input type="file">` → validasi `app`, `fileVersion`, `schemaVersion` → jalankan
  migrasi → **konfirmasi menimpa** dengan menampilkan perbandingan:
  `File: 24 modules mastered, 3 days ago` vs `Now: 16 modules mastered`. Anak tidak boleh bisa
  menghapus progress karena salah tap — makanya fitur ini ada di Parent Area di balik gerbang.
- **Import tidak pernah menggabungkan.** Menggabungkan dua riwayat penguasaan menghasilkan data
  yang tidak bisa dipercaya. Impor = ganti total, setelah konfirmasi eksplisit.

**Pengingat backup** muncul kalau: satu grade selesai, **atau** `now - lastBackupAt > 14 hari`
dan ada minimal 5 modul baru dikuasai sejak backup terakhir.
