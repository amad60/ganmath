import type { ContentModule } from '../types';

export const materialsChange: ContentModule = {
  id: 's1-u3-m1',
  unitId: 's1-u3',
  grade: 1,
  title: 'Hard, Soft, and Change',
  icon: '🪨',
  prereq: ['s1-u2-m1'],
  skills: ['sci-materials'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['rock', 'hard', 'heavy', 'leaf', 'soft', 'light', 'ice', 'melt', 'watch', 'object', 'look'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A rock is hard and heavy.',
      visual: {
        kind: 'evidence-text',
        title: 'Rock and leaf',
        sentences: ['A rock does not bend.', 'A leaf folds in the hand.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Watch the object.',
      visual: {
        kind: 'evidence-text',
        title: 'Watch it',
        sentences: ['One object meets water or sun.', 'See what changes.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Ice melts into water.',
      visual: {
        kind: 'evidence-text',
        title: 'A change',
        sentences: ['Hard ice in the sun becomes water.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-materials',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what happens?',
      visual: (p) => {
        const stories = [
          {
            title: 'Pebble',
            sentences: ['The pebble drops in the bowl.', 'It goes down to the bottom.'],
          },
          {
            title: 'Cork',
            sentences: ['The cork drops in the bowl.', 'It stays on top of the water.'],
          },
          {
            title: 'Ice cube',
            sentences: ['The ice cube sits in the sun.', 'It turns into a puddle.'],
          },
          {
            title: 'Sponge',
            sentences: ['The sponge is squeezed.', 'It feels soft in the hand.'],
          },
          {
            title: 'Brick',
            sentences: ['The brick is tapped.', 'It feels hard and does not bend.'],
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
      skill: 'sci-materials',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A coin is put in water. What happens?',
          'A leaf is put in water. What happens?',
          'An ice cube sits in the sun. What happens?',
          'A pillow is squeezed. How does it feel?',
          'A stone is tapped. How does it feel?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It sinks', 'It flies', 'It sings', 'It blooms'],
          ['It floats', 'It rings', 'It cooks', 'It reads'],
          ['It melts', 'It grows fur', 'It lays eggs', 'It rings'],
          ['Soft', 'Sharp', 'Loud', 'Sweet'],
          ['Hard', 'Sweet', 'Quiet', 'Floppy'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
