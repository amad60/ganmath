import type { LearnVisual } from '../../content/types';
import { columnPlaces, type ColumnPlace } from '../../components/manipulatives/columnPlaces';

export type WatchWork =
  | { kind: 'column'; op: '+' | '−'; places: ColumnPlace[] }
  | { kind: 'fraction'; need: number }
  | { kind: 'bundle'; label: 'make' | 'open' };

/**
 * Langkah `watch` yang idenya hanya masuk kalau anak mengerjakannya:
 * kolom bersusun, pecahan yang diarsir, dan satuan yang harus dijadikan puluhan.
 */
export function watchWork(visual: LearnVisual): WatchWork | null {
  if (visual.kind === 'column-sum') {
    const places = columnPlaces(visual.a, visual.b, visual.op ?? '+');
    if (places.length === 0) return null;
    return { kind: 'column', op: visual.op ?? '+', places };
  }
  if (visual.kind === 'fraction') {
    if (visual.shaded > 0 && visual.parts > 1 && !visual.tap) {
      return { kind: 'fraction', need: visual.shaded };
    }
    return null;
  }
  if (visual.kind === 'base10' && visual.ones >= 10) {
    return { kind: 'bundle', label: 'open' };
  }
  if (visual.kind === 'base10-pair') {
    const ones = visual.left.ones + visual.right.ones;
    if ((visual.op ?? '+') === '+' && ones >= 10) return { kind: 'bundle', label: 'make' };
  }
  return null;
}
