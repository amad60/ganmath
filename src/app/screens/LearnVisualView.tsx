import { CounterObjects, NumberBond, NumberLine, TenFrame } from '../../components/manipulatives';
import type { LearnVisual } from '../../content/types';

export type LearnVisualViewProps = {
  visual: LearnVisual;
  /** Nilai yang sedang dibangun anak (jumlah tap, isi frame, posisi di garis). */
  value: number;
  onValue: (n: number) => void;
  interactive: boolean;
};

/** Menerjemahkan data materi jadi manipulatif. Komponen tidak tahu isi modulnya. */
export function LearnVisualView({ visual, value, onValue, interactive }: LearnVisualViewProps) {
  switch (visual.kind) {
    case 'counter-objects':
      return (
        <CounterObjects
          count={visual.count}
          icon={visual.icon}
          counted={value}
          onTap={interactive ? (i) => onValue(i + 1) : undefined}
        />
      );
    case 'ten-frame':
      return (
        <TenFrame
          value={interactive ? value : visual.value}
          capacity={visual.capacity ?? 10}
          split={visual.split}
          onChange={interactive ? onValue : undefined}
        />
      );
    case 'number-line':
      return (
        <NumberLine
          min={visual.min}
          max={visual.max}
          value={interactive ? (value > visual.min - 1 ? value : null) : (visual.value ?? null)}
          onChange={interactive ? onValue : undefined}
        />
      );
    case 'number-bond':
      return <NumberBond whole={visual.whole} parts={visual.parts} ask={visual.ask} />;
  }
}
