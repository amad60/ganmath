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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
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
    {
      type: 'clue-tap',
      skill: 'sci-sound-travel',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the sound?',
      visual: (p) => {
        const stories = [
          {
            title: 'The string',
            sentences: ['He plucks the string.', 'The string shakes and a sound comes.'],
          },
          {
            title: 'Down the hall',
            sentences: ['She stands far away.', 'The sound is quieter there.'],
          },
          {
            title: 'Covered ears',
            sentences: ['The drum is loud.', 'Covered ears make it hard to hear.'],
          },
          {
            title: 'The drum',
            sentences: ['The drum skin is tapped.', 'It shakes and the sound moves through the air.'],
          },
          {
            title: 'Closer',
            sentences: ['She walks toward the bell.', 'The sound is louder up close.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
    {
      type: 'choose-text',
      skill: 'sci-sound-travel',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A string is plucked and it shakes. What do you hear?',
          'You walk far from a drum. What happens to the sound?',
          'What does sound move through to reach you?',
          'You cover your ears. What changes?',
          'A bell is tapped and keeps shaking. What do you hear?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A sound', 'Nothing, a shake is silent', 'Only light', 'Only a pale leaf'],
          ['It gets quiet', 'It gets louder', 'It becomes light', 'It turns to soil'],
          ['Air', 'A box with no air', 'Fur only', 'Soil only'],
          ['The sound is harder to hear', 'The drum gets louder', 'The string stops being string', 'The air turns to water'],
          ['A sound', 'Nothing at all', 'Only light', 'Only wind with no sound'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-sound-travel', [
      {
        bg: 'room',
        base: [at('🔔', 40, 44, 24), at('🧒', 62, 64, 24)],
        cards: [
          { icon: '🔊', label: 'A loud ring' },
          { icon: '🔇', label: 'No sound' },
          { icon: '🌈', label: 'A rainbow' },
        ],
      },
      {
        bg: 'day',
        base: [at('✈️', 82, 12, 10), at('🧒', 30, 70, 24), ground()],
        cards: [
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '📢', label: 'A loud sound' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🎺', 30, 54, 22), at('🧒', 52, 66, 22), ground()],
        cards: [
          { icon: '📢', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('⛈️', 86, 14, 12), at('🧒', 20, 70, 24), ground()],
        cards: [
          { icon: '🔉', label: 'A quiet boom' },
          { icon: '🔥', label: 'A fire' },
          { icon: '🌸', label: 'A flower grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧒', 12, 68, 22), at('⛪', 86, 56, 16), at('🔔', 86, 32, 8), ground()],
        cards: [
          { icon: '🔈', label: 'A quiet ring' },
          { icon: '📢', label: 'A loud ring' },
          { icon: '🍎', label: 'An apple falls' },
        ],
      },
    ]),
  ],
};
