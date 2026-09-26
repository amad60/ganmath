export type ColumnSumProps = {
  a: number;
  b: number;
  op?: '+' | '−';
  compact?: boolean;
  /** Tutorial Learn menampilkan jumlah. Hint latihan menyembunyikannya. */
  showTotal?: boolean;
};

function Row({
  op,
  n,
  note,
  big,
}: {
  op?: string;
  n: number;
  note?: string;
  big?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(3.5rem,auto)_1fr] items-baseline gap-x-2">
      <span className="text-right text-[22px] font-black">{op ?? ''}</span>
      <span
        className="text-right font-black tabular-nums"
        style={{ fontSize: big ? 30 : 26, lineHeight: 1.15 }}
      >
        {n}
      </span>
      {note ? <span className="text-ink-soft text-[15px] font-bold">{note}</span> : <span />}
    </div>
  );
}

function Rule() {
  return (
    <div
      className="my-0.5 ml-6 h-[3px] rounded-full"
      style={{ width: '4.2rem', background: 'var(--c-ink)' }}
    />
  );
}

/**
 * Penjumlahan bersusun cara jumlah-sebagian: satuan dulu, puluhan, lalu digabung.
 * Anak yang macet di "26 + 37 = ?" perlu MELIHAT langkah di kertas, bukan dua tumpukan blok.
 *
 * Puluhan ditulis 50, bukan 5, supaya 13 + 50 = 63 bisa dibaca tanpa "5 artinya lima puluh".
 *
 *     26
 *   + 37
 *   ----
 *     13  6 + 7
 *   + 50  20 + 30
 *   ----
 *     63  13 + 50
 */
function ColumnAdd({ a, b, compact, showTotal }: { a: number; b: number; compact?: boolean; showTotal: boolean }) {
  const aOnes = a % 10;
  const bOnes = b % 10;
  const aTens = (Math.floor(a / 10) % 10) * 10;
  const bTens = (Math.floor(b / 10) % 10) * 10;
  const aHundreds = Math.floor(a / 100) * 100;
  const bHundreds = Math.floor(b / 100) * 100;
  const ones = aOnes + bOnes;
  const tensVal = aTens + bTens;
  const hundredsVal = aHundreds + bHundreds;
  const total = a + b;
  const showOnes = ones !== 0 || tensVal === 0;
  const parts: number[] = [];
  if (showOnes) parts.push(ones);
  if (tensVal !== 0) parts.push(tensVal);
  if (hundredsVal !== 0) parts.push(hundredsVal);

  return (
    <div
      className={compact ? 'text-[15px]' : ''}
      aria-label={
        showTotal
          ? `${a} plus ${b}. Ones ${ones}. Tens ${tensVal}. Total ${total}.`
          : `${a} plus ${b}. Ones ${ones}. Tens ${tensVal}.`
      }
    >
      <Row n={a} />
      <Row op="+" n={b} />
      <Rule />
      {showOnes ? <Row n={ones} note={`${aOnes} + ${bOnes}`} /> : null}
      {tensVal !== 0 ? (
        <Row op={showOnes ? '+' : undefined} n={tensVal} note={`${aTens} + ${bTens}`} />
      ) : null}
      {hundredsVal !== 0 ? <Row op="+" n={hundredsVal} note={`${aHundreds} + ${bHundreds}`} /> : null}
      {showTotal ? (
        <>
          <Rule />
          <Row n={total} big note={parts.length >= 2 ? parts.join(' + ') : undefined} />
        </>
      ) : null}
    </div>
  );
}

/**
 * Pengurangan bersusun: kalau satuan tidak cukup, buka satu puluhan dulu.
 *
 *     52
 *   − 27
 *   ----
 *   12 − 7 = 5  ones
 *    4 − 2 = 2  tens
 *   ----
 *     25
 */
function ColumnSub({ a, b, compact, showTotal }: { a: number; b: number; compact?: boolean; showTotal: boolean }) {
  const needOpen = a % 10 < b % 10;
  const aOnes = needOpen ? (a % 10) + 10 : a % 10;
  const aTens = needOpen ? Math.floor(a / 10) - 1 : Math.floor(a / 10);
  const ones = aOnes - (b % 10);
  const tens = aTens - Math.floor(b / 10);
  const total = a - b;

  return (
    <div
      className={compact ? 'text-[15px]' : ''}
      aria-label={
        needOpen
          ? `${a} minus ${b}. Open one ten. ${aOnes} take ${b % 10} is ${ones}. ${aTens} take ${Math.floor(b / 10)} is ${tens}.${showTotal ? ` Total ${total}.` : ''}`
          : `${a} minus ${b}. Ones ${ones}. Tens ${tens * 10}.${showTotal ? ` Total ${total}.` : ''}`
      }
    >
      <Row n={a} />
      <Row op="−" n={b} />
      <Rule />
      <div className="text-[18px] font-bold">
        <p>
          {aOnes} − {b % 10} = {ones}{' '}
          <span className="text-ink-soft">ones</span>
        </p>
        <p>
          {aTens} − {Math.floor(b / 10)} = {tens}{' '}
          <span className="text-ink-soft">tens</span>
        </p>
      </div>
      {showTotal ? (
        <>
          <Rule />
          <Row n={total} big />
        </>
      ) : null}
    </div>
  );
}

export function ColumnSum({ a, b, op = '+', compact, showTotal = true }: ColumnSumProps) {
  return op === '−' ? (
    <ColumnSub a={a} b={b} compact={compact} showTotal={showTotal} />
  ) : (
    <ColumnAdd a={a} b={b} compact={compact} showTotal={showTotal} />
  );
}
