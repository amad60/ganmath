import {
  Bars,
  ArrayGrid,
  Base10Blocks,
  Clock,
  CounterObjects,
  FractionShape,
  Money,
  NumberBond,
  NumberLine,
  Pictogram,
  Shape2D,
  TallyChart,
  TenFrame,
} from '../../components/manipulatives';
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
          marks={visual.marks ?? []}
          onChange={interactive ? onValue : undefined}
        />
      );
    case 'number-bond':
      return <NumberBond whole={visual.whole} parts={visual.parts} ask={visual.ask} />;
    case 'base10':
      return (
        <Base10Blocks hundreds={visual.hundreds ?? 0} tens={visual.tens} ones={visual.ones} />
      );
    case 'shape2d':
      return <Shape2D name={visual.name} size={120} showCorners={visual.showCorners} />;
    case 'bars':
      return <Bars lengths={visual.lengths} labels={visual.labels} />;
    case 'fraction':
      return (
        <FractionShape
          parts={visual.parts}
          shaded={visual.shaded}
          shape={visual.shape ?? 'circle'}
          unequal={visual.unequal}
          size={140}
        />
      );
    case 'clock':
      return <Clock hour={visual.hour} minute={visual.minute} />;
    case 'money':
      return <Money items={visual.items} />;
    case 'tally':
      return <TallyChart count={visual.count} />;
    case 'array':
      return (
        <ArrayGrid rows={visual.rows} cols={visual.cols} highlightRow={visual.highlightRow} />
      );
    case 'pictogram':
      return <Pictogram rows={visual.rows} />;
  }
}
