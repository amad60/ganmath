import type { ModuleDef } from '../engine/types';

/**
 * Materi layar Learn. Deklaratif — engine dan komponen tidak perlu tahu isi modulnya.
 * Aturan konten (dicek linter di S7): setiap modul concept/fact WAJIB melewati
 * concrete → pictorial → abstract, dan `prompt` maksimal 8 kata.
 */
export type LearnVisual =
  | { kind: 'base10'; hundreds?: number; tens: number; ones: number }
  | { kind: 'shape2d'; name: import('../engine/types').ShapeName; showCorners?: boolean }
  | { kind: 'bars'; lengths: number[]; labels?: string[] }
  | { kind: 'fraction'; parts: number; shaded: number; shape?: 'circle' | 'square'; unequal?: boolean }
  | { kind: 'clock'; hour: number; minute: number }
  | { kind: 'money'; items: number[] }
  | { kind: 'tally'; count: number }
  | { kind: 'rect'; w: number; h: number; unit?: string; showCorners?: boolean }
  | { kind: 'array'; rows: number; cols: number; highlightRow?: number }
  | { kind: 'pictogram'; rows: { label: string; icon: string; count: number }[] }
  | { kind: 'counter-objects'; count: number; icon?: string }
  | { kind: 'ten-frame'; value: number; capacity?: 10 | 20; split?: number }
  | {
      kind: 'number-line';
      min: number;
      max: number;
      value?: number | null;
      marks?: number[];
      /** Menimpa langkah otomatis. Isi hanya untuk langkah pecahan/desimal. */
      step?: number;
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
    };

export type LearnStep = {
  stage: 'concrete' | 'pictorial' | 'abstract';
  /** ≤8 kata, English sederhana. */
  prompt: string;
  visual: LearnVisual;
  /** Aksi yang diminta. `watch` = tidak ada aksi, tombol Next langsung aktif. */
  action: 'tap-count' | 'tap-fill' | 'drop-on-line' | 'watch';
  /** Nilai yang harus dicapai anak sebelum tombol Next aktif. */
  target?: number;
  /** Teks aksi di bawah visual, mis. "Tap each apple." */
  hint?: string;
};

export type ContentModule = ModuleDef & { learn: LearnStep[] };
