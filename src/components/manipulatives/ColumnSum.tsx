import { useEffect, useState } from 'react';
import { columnPlaces } from './columnPlaces';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type ColumnSumProps = {
  a: number;
  b: number;
  op?: '+' | '−';
  compact?: boolean;
  /** Tutorial Learn menampilkan jumlah. Hint latihan menyembunyikannya. */
  showTotal?: boolean;
  /**
   * Putar barisnya sendiri, satu per satu. Dipakai panel Hint.
   * Jumlah akhir tetap tersembunyi kalau `showTotal` mati.
   */
  play?: boolean;
  /**
   * Berapa baris hitungan yang sudah dibuka anak (langkah Learn).
   * Kosong = tampilkan semua. `0` = baru operand.
   */
  reveal?: number;
};

const STEP_MS = 420;

function useAutoReveal(active: boolean, max: number): number {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    setN(0);
    if (max <= 0) return;
    const ms = teachingDuration(STEP_MS, reduced);
    let cur = 0;
    const id = window.setInterval(() => {
      cur += 1;
      setN(cur);
      if (cur >= max) window.clearInterval(id);
    }, ms);
    return () => window.clearInterval(id);
  }, [active, max, reduced]);

  return n;
}

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
  const reduced = useReducedMotion();
  return (
    <div
      className="grid grid-cols-[1.5rem_minmax(3.5rem,auto)_1fr] items-baseline gap-x-2"
      style={{ animation: `fade-rise ${teachingDuration(280, reduced)}ms both` }}
    >
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
function ColumnAdd({
  a,
  b,
  compact,
  showTotal,
  shown,
}: {
  a: number;
  b: number;
  compact?: boolean;
  showTotal: boolean;
  shown: number;
}) {
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
  const places = columnPlaces(a, b, '+');
  const visible = new Set(places.slice(0, shown));
  const showSum = showTotal && shown >= places.length;
  const parts: number[] = [];
  if (visible.has('ones')) parts.push(ones);
  if (visible.has('tens')) parts.push(tensVal);
  if (visible.has('hundreds')) parts.push(hundredsVal);

  const heard = [`${a} plus ${b}.`];
  if (visible.has('ones')) heard.push(`Ones ${ones}.`);
  if (visible.has('tens')) heard.push(`Tens ${tensVal}.`);
  if (visible.has('hundreds')) heard.push(`Hundreds ${hundredsVal}.`);
  if (showSum) heard.push(`Total ${total}.`);

  return (
    <div className={compact ? 'text-[15px]' : ''} aria-label={heard.join(' ')}>
      <Row n={a} />
      <Row op="+" n={b} />
      <Rule />
      {visible.has('ones') ? <Row n={ones} note={`${aOnes} + ${bOnes}`} /> : null}
      {visible.has('tens') ? (
        <Row op={visible.has('ones') ? '+' : undefined} n={tensVal} note={`${aTens} + ${bTens}`} />
      ) : null}
      {visible.has('hundreds') ? (
        <Row op="+" n={hundredsVal} note={`${aHundreds} + ${bHundreds}`} />
      ) : null}
      {showSum ? (
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
function ColumnSub({
  a,
  b,
  compact,
  showTotal,
  shown,
}: {
  a: number;
  b: number;
  compact?: boolean;
  showTotal: boolean;
  shown: number;
}) {
  const reduced = useReducedMotion();
  const needOpen = a % 10 < b % 10;
  const aOnes = needOpen ? (a % 10) + 10 : a % 10;
  const aTens = needOpen ? Math.floor(a / 10) - 1 : Math.floor(a / 10);
  const ones = aOnes - (b % 10);
  const tens = aTens - Math.floor(b / 10);
  const total = a - b;
  const showSum = showTotal && shown >= 2;
  const rise = { animation: `fade-rise ${teachingDuration(280, reduced)}ms both` };

  const heard = [`${a} minus ${b}.`];
  if (shown >= 1) {
    heard.push(needOpen ? `Open one ten. ${aOnes} take ${b % 10} is ${ones}.` : `Ones ${ones}.`);
  }
  if (shown >= 2) {
    heard.push(
      needOpen ? `${aTens} take ${Math.floor(b / 10)} is ${tens}.` : `Tens ${tens * 10}.`,
    );
  }
  if (showSum) heard.push(`Total ${total}.`);

  return (
    <div className={compact ? 'text-[15px]' : ''} aria-label={heard.join(' ')}>
      <Row n={a} />
      <Row op="−" n={b} />
      <Rule />
      {shown >= 1 ? (
        <div className="text-[18px] font-bold" style={rise}>
          <p>
            {aOnes} − {b % 10} = {ones} <span className="text-ink-soft">ones</span>
          </p>
          {shown >= 2 ? (
            <p>
              {aTens} − {Math.floor(b / 10)} = {tens} <span className="text-ink-soft">tens</span>
            </p>
          ) : null}
        </div>
      ) : null}
      {showSum ? (
        <>
          <Rule />
          <Row n={total} big />
        </>
      ) : null}
    </div>
  );
}

export function ColumnSum({
  a,
  b,
  op = '+',
  compact,
  showTotal = true,
  play = false,
  reveal,
}: ColumnSumProps) {
  const count = columnPlaces(a, b, op).length;
  const auto = useAutoReveal(play && reveal == null, count);
  const shown = reveal != null ? reveal : play ? auto : count;

  return op === '−' ? (
    <ColumnSub a={a} b={b} compact={compact} showTotal={showTotal} shown={shown} />
  ) : (
    <ColumnAdd a={a} b={b} compact={compact} showTotal={showTotal} shown={shown} />
  );
}
