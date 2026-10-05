import type { ContentModule } from '../types';

export const orderOfEvents: ContentModule = {
  id: 'r1-u2-m1',
  unitId: 'r1-u2',
  grade: 1,
  title: 'First, Next, Last',
  icon: '⏳',
  prereq: ['r1-u1-m2'],
  skills: ['read-sequence'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'clue-tap'],
  visuals: ['sequence-cards', 'evidence-text'],
  vocab: ['first', 'next', 'last', 'seed', 'flower', 'watered', 'bloom', 'happen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Stories have a beginning, middle, and end.',
      visual: {
        kind: 'sequence-cards',
        cards: [
          { text: 'Plant a sunflower seed in the pot.', icon: '🌱' },
          { text: 'Water the seed every sunny day.', icon: '💧' },
          { text: 'A bright yellow flower blooms!', icon: '🌻' },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap what happens first.',
      visual: {
        kind: 'evidence-text',
        title: 'Mixed-Up Toast',
        sentences: [
          'Last, Ana eats the warm toast.',
          'First, she puts bread in the toaster.',
          'Next, the toast pops up.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'First, next, and last tell time order.',
      visual: {
        kind: 'evidence-text',
        title: 'Time Words',
        sentences: ['First we wash hands.', 'Last we eat lunch.'],
      },
      action: 'watch',
      caption: 'first ➔ last',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'read-sequence',
      params: { s: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'First, Ana wakes up. Next, she eats eggs. Last, she rides the bus. What happens FIRST?',
          'First, Budi finds a pencil. Next, he draws a bird. Last, he colors it. What happens LAST?',
          'First, clouds roll in. Next, rain falls down. Last, a rainbow shines. What happens NEXT in the middle?',
          'First, Dad buys seeds. Next, we dig the soil. Last, we plant them. What happens FIRST?',
          'First, warm water fills the tub. Next, Mimi jumps in. Last, she shakes dry. What happens LAST?',
        ];
        return stories[p.s as number] ?? '';
      },
      options: (p) => {
        const opts = [
          ['Ana wakes up', 'She eats eggs', 'She rides the bus', 'She goes to sleep'],
          ['He colors it', 'He finds a pencil', 'He draws a bird', 'He sharpens it'],
          ['Rain falls down', 'Clouds roll in', 'A rainbow shines', 'Snow falls'],
          ['Dad buys seeds', 'We dig the soil', 'We plant them', 'We water flowers'],
          ['She shakes dry', 'Water fills tub', 'Mimi jumps in', 'She runs away'],
        ];
        return opts[p.s as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    {
      type: 'clue-tap',
      skill: 'read-sequence',
      params: { s: [0, 4] },
      answer: () => 0, // kalimat pertama adalah kejadian pertama
      text: () => 'Which sentence tells what happened FIRST?',
      visual: (p) => {
        const stories = [
          {
            title: 'Morning Routine',
            sentences: ['First, Siti brushes her teeth.', 'Then, she puts on her clean uniform.', 'Last, she ties her shoes.'],
          },
          {
            title: 'Baking Cake',
            sentences: ['First, Dad mixes flour and milk.', 'Next, the oven bakes the cake.', 'Last, we eat a sweet slice.'],
          },
          {
            title: 'Kite Flying',
            sentences: ['First, Rudi ties string to the kite.', 'Next, the wind lifts the kite high.', 'Last, the kite lands on grass.'],
          },
          {
            title: 'Building Blocks',
            sentences: ['First, Timi lays a flat base.', 'Next, he stacks four tall towers.', 'Last, he puts a flag on top.'],
          },
          {
            title: 'Painting Picture',
            sentences: ['First, Dewi dips the brush in blue.', 'Next, she paints the big sky.', 'Last, she lets it dry in sun.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
  ],
};
