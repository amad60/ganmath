import {
  Angle,
  Bars,
  Circle,
  ArrayGrid,
  CoordinatePlane,
  RectShape,
  Base10Blocks,
  ColumnSum,
  Clock,
  ComposedShape,
  CounterObjects,
  FractionShape,
  Money,
  NumberBond,
  NumberLine,
  Pictogram,
  PositionScene,
  Shape2D,
  ShapeNet,
  Solid3D,
  SolidShapes,
  TallyChart,
  TenFrame,
} from '../../components/manipulatives';
import { EvidenceText } from '../../components/reading/EvidenceText';
import { SequenceCards } from '../../components/reading/SequenceCards';
import { ScienceScene } from '../../components/science/ScienceScene';
import type { LearnVisual } from '../../content/types';
import { en } from '../../i18n/en';

export type LearnVisualViewProps = {
  visual: LearnVisual;
  /** Nilai yang sedang dibangun anak (jumlah tap, isi frame, posisi di garis). */
  value: number;
  onValue: (n: number) => void;
  interactive: boolean;
  /** Dipanggil saat flash ten-frame selesai — Next baru boleh menyala. */
  onFlashEnd?: () => void;
  /**
   * Digambar lebih ringkas — dipakai panel Hint. Bantuan setinggi materi aslinya
   * mendorong gambar SOAL ke luar layar, padahal anak yang macet butuh melihat
   * soal dan bantuannya sekaligus.
   */
  compact?: boolean;
  /** Panel Hint: kolom bersusun memainkan barisnya satu per satu. */
  play?: boolean;
  /** Berapa baris kolom yang sudah dibuka anak. */
  reveal?: number;
  /** Sepuluh satuan sudah dijadikan satu puluhan. */
  bundled?: boolean;
  /** Pecahan `watch`: anak mengetuk bagian yang diarsir. */
  fractionTap?: boolean;
  /**
   * Cerita bukti: kalimat bukti yang sudah ketemu, disorot benar. Dipakai langkah
   * `tap-clue` sesudah anak mengetuknya, dan panel Hint (contoh yang sudah dikerjakan).
   */
  clue?: number;
  /** Cerita bukti: kalimat yang sudah diketuk dan bukan buktinya. Terkunci. */
  rejected?: number[];
};

/** Menerjemahkan data materi jadi manipulatif. Komponen tidak tahu isi modulnya. */
export function LearnVisualView({
  visual,
  value,
  onValue,
  interactive,
  compact,
  onFlashEnd,
  play,
  reveal,
  bundled,
  fractionTap,
  clue,
  rejected,
}: LearnVisualViewProps) {
  switch (visual.kind) {
    case 'counter-objects':
      return (
        <CounterObjects
          count={visual.count}
          icon={visual.icon}
          icons={visual.icons}
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
          together={visual.together}
          flashMs={interactive ? undefined : visual.flashMs}
          onChange={interactive ? onValue : undefined}
          onFlashEnd={onFlashEnd}
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
          play={!interactive && (visual.hopTo != null || (visual.marks?.length ?? 0) > 0)}
          stopBefore={visual.hopTo}
        />
      );
    case 'number-bond':
      return <NumberBond whole={visual.whole} parts={visual.parts} ask={visual.ask} />;
    case 'base10':
      return (
        <Base10Blocks
          hundreds={visual.hundreds ?? 0}
          tens={visual.tens}
          ones={visual.ones}
          join={!interactive && visual.tens >= 1 && visual.ones < 10}
        />
      );
    case 'base10-pair': {
      const ones = visual.left.ones + visual.right.ones;
      const made = bundled && (visual.op ?? '+') === '+' && ones >= 10;
      if (made) {
        return (
          <div className="flex flex-col items-center gap-2">
            <Base10Blocks
              hundreds={(visual.left.hundreds ?? 0) + (visual.right.hundreds ?? 0)}
              tens={visual.left.tens + visual.right.tens + Math.floor(ones / 10)}
              ones={ones % 10}
              size={compact ? 0.7 : 1}
              join
            />
            <p className="text-[18px] font-black">{en.learn.madeTen}</p>
          </div>
        );
      }
      return (
        <div className="flex flex-wrap items-end justify-center gap-3" aria-label="Place value pair">
          <Base10Blocks
            hundreds={visual.left.hundreds ?? 0}
            tens={visual.left.tens}
            ones={visual.left.ones}
            size={compact ? 0.7 : 1}
          />
          <span className="pb-2 text-3xl font-black">{visual.op ?? '+'}</span>
          <Base10Blocks
            hundreds={visual.right.hundreds ?? 0}
            tens={visual.right.tens}
            ones={visual.right.ones}
            size={compact ? 0.7 : 1}
          />
        </div>
      );
    }
    case 'column-sum':
      return (
        <ColumnSum
          a={visual.a}
          b={visual.b}
          op={visual.op}
          compact={compact}
          showTotal={visual.showTotal !== false}
          play={play}
          reveal={reveal}
        />
      );
    case 'shape2d':
      return (
        <Shape2D
          name={visual.name}
          // Sudut/sisi yang bisa disentuh butuh sasaran tap ≥44px (CLAUDE.md §2),
          // jadi bangun yang interaktif digambar lebih besar.
          size={interactive && visual.tap ? 200 : 120}
          showCorners={visual.showCorners}
          tap={interactive ? visual.tap : undefined}
          onTap={interactive && visual.tap ? onValue : undefined}
        />
      );
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
      return (
        <Bars
          lengths={visual.lengths}
          values={visual.values}
          max={visual.max}
          step={visual.step}
          showValues={visual.showValues}
          columns={visual.columns}
          labels={visual.labels}
        />
      );
    case 'fraction':
      return (
        <FractionShape
          parts={visual.parts}
          shaded={visual.shaded}
          shape={visual.shape ?? 'circle'}
          unequal={visual.unequal}
          // Bagian yang bisa disentuh butuh sasaran ≥44px (CLAUDE.md §2).
          size={interactive && (visual.tap || fractionTap) ? 200 : 140}
          shadedOnly={fractionTap}
          onTap={interactive && (visual.tap || fractionTap) ? onValue : undefined}
        />
      );
    case 'clock':
      return <Clock hour={visual.hour} minute={visual.minute} />;
    case 'money':
      return (
        <Money
          items={visual.items}
          counted={value}
          onTap={interactive ? (i) => onValue(i + 1) : undefined}
        />
      );
    case 'tally':
      return <TallyChart count={visual.count} />;
    case 'rect':
      return (
        <RectShape w={visual.w} h={visual.h} unit={visual.unit} showCorners={visual.showCorners} />
      );
    case 'array':
      return (
        <ArrayGrid
          rows={visual.rows}
          cols={visual.cols}
          highlightRow={visual.highlightRow}
          square={visual.square}
          visibleRows={reveal}
          play={play && !visual.square && visual.rows > 1 && reveal == null}
          omitLast={play && !visual.square && visual.rows > 1 && reveal == null}
        />
      );
    case 'pictogram':
      return <Pictogram rows={visual.rows} />;
    case 'position':
      return <PositionScene anchor={visual.anchor} items={visual.items} compact={compact} />;
    case 'solid-shapes':
      return <SolidShapes shapes={visual.shapes} compact={compact} />;
    case 'composed-shape':
      return (
        <ComposedShape
          name={visual.name}
          // Potongan yang bisa disentuh butuh sasaran ≥44px (CLAUDE.md §2).
          size={interactive && visual.tap ? 200 : 150}
          note={visual.note}
          onTap={interactive && visual.tap ? onValue : undefined}
        />
      );
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
    case 'coordinate-grid':
      return (
        <CoordinatePlane
          points={visual.points}
          quadrants={visual.quadrants}
          range={visual.range}
          shape={visual.shape}
          showCoords={visual.showCoords}
          guides={visual.guides}
          showAxisNames={visual.showAxisNames}
          showOrigin={visual.showOrigin}
        />
      );
    case 'evidence-text':
      return (
        // Interaktif hanya untuk langkah `tap-clue`: ketukan dikirim sebagai INDEKS
        // kalimat lewat onValue, layar Learn yang memutuskan benar/salahnya.
        <EvidenceText
          sentences={visual.sentences}
          title={visual.title}
          interactive={interactive}
          onSelect={interactive ? onValue : undefined}
          rejectedIndices={rejected}
          selectedIndex={clue ?? null}
          selectedTone={clue != null ? 'correct' : null}
        />
      );
    case 'sequence-cards':
      return <SequenceCards cards={visual.cards} interactive={false} />;
    case 'science-scene':
      // Tidak interaktif (panel Hint, langkah watch) = adegan memutar pilihannya
      // sendiri sekali, supaya sebab-akibatnya tetap TERLIHAT bergerak.
      return (
        <ScienceScene
          visual={visual}
          interactive={interactive}
          onValue={interactive ? onValue : undefined}
          compact={compact}
        />
      );
  }
}
