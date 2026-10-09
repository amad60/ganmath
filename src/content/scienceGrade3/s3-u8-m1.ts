import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

import type { SceneItem } from '../../engine/types';

/**
 * Rangkaian sebagai empat kabel di sekeliling adegan: baterai di kiri, bola lampu
 * di kanan. `gap` memotong kabel atas — celahnya sengaja lebar (14%) supaya
 * terlihat jelas di layar ponsel, karena celah itulah seluruh pelajarannya.
 */
function circuit(opts: { gap?: boolean; battery?: boolean; lit?: boolean }): SceneItem[] {
  const top = opts.gap
    ? [bar(30, 24, 26, 3, 'red'), bar(73, 24, 20, 3, 'red')]
    : [bar(50, 24, 64, 3, 'red')];
  return [
    ...top,
    bar(50, 78, 64, 3, 'red'),
    bar(18, 51, 1.6, 55, 'red'),
    bar(82, 51, 1.6, 55, 'red'),
    ...(opts.battery === false ? [] : [at('🔋', 18, 51, 14)]),
    at('💡', 82, 51, 16, opts.lit ? { fx: 'pop' } : { dim: true }),
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
          { icon: '🔥', label: 'It burns', caption: 'It burns.' },
          { icon: '🧊', label: 'It freezes', caption: 'It freezes.' },
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
        bg: 'night',
        base: circuit({}),
        cards: [
          { icon: '💡', label: 'The bulb lights' },
          { icon: '🌑', label: 'It stays dark' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'night',
        base: [...circuit({ gap: true }), at('✂️', 52, 24, 12)],
        cards: [
          { icon: '🌑', label: 'It stays dark' },
          { icon: '💡', label: 'The bulb lights' },
          { icon: '🌸', label: 'A flower grows' },
        ],
      },
      {
        bg: 'night',
        base: [...circuit({ lit: true }).filter((it) => it.icon !== '✨'), at('✂️', 50, 78, 12)],
        cards: [
          { icon: '🌚', label: 'The light goes out' },
          { icon: '☀️', label: 'It gets brighter' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'night',
        base: [...circuit({ gap: true }), at('👆', 52, 34, 12)],
        cards: [
          { icon: '✨', label: 'The gap closes and it lights' },
          { icon: '❄️', label: 'It snows' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'room',
        base: [bar(50, 24, 64, 3, 'red'), bar(50, 78, 64, 3, 'red'), bar(18, 51, 1.6, 55, 'red'), bar(82, 51, 1.6, 55, 'red'), at('🔋', 18, 51, 14), at('🌀', 82, 51, 16)],
        cards: [
          { icon: '🌀', label: 'The fan spins' },
          { icon: '🛑', label: 'It stops' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    
      {
        bg: 'room',
        base: [at('🔋', 28, 56, 18), at('💡', 72, 40, 18), at('✂️', 50, 70, 14)],
        cards: [
          { icon: '🌑', label: 'It stays dark' },
          { icon: '💡', label: 'The bulb lights' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🔋', 26, 58, 18), at('💡', 74, 40, 18)],
        cards: [
          { icon: '💡', label: 'The bulb lights' },
          { icon: '🌑', label: 'It stays dark' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'room',
        base: [at('💡', 50, 46, 22)],
        cards: [
          { icon: '🌑', label: 'It stays dark' },
          { icon: '✨', label: 'It gets brighter' },
          { icon: '❄️', label: 'It snows' },
        ],
      },
    ]),
  ],
};
