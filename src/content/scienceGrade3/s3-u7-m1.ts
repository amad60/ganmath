import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const soundTravels: ContentModule = {
  id: 's3-u7-m1',
  unitId: 's3-u7',
  grade: 3,
  title: 'Sound Travels',
  icon: '🔔',
  prereq: ['s3-u6-m1'],
  skills: ['sci-sound-travel'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['shake', 'sound', 'far', 'quiet', 'near', 'loud', 'drum', 'hear', 'dog', 'bark', 'barks', 'stand'],

  learn: [
    // Drumnya dipukul sama kerasnya; yang diubah hanya jarak telinga. Not musik
    // besar = keras, kecil dan pudar = pelan — ukuran gambar menggantikan volume
    // karena suara app bisa mati (setelan) dan anak tetap harus "mendengar" bedanya.
    {
      stage: 'concrete',
      prompt: 'Stand near the drum, or far.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🥁', 14, 70, 20), at('🧒', 56, 68, 22), ground()],
        options: [
          {
            icon: '🧍',
            label: 'Near',
            caption: 'Near the drum, it is loud.',
            result: [
              at('🥁', 14, 70, 20, { fx: 'shake' }),
              at('🎵', 28, 40, 18, { fx: 'pop' }),
              at('🧒', 40, 68, 22, { fx: 'slide-left' }),
              ground(),
            ],
          },
          {
            icon: '🏃',
            label: 'Far',
            caption: 'Far away, it is quiet.',
            result: [
              at('🥁', 14, 70, 20, { fx: 'shake' }),
              at('🎵', 80, 44, 8, { dim: true, fx: 'pop' }),
              at('🧒', 88, 68, 18, { fx: 'slide-right' }),
              ground(),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Sumber lain (anjing menggonggong jauh) dengan arah tebakan yang sama:
    // jauh = pelan. Soal gambar tidak memakai anjing supaya ini bukan kuncinya.
    {
      stage: 'pictorial',
      prompt: 'A far dog barks. What do you hear?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🧒', 14, 68, 22), at('🐕', 88, 72, 14, { flip: true }), ground()],
        options: [
          {
            icon: '🔈',
            label: 'A quiet bark',
            caption: 'Far away, the bark is quiet.',
            result: [
              at('🧒', 14, 68, 22),
              at('🎵', 26, 42, 8, { dim: true, fx: 'pop' }),
              at('🐕', 88, 72, 14, { flip: true, fx: 'shake' }),
              ground(),
            ],
          },
          { icon: '📢', label: 'A loud bark', caption: 'A loud bark.' },
          { icon: '🔇', label: 'No sound', caption: 'No sound.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Far away the sound is quiet.',
      visual: {
        kind: 'evidence-text',
        title: 'Through the air',
        sentences: ['Sound moves through the air. Farther away, it is quieter.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-sound-travel', [
      {
        ask: 'Why is this bell quiet?',
        bg: 'day',
        base: [at('🧒', 16, 68, 22), at('🔔', 86, 34, 10), at('🎵', 68, 28, 8, { dim: true }), ground()],
        cards: [
          { icon: '📏', label: 'It is far' },
          { icon: '🔔', label: 'It is near' },
          { icon: '📢', label: 'Far is louder' },
        ],
      },
      {
        ask: 'What keeps this drum loud?',
        bg: 'day',
        base: [at('🥁', 28, 64, 28), at('🧒', 62, 66, 24), at('🎵', 46, 34, 20), ground()],
        cards: [
          { icon: '🧍', label: 'You are near' },
          { icon: '🏃', label: 'You are far' },
          { icon: '🚫', label: 'Air stops sound' },
        ],
      },
      {
        ask: 'What made this sound quiet?',
        bg: 'day',
        base: [at('✈️', 84, 14, 12), at('🧒', 22, 70, 22), at('🎵', 48, 36, 8, { dim: true }), ground()],
        cards: [
          { icon: '📏', label: 'The plane is far' },
          { icon: '👂', label: 'The plane is near' },
          { icon: '📢', label: 'Far is louder' },
        ],
      },
      {
        ask: 'Why is this trumpet loud?',
        bg: 'day',
        base: [at('🎺', 32, 54, 24), at('🧒', 58, 66, 22), at('🎵', 48, 32, 18), ground()],
        cards: [
          { icon: '👂', label: 'It is close' },
          { icon: '✈️', label: 'It is far away' },
          { icon: '🚫', label: 'Air blocks sound' },
        ],
      },
      {
        ask: 'What helps sound move here?',
        bg: 'day',
        base: [at('🔔', 16, 58, 16), at('🎵', 40, 40, 12), at('🎵', 62, 32, 8, { dim: true }), at('🧒', 84, 68, 20), ground()],
        cards: [
          { icon: '💨', label: 'Air carries it' },
          { icon: '🚫', label: 'Air stops it' },
          { icon: '📢', label: 'Distance makes it louder' },
        ],
      },
      {
        ask: 'What caused this shout to fade?',
        bg: 'day',
        base: [at('🧒', 14, 68, 20), at('👦', 86, 70, 14), at('🎵', 64, 40, 8, { dim: true }), ground()],
        cards: [
          { icon: '📏', label: 'Your friend is far' },
          { icon: '👂', label: 'Your friend is near' },
          { icon: '📢', label: 'A far shout is louder' },
        ],
      },
      {
        ask: 'What did the distance do?',
        bg: 'day',
        base: [at('📻', 16, 62, 16), at('🧒', 84, 68, 20), at('🎵', 52, 36, 8, { dim: true }), ground()],
        cards: [
          { icon: '📏', label: 'It made sound quiet' },
          { icon: '📢', label: 'It made sound louder' },
          { icon: '🚫', label: 'It did nothing' },
        ],
      },
      {
        ask: 'What does a loud sound need?',
        bg: 'room',
        base: [at('🔔', 36, 48, 26), at('👂', 64, 52, 18), at('🎵', 50, 28, 18)],
        cards: [
          { icon: '📏', label: 'A short distance' },
          { icon: '🛣️', label: 'A long distance' },
          { icon: '🚫', label: 'No air' },
        ],
      },
    ]),
  ],
};
