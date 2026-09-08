/**
 * Efek suara dibuat lewat WebAudio, bukan file — tidak menambah bundle sama sekali
 * dan tetap jalan offline. Semua pendek (<400ms) dan lembut.
 *
 * Tidak ada buzzer untuk jawaban salah: nadanya netral, tidak menurun.
 */
type Tone = { freq: number; dur: number; delay?: number; type?: OscillatorType; gain?: number };

let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

/** Audio di iOS harus dibuka oleh gestur pertama pengguna. */
export function unlockAudio(): void {
  if (ctx) return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctor) ctx = new Ctor();
    void ctx?.resume();
  } catch {
    ctx = null;
  }
}

function play(tones: Tone[]): void {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  for (const t of tones) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = t.type ?? 'sine';
      osc.frequency.value = t.freq;
      const start = now + (t.delay ?? 0);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(t.gain ?? 0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + t.dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + t.dur + 0.02);
    } catch {
      /* audio tidak boleh menjatuhkan app */
    }
  }
}

function buzz(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* tidak semua HP punya */
  }
}

export const sfx = {
  tap: () => play([{ freq: 520, dur: 0.05, gain: 0.08 }]),
  correct: () => {
    play([
      { freq: 660, dur: 0.12 },
      { freq: 880, dur: 0.16, delay: 0.09 },
    ]);
    buzz(12);
  },
  // netral, tidak menurun — "belum, coba lagi", bukan "salah!"
  retry: () => play([{ freq: 300, dur: 0.14, type: 'triangle', gain: 0.12 }]),
  star: () => {
    play([
      { freq: 784, dur: 0.12 },
      { freq: 988, dur: 0.12, delay: 0.1 },
      { freq: 1319, dur: 0.22, delay: 0.2 },
    ]);
    buzz([15, 40, 15]);
  },
  badge: () => {
    play([
      { freq: 523, dur: 0.14 },
      { freq: 659, dur: 0.14, delay: 0.12 },
      { freq: 784, dur: 0.14, delay: 0.24 },
      { freq: 1047, dur: 0.3, delay: 0.36 },
    ]);
    buzz([15, 40, 15]);
  },
};
