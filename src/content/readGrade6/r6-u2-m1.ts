import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

/** Paragraf. Satu kalimat yang menunjukkan bangun teks: urutan, beda, sebab, solusi, deskripsi, atau jawaban. */
const stories: ClueStory[] = [
  {
    title: 'Bread Day',
    ask: 'Which sentence shows these events are in time order?',
    clue: 1,
    sentences: [
      'The class baked bread for the market.',
      'First they mixed the dough before school.',
      'The loaves came out brown.',
      'Parents waited by the gate.',
      'Coins went into a jar.',
    ],
  },
  {
    title: 'Two Beds',
    ask: 'Which sentence shows a difference between the beds?',
    clue: 2,
    sentences: [
      'Both gardens grow tomatoes.',
      'The north bed gets sun all morning.',
      'Unlike that bed, the south bed stays in shade after lunch.',
      'Both beds use the same soil.',
      'A fence keeps rabbits out.',
    ],
  },
  {
    title: 'The Flooded Path',
    ask: 'Which sentence gives the cause?',
    clue: 1,
    sentences: [
      'The river rose over the path.',
      'Because the dam gate was left open, water kept coming.',
      'People moved their bikes uphill.',
      'Shops closed for an hour.',
      'By night the path was under water.',
    ],
  },
  {
    title: 'Dark Hall',
    ask: 'Which sentence is the solution?',
    clue: 2,
    sentences: [
      'The hall was too dark for the show.',
      'Actors could not see their marks.',
      'The crew added two lamps by the stage.',
      'Programs were already printed.',
      'Families found their seats.',
    ],
  },
  {
    title: 'The Old Library',
    ask: 'Which sentence describes the room, rather than giving an instruction?',
    clue: 2,
    sentences: [
      'Please whisper between the rows.',
      'Return books to the front desk.',
      'A green lamp sits on the oak desk.',
      'Sign in at the door.',
      'Push your chair in when you leave.',
    ],
  },
  {
    title: 'Leaf Color',
    ask: 'Which sentence answers the question?',
    clue: 1,
    sentences: [
      'Why do leaves change color in the fall?',
      'The green fades when the days get short.',
      'Squirrels hide nuts in the grass.',
      'People rake the yard on Saturday.',
      'The path gets slippery after rain.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'First mix, then bake, then cool. How is this text built?',
    options: ['Time order', 'Compare two things', 'A question', 'A list of problems'],
  },
  {
    ask: 'Both are pets. Only the dog swims. How is this text built?',
    options: ['Compare two things', 'Time order', 'A set of steps', 'A diary'],
  },
  {
    ask: 'The road flooded because the drain was blocked. How is this text built?',
    options: ['Cause and effect', 'Compare two roads', 'A question', 'A description of color'],
  },
  {
    ask: 'The room was too hot for the test. Opening the windows fixed it. How is this text built?',
    options: ['Problem and solution', 'Compare two rooms', 'A question', 'Time order across years'],
  },
  {
    ask: 'The cave is dark, damp, and cool, with wet stone walls. How is this text built?',
    options: ['Description', 'Time order', 'Problem and solution', 'Compare two caves'],
  },
  {
    ask: 'What eats the corn at night? Deer do. How is this text built?',
    options: ['Question and answer', 'Time order', 'Compare two animals', 'A list of steps'],
  },
];

export const howItIsBuilt: ContentModule = {
  id: 'r6-u2-m1',
  unitId: 'r6-u2',
  grade: 6,
  title: 'How It Is Built',
  icon: '🧱',
  prereq: ['r6-u1-m1'],
  skills: ['read-structure'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['text', 'built', 'sentence', 'shows', 'order', 'signal', 'pattern'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'See how the text is built.',
      visual: {
        kind: 'evidence-text',
        title: 'Bread',
        sentences: [
          'The class baked bread.',
          'First they mixed the dough.',
          'Then the loaves came out.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence that shows order.',
      visual: {
        kind: 'evidence-text',
        title: 'Order',
        sentences: [
          'The class baked bread.',
          'First they mixed the dough.',
          'Parents waited by the gate.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'The signal shows the pattern.',
      visual: {
        kind: 'evidence-text',
        title: 'Pattern',
        sentences: ['First, unlike, because, and the fix each show how a text is built.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-structure',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-structure',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
