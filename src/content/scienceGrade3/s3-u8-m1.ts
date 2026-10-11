import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

import type { SceneItem } from '../../engine/types';

/**
 * Rangkaian sebagai empat kabel di sekeliling adegan: baterai di kiri, bola lampu
 * di kanan. `gap` memotong kabel atas — celahnya sengaja lebar (14%) supaya
 * terlihat jelas di layar ponsel, karena celah itulah seluruh pelajarannya.
 */
function circuit(opts: { gap?: boolean; battery?: boolean; lit?: boolean; device?: string }): SceneItem[] {
  const top = opts.gap
    ? [bar(30, 24, 26, 3, 'red'), bar(73, 24, 20, 3, 'red')]
    : [bar(50, 24, 64, 3, 'red')];
  return [
    ...top,
    bar(50, 78, 64, 3, 'red'),
    bar(18, 51, 1.6, 55, 'red'),
    bar(82, 51, 1.6, 55, 'red'),
    ...(opts.battery === false ? [] : [at('🔋', 18, 51, 14)]),
    at(opts.device ?? '💡', 82, 51, 16, opts.lit ? { fx: 'pop' } : { dim: true }),
    ...(opts.lit ? [at('✨', 68, 38, 12, { fx: 'pop' })] : []),
  ];
}

export const closedPath: ContentModule = {
  id: 's3-u8-m1',
  unitId: 's3-u8',
  grade: 3,
  title: 'A Closed Path',
  icon: '💡',
  prereq: ['s3-u7-m1'],
  skills: ['sci-circuit'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['closed', 'path', 'light', 'bulb', 'gap', 'battery', 'wire', 'stay', 'stays', 'dark', 'now', 'burn', 'burns', 'freeze', 'freezes', 'lights', 'close'],

  learn: [
    // Komponennya sama persis; yang diubah hanya satu: jalurnya tertutup atau
    // ada celah. Lampu menyala/padam mengikuti celah itu, bukan baterainya.
    {
      stage: 'concrete',
      prompt: 'Close the path, or make a gap.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'night',
        base: circuit({ gap: true }),
        options: [
          {
            icon: '🔗',
            label: 'Closed',
            caption: 'A closed path. The bulb lights up.',
            result: circuit({ lit: true }),
          },
          {
            icon: '✂️',
            label: 'Gap',
            caption: 'A gap. The bulb stays dark.',
            result: circuit({ gap: true }),
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Baterai yang dilepas lalu dipasang lagi: jalur tertutup butuh SEMUA bagiannya.
    // Soal gambar tidak memakai "pasang baterai" supaya tebakan ini bukan kuncinya.
    {
      stage: 'pictorial',
      prompt: 'Put the battery in. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'night',
        base: [...circuit({ battery: false }), at('🔋', 50, 52, 14)],
        options: [
          {
            icon: '💡',
            label: 'The bulb lights',
            caption: 'The path is closed now. It lights!',
            result: circuit({ lit: true }),
          },
          { icon: '🌑', label: 'It stays dark', caption: 'It stays dark.' },
          { icon: '🔴', label: 'The wire lights', caption: 'The wire lights.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A gap stops the light.',
      visual: {
        kind: 'evidence-text',
        title: 'Open or closed',
        sentences: ['A closed path lets the bulb light. A gap stops it.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-circuit', [
      {
        ask: 'Why did this bulb light?',
        bg: 'night',
        base: circuit({ lit: true }),
        cards: [
          { icon: '🔗', label: 'The path is closed' },
          { icon: '✂️', label: 'A gap still lights' },
          { icon: '🚫', label: 'No path is needed' },
        ],
      },
      {
        ask: 'What keeps this bulb dark?',
        bg: 'night',
        base: circuit({ gap: true }),
        cards: [
          { icon: '✂️', label: 'A gap in the path' },
          { icon: '🔗', label: 'The path is closed' },
          { icon: '💡', label: 'A gap still lights' },
        ],
      },
      {
        ask: 'What is missing in this path?',
        bg: 'night',
        base: circuit({ battery: false }),
        cards: [
          { icon: '🔋', label: 'The battery' },
          { icon: '💡', label: 'A bulb is enough' },
          { icon: '✂️', label: 'A gap still works' },
        ],
      },
      {
        ask: 'What made this bulb light?',
        bg: 'night',
        base: [...circuit({ lit: true }), at('📎', 50, 16, 12)],
        cards: [
          { icon: '🔗', label: 'The gap was closed' },
          { icon: '✂️', label: 'The gap stayed open' },
          { icon: '💡', label: 'An open path lights' },
        ],
      },
      {
        ask: 'What helps this fan spin?',
        bg: 'room',
        base: circuit({ lit: true, device: '🌀' }),
        cards: [
          { icon: '🔗', label: 'A closed path' },
          { icon: '✂️', label: 'A gap in the wire' },
          { icon: '🚫', label: 'No path is needed' },
        ],
      },
      {
        ask: 'Why does this motor run?',
        bg: 'room',
        base: circuit({ lit: true, device: '⚙️' }),
        cards: [
          { icon: '🔗', label: 'The path has no gap' },
          { icon: '✂️', label: 'A gap makes it run' },
          { icon: '🚫', label: 'Motors need no path' },
        ],
      },
      {
        ask: 'What caused this lamp to stop?',
        bg: 'night',
        base: circuit({ gap: true, device: '🔦' }),
        cards: [
          { icon: '✂️', label: 'A gap opened the path' },
          { icon: '🔗', label: 'The path is closed' },
          { icon: '💡', label: 'A gap does not matter' },
        ],
      },
      {
        ask: 'Which part stops this bulb?',
        bg: 'night',
        base: circuit({ gap: true }),
        cards: [
          { icon: '✂️', label: 'The gap' },
          { icon: '🔋', label: 'The battery' },
          { icon: '🔗', label: 'A closed path stops it' },
        ],
      },
    ]),
  ],
};
