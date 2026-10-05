import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const homeChanges: ContentModule = {
  id: 's3-u3-m1',
  unitId: 's3-u3',
  grade: 3,
  title: 'When a Home Changes',
  icon: '🐸',
  prereq: ['s3-u2-m1'],
  skills: ['sci-habitat'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['frog', 'leave', 'dry', 'pond', 'need', 'wet', 'home', 'full', 'must', 'stay', 'stays', 'tree', 'trees', 'cut', 'new', 'find', 'bird', 'rock', 'sleep', 'sleeps', 'fly', 'flies', 'there'],

  learn: [
    // Kolamnya yang diubah, katak tetap katak. Rumah yang tidak lagi cocok
    // membuat hewan PERGI — gerak keluar itulah akibat yang perlu dilihat.
    {
      stage: 'concrete',
      prompt: 'Make the pond full, or dry.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(50, 82, 70, 12, 'blue'), at('🐸', 50, 66, 20), ground()],
        options: [
          {
            icon: '💧',
            label: 'Full pond',
            caption: 'A wet home. The frog stays.',
            result: [
              at('🌧️', 30, 16, 16, { fx: 'pop' }),
              bar(50, 82, 80, 14, 'blue', { fx: 'grow' }),
              at('🐸', 50, 66, 22, { fx: 'pop' }),
              ground(),
            ],
          },
          {
            icon: '☀️',
            label: 'Dry pond',
            caption: 'A dry home. The frog must leave.',
            result: [
              at('☀️', 82, 16, 18, { fx: 'pop' }),
              bar(50, 84, 70, 10, 'brown'),
              at('🐸', 86, 66, 18, { fx: 'slide-right' }),
              ground('yellow'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Hewan lain, perubahan lain (pohon ditebang) — supaya "rumah berubah → pindah"
    // terasa sebagai aturan, bukan fakta tentang katak saja.
    {
      stage: 'pictorial',
      prompt: 'The tree is cut. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🪵', 30, 78, 22), at('🐦', 30, 56, 16), at('🌳', 82, 56, 34), ground()],
        options: [
          {
            icon: '🌳',
            label: 'It finds a new tree',
            caption: 'It flies to a new home.',
            result: [at('🪵', 30, 78, 22), at('🌳', 82, 56, 34), at('🐦', 78, 40, 14, { fx: 'slide-right' }), ground()],
          },
          { icon: '🪨', label: 'It turns to rock', caption: 'It turns to rock.' },
          { icon: '😴', label: 'It sleeps there', caption: 'It sleeps there.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A frog needs a wet home.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['If the home no longer fits, the animal must leave or it cannot live there.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-habitat',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the change causes?',
      visual: (p) => {
        const stories = [
          {
            title: 'Smaller pond',
            sentences: ['The pond gets smaller.', 'The frog leaves the dry pond.'],
          },
          {
            title: 'Cut trees',
            sentences: ['The trees are cut down.', 'The birds lose the home in the branches.'],
          },
          {
            title: 'Dry river',
            sentences: ['The river dries in the heat.', 'The fish cannot live there.'],
          },
          {
            title: 'Filled in',
            sentences: ['People fill the pond with soil.', 'Frogs must find a wet home.'],
          },
          {
            title: 'Rain returns',
            sentences: ['Rain fills the dry pond.', 'Frogs can come back.'],
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
      skill: 'sci-habitat',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A pond dries up. What do the frogs do?',
          'Why does a frog leave a dry pond?',
          'The forest is cut down. What happens to the birds?',
          'Rain fills the pond again. What can happen?',
          'A fish is left in a dry ditch. What is wrong?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['They leave', 'They grow thick fur', 'They become rocks', 'They make light'],
          ['It needs a wet home', 'It needs a magnet', 'It likes dry sand best', 'It wants a dark box'],
          ['They lose their home', 'They turn pale', 'They become fish', 'They freeze'],
          ['Frogs can return', 'The water becomes fur', 'Fish grow feathers', 'The pond turns to metal'],
          ['It has no water home', 'It has too much fur', 'It has no magnet', 'It is really a bird'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-habitat', [
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 18), bar(50, 84, 70, 10, 'brown'), at('🐸', 50, 68, 20), ground('yellow')],
        cards: [
          { icon: '➡️', label: 'The frog leaves' },
          { icon: '🏊', label: 'It swims there' },
          { icon: '🌸', label: 'It grows a flower' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌧️', 40, 16, 20), bar(50, 84, 70, 10, 'brown'), ground()],
        cards: [
          { icon: '🐸', label: 'Frogs come back' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🏜️', label: 'It gets dry' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 18), at('🐟', 50, 76, 16), bar(50, 86, 40, 6, 'blue'), ground('yellow')],
        cards: [
          { icon: '💧', label: 'It needs water' },
          { icon: '🪽', label: 'It flies' },
          { icon: '🌳', label: 'It grows tall' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌧️', 50, 14, 20), bar(50, 86, 100, 16, 'blue'), at('🐜', 40, 74, 12), at('🐜', 58, 74, 12)],
        cards: [
          { icon: '⬆️', label: 'The ants move up' },
          { icon: '😴', label: 'They sleep there' },
          { icon: '🔥', label: 'They burn' },
        ],
      },
      {
        bg: 'day',
        base: [bar(50, 82, 70, 12, 'blue'), at('🐸', 90, 64, 16), ground()],
        cards: [
          { icon: '💦', label: 'It jumps in' },
          { icon: '🏜️', label: 'It goes to the sand' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
    ]),
  ],
};
