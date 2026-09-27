import type {
  CircleVisual,
  CoordinateVisual,
  ModuleDef,
  NetVisual,
  PositionVisual,
  SolidShapesVisual,
  SolidVisual,
} from '../engine/types';

/**
 * Materi layar Learn. Deklaratif — engine dan komponen tidak perlu tahu isi modulnya.
 * Aturan konten (dicek linter di S7): setiap modul concept/fact WAJIB melewati
 * concrete → pictorial → abstract, dan `prompt` maksimal 8 kata.
 */
export type LearnVisual =
  | { kind: 'base10'; hundreds?: number; tens: number; ones: number }
  | {
      kind: 'base10-pair';
      left: { hundreds?: number; tens: number; ones: number };
      right: { hundreds?: number; tens: number; ones: number };
      op?: '+' | '−';
    }
  | { kind: 'column-sum'; a: number; b: number; op?: '+' | '−'; showTotal?: boolean }
  | {
      kind: 'shape2d';
      name: import('../engine/types').ShapeName;
      showCorners?: boolean;
      /** Bagian yang harus disentuh anak. Wajib ada kalau `action` bukan `watch`. */
      tap?: import('../components/manipulatives/Shape2D').ShapePart;
    }
  | {
      kind: 'bars';
      /** Panjang relatif 0..1 — batang perbandingan, tanpa sumbu. */
      lengths?: number[];
      /** Nilai tiap batang. Mengisinya menyalakan sumbu berangka. */
      values?: number[];
      /** Nilai tertinggi di sumbu. Kosong = diturunkan dari nilai terbesarnya. */
      max?: number;
      /** Menimpa langkah otomatis. Isi hanya untuk sumbu pecahan/desimal. */
      step?: number;
      /** Tulis nilai di ujung tiap batang. Matikan saat itu yang ditanyakan. */
      showValues?: boolean;
      labels?: string[];
    }
  | {
      kind: 'fraction';
      parts: number;
      shaded: number;
      shape?: 'circle' | 'square';
      unequal?: boolean;
      /** Bagiannya bisa disentuh satu per satu. Wajib kalau `action` bukan `watch`. */
      tap?: boolean;
    }
  | { kind: 'clock'; hour: number; minute: number }
  | { kind: 'money'; items: number[] }
  | { kind: 'tally'; count: number }
  | { kind: 'rect'; w: number; h: number; unit?: string; showCorners?: boolean }
  | {
      kind: 'array';
      rows: number;
      cols: number;
      highlightRow?: number;
      /** Gambar petak persegi berdempetan, bukan penanda bulat. Untuk luas. */
      square?: boolean;
    }
  | { kind: 'pictogram'; rows: { label: string; icon: string; count: number }[] }
  | {
      kind: 'counter-objects';
      count: number;
      icon?: string;
      /** Ikon berbeda per benda, dari kiri ke kanan. Menimpa `icon`. */
      icons?: string[];
    }
  | {
      kind: 'ten-frame';
      value: number;
      capacity?: 10 | 20;
      split?: number;
      /** Titik muncul bersamaan, bukan satu-satu — untuk subitizing. */
      together?: boolean;
      /** Tampil `value` selama ini (ms) lalu kosong. Anak mengetuk frame untuk melihat lagi. */
      flashMs?: number;
    }
  | {
      kind: 'number-line';
      min: number;
      max: number;
      value?: number | null;
      marks?: number[];
      /** Menimpa langkah otomatis. Isi hanya untuk langkah pecahan/desimal. */
      step?: number;
      /**
       * Tujuan lompatan. Penanda bergerak ke arahnya, tetapi gelembung berhenti
       * satu langkah sebelumnya supaya bantuan tidak menuliskan jawabannya.
       */
      hopTo?: number;
    }
  | {
      kind: 'angle';
      degrees: number;
      rotate?: number;
      showValue?: boolean;
      showName?: boolean;
      showScale?: boolean;
    }
  | {
      kind: 'number-bond';
      whole: number | null;
      parts: [number | null, number | null];
      ask?: 'whole' | 'part0' | 'part1';
    }
  | ({ kind: 'solid' } & SolidVisual)
  | ({ kind: 'net' } & NetVisual)
  | ({ kind: 'circle' } & CircleVisual)
  | ({ kind: 'coordinate-grid' } & CoordinateVisual)
  | ({ kind: 'position' } & PositionVisual)
  | ({ kind: 'solid-shapes' } & SolidShapesVisual)
  | {
      kind: 'composed-shape';
      name: import('../engine/types').ComposedName;
      /** Potongannya bisa disentuh satu per satu. Wajib kalau `action` bukan `watch`. */
      tap?: boolean;
      /** Kalimat lambang di bawah gambar, mis. "2 halves make 1 circle". */
      note?: string;
    }
  | { kind: 'evidence-text'; sentences: string[]; title?: string }
  | { kind: 'sequence-cards'; cards: { text: string; icon?: string }[] };

export type LearnStep = {
  stage: 'concrete' | 'pictorial' | 'abstract';
  /** ≤8 kata, English sederhana. */
  prompt: string;
  visual: LearnVisual;
  /**
   * Aksi yang diminta. `watch` = lihat gambarnya; Next menunggu jeda look
   * (`WATCH_LOOK_MS`) atau flash selesai, bukan aktif seketika.
   */
  action: 'tap-count' | 'tap-fill' | 'drop-on-line' | 'watch';
  /** Nilai yang harus dicapai anak sebelum tombol Next aktif. */
  target?: number;
  /** Teks aksi di bawah visual, mis. "Tap each apple." */
  hint?: string;
  /**
   * Lambang yang ditulis besar di bawah gambar — tahap abstract.
   * Prompt-nya dibaca; ini yang DILIHAT, mis. "5", "6 > 4", "3:30".
   */
  caption?: string;
};

export type ContentModule = ModuleDef & { learn: LearnStep[] };
