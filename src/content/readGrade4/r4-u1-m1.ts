import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Park and Beach',
    ask: 'Which sentence tells how the two places are ALIKE?',
    clue: 2,
    sentences: [
      'The park has shady oak trees.',
      'The beach has warm salty water.',
      'Families go to both places to play.',
    ],
  },
  {
    title: 'Two Fox Reports',
    ask: 'Which sentence is true ONLY of the desert fox?',
    clue: 0,
    sentences: [
      'The desert fox has huge ears that shed heat.',
      'The arctic fox grows a white winter coat.',
      'Both foxes hunt small animals.',
    ],
  },
  {
    title: 'City and Farm',
    ask: 'Which sentence is true ONLY of the farm?',
    clue: 1,
    sentences: [
      'The city has tall apartment buildings.',
      'The farm grows rows of corn.',
      'People live and work in both places.',
    ],
  },
  {
    title: 'Bike and Bus',
    ask: 'Which sentence tells how the two rides are ALIKE?',
    clue: 0,
    sentences: [
      'Both rides can take you to school.',
      'A bike moves by pedals.',
      'A bus carries many riders at once.',
    ],
  },
  {
    title: 'Two Storm Texts',
    ask: 'Which sentence is true ONLY of the snowstorm text?',
    clue: 2,
    sentences: [
      'The rain text says streets flood quickly.',
      'Both texts warn people to stay inside.',
      'The snow text says ice covers the road.',
    ],
  },
  {
    title: 'Cat and Dog',
    ask: 'Which sentence tells how the two pets are ALIKE?',
    clue: 1,
    sentences: [
      'A cat climbs with sharp claws.',
      'Both pets need food, water, and care.',
      'A dog is often trained to fetch.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'Text A: The lake is deep and cold. Text B: The lake is deep and full of fish. What is the SAME?',
    options: ['The lake is deep', 'The lake is cold', 'The lake is full of fish', 'The lake is frozen'],
  },
  {
    ask: 'Text A says the bridge is new. Text B says the bridge is old. How do they differ?',
    options: ['They disagree about the age', 'They both say it is wooden', 'They describe two rivers', 'They are the same text'],
  },
  {
    ask: 'Text A: Maya paints at dawn. Text B: Maya paints at night. What do both texts say she does?',
    options: ['She paints', 'She paints at dawn', 'She paints at night', 'She sells paintings'],
  },
  {
    ask: 'Text A lists a camel’s hump. Text B lists a camel’s eyelashes. What is each text doing?',
    options: ['Telling a different camel feature', 'Saying camels cannot live in sand', 'Describing a horse', 'Giving a story ending'],
  },
  {
    ask: 'One recipe uses honey. The other uses sugar. What is different?',
    options: ['The sweetener', 'The need to stir', 'The size of the bowl', 'The title of the cook'],
  },
  {
    ask: 'Both science notes say frogs lay eggs in water. One adds that tadpoles breathe with gills. What is extra in that note?',
    options: ['Tadpoles breathe with gills', 'Frogs lay eggs', 'Eggs are in water', 'Frogs can jump'],
  },
];

export const compareTwoTexts: ContentModule = {
  id: 'r4-u1-m1',
  unitId: 'r4-u1',
  grade: 4,
  title: 'Same and Different',
  icon: '⚖️',
  prereq: [],
  skills: ['read-compare'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['alike', 'only', 'both', 'differ', 'same', 'place', 'text', 'share', 'topic', 'different', 'be', 'true'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Two texts can share one topic.',
      visual: {
        kind: 'evidence-text',
        title: 'Park and Beach',
        sentences: ['The park has trees.', 'The beach has water.', 'Families play at both.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap how the two places are alike.',
      visual: {
        kind: 'evidence-text',
        title: 'Lake and Pool',
        sentences: [
          'The lake has fish and frogs.',
          'The pool has a long slide.',
          'People swim in both places.',
        ],
      },
      action: 'tap-clue',
      target: 2,
    },
    {
      stage: 'abstract',
      prompt: 'Alike and different can both be true.',
      visual: {
        kind: 'evidence-text',
        title: 'Compare',
        sentences: ['Same topic does not mean same details.'],
      },
      action: 'watch',
      caption: 'same ➔ different',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-compare',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-compare',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
