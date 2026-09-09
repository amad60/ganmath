import {
  Angle,
  Bars,
  Circle,
  ArrayGrid,
  RectShape,
  Base10Blocks,
  Clock,
  CounterObjects,
  FractionShape,
  Money,
  NumberBond,
  NumberLine,
  Pictogram,
  Shape2D,
  ShapeNet,
  Solid3D,
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
          step={visual.step}
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
    case 'angle':
      return (
        <Angle
          degrees={visual.degrees}
          rotate={visual.rotate}
          showValue={visual.showValue}
          showName={visual.showName}
          showScale={visual.showScale}
        />
      );
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
    case 'rect':
      return (
        <RectShape w={visual.w} h={visual.h} unit={visual.unit} showCorners={visual.showCorners} />
      );
    case 'array':
      return (
        <ArrayGrid rows={visual.rows} cols={visual.cols} highlightRow={visual.highlightRow} />
      );
    case 'pictogram':
      return <Pictogram rows={visual.rows} />;
    case 'solid':
      return (
        <Solid3D
          l={visual.l}
          w={visual.w}
          h={visual.h}
          cubes={visual.cubes ?? true}
          showDimensions={visual.showDimensions}
          showVolume={visual.showVolume}
          showName={visual.showName}
          highlightLayer={visual.highlightLayer}
          unit={visual.unit}
        />
      );
    case 'net':
      return (
        <ShapeNet
          solid={visual.solid}
          layout={visual.layout}
          l={visual.l}
          w={visual.w}
          h={visual.h}
          showName={visual.showName}
          numberFaces={visual.numberFaces}
        />
      );
    case 'circle':
      return (
        <Circle
          r={visual.r}
          d={visual.d}
          mark={visual.mark}
          showValue={visual.showValue}
          showCenter={visual.showCenter}
          showCircumference={visual.showCircumference}
          showArea={visual.showArea}
          unit={visual.unit}
        />
      );
  }
}
