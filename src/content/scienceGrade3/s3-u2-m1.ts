import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const bodyCoverings: ContentModule = {
  id: 's3-u2-m1',
  unitId: 's3-u2',
  grade: 3,
  title: 'Body Coverings',
  icon: '🐻',
  prereq: ['s3-u1-m1'],
  skills: ['sci-cover'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['fur', 'animal', 'warm', 'feather', 'bird', 'scale', 'fish', 'keep', 'keeps', 'snow', 'cold', 'get', 'gets', 'with', 'rain', 'duck', 'dry', 'wet', 'stays', 'sink', 'sinks', 'falls', 'fall', 'thick'],

  learn: [
    // Salju yang sama, satu hal yang diubah: ada bulu tebal atau tidak. Hewan tanpa
    // penutup menggigil — anak melihat GUNA bulunya, bukan sekadar namanya.
    {
      stage: 'concrete',
      prompt: 'Snow falls. Give it fur, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'cloudy',
        base: [at('❄️', 24, 18, 10), at('❄️', 74, 14, 10), at('❓', 50, 62, 26), ground('white')],
        options: [
          {
            icon: '🐻',
            label: 'With fur',
            caption: 'Thick fur keeps the animal warm.',
            result: [
              at('❄️', 24, 18, 10, { fx: 'fall' }),
              at('❄️', 74, 14, 10, { fx: 'fall' }),
              at('🐻', 50, 62, 30, { fx: 'pop' }),
              ground('white'),
            ],
          },
          {
            icon: '🥶',
            label: 'No fur',
            caption: 'No fur. The animal gets cold.',
            result: [
              at('❄️', 24, 18, 10, { fx: 'fall' }),
              at('❄️', 74, 14, 10, { fx: 'fall' }),
              at('🥶', 50, 62, 26, { fx: 'shake' }),
              ground('white'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Hujan di bebek: penutup tubuh juga menjaga KERING, bukan hanya hangat.
    // Soal gambar tidak memakai bebek kehujanan supaya tebakan ini tidak jadi kunci.
    {
      stage: 'pictorial',
      prompt: 'Rain falls on a duck. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 20), at('🦆', 50, 66, 28), ground()],
        options: [
          {
            icon: '🦆',
            label: 'It stays dry',
            caption: 'Feathers keep the duck dry.',
            result: [
              at('🌧️', 50, 16, 20),
              at('💧', 34, 52, 9, { fx: 'fall' }),
              at('💧', 68, 56, 9, { fx: 'fall' }),
              at('🦆', 50, 66, 28, { fx: 'shake' }),
              ground(),
            ],
          },
          { icon: '🥶', label: 'It gets cold', caption: 'It gets cold.' },
          { icon: '🪨', label: 'It sinks', caption: 'It sinks.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Feathers keep a bird warm.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['Fur, feathers, and scales each help the animal where it lives.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-cover',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows how the covering helps?',
      visual: (p) => {
        const stories = [
          {
            title: 'Cold wind',
            sentences: ['The wind is cold.', 'Thick fur keeps the animal warm.'],
          },
          {
            title: 'In the pond',
            sentences: ['The fish swims along.', 'Scales cover its body in the water.'],
          },
          {
            title: 'On the branch',
            sentences: ['The bird sits in the cold.', 'Feathers keep it warm.'],
          },
          {
            title: 'Hot day',
            sentences: ['The day is hot.', 'Thin fur lets extra heat leave.'],
          },
          {
            title: 'On the pond',
            sentences: ['The duck lands.', 'Feathers keep the water off its skin.'],
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
      skill: 'sci-cover',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A wolf lives where it is cold. What helps?',
          'What covers a fish and helps it in water?',
          'What keeps a bird warm?',
          'An animal in a hot place has very thick fur. What is the problem?',
          'Why does a polar bear have thick fur?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Thick fur', 'Bare skin only', 'A metal shell', 'A pale leaf'],
          ['Scales', 'Fur', 'Feathers', 'A wool coat'],
          ['Feathers', 'Scales', 'A wet rock', 'A magnet'],
          ['It stays too warm', 'It cannot see', 'It melts at once', 'It becomes a plant'],
          ['To keep warm', 'To swim like a fish', 'To make food from light', 'To block every sound'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-cover', [
      {
        bg: 'cloudy',
        base: [at('❄️', 24, 16, 10), at('❄️', 76, 20, 10), at('🐻', 50, 62, 30), ground('white')],
        cards: [
          { icon: '🙂', label: 'It stays warm' },
          { icon: '🥶', label: 'It freezes' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('❄️', 22, 18, 10), at('🐧', 50, 60, 30), ground('white')],
        cards: [
          { icon: '🙂', label: 'It stays warm' },
          { icon: '🥵', label: 'It gets hot' },
          { icon: '🌱', label: 'It grows roots' },
        ],
      },
      {
        bg: 'water',
        base: [at('🐟', 50, 52, 26)],
        cards: [
          { icon: '🌊', label: 'It swims well' },
          { icon: '🏜️', label: 'It gets dry' },
          { icon: '🪽', label: 'It flies' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('❄️', 76, 16, 10), at('🐑', 46, 62, 30), at('✂️', 20, 50, 14), ground('white')],
        cards: [
          { icon: '🥶', label: 'It gets cold' },
          { icon: '🥵', label: 'It gets hot' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('❄️', 24, 16, 10), at('❄️', 76, 20, 10), at('🐦', 50, 62, 26), ground('white')],
        cards: [
          { icon: '🪶', label: 'Feathers keep it warm' },
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
    ]),
  ],
};
