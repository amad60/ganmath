import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Flat Tire',
    ask: 'Which sentence is the CAUSE, not the result?',
    clue: 1,
    sentences: [
      'The bicycle stopped in the middle of the lane.',
      'A nail had gone through the front tire.',
      'Rafi walked the rest of the way.',
      'He was late for practice.',
      'The coach pointed at the clock.',
    ],
  },
  {
    title: 'Wilted Row',
    ask: 'Which sentence is the CAUSE, not the result?',
    clue: 0,
    sentences: [
      'No one watered the beans for a week.',
      'The leaves drooped by Thursday.',
      'Two plants turned yellow.',
      'The class looked worried.',
      'They filled the can on Friday.',
    ],
  },
  {
    title: 'Early Bus',
    ask: 'Which sentence is the CAUSE, not the result?',
    clue: 2,
    sentences: [
      'The stop was empty when Sari arrived.',
      'She had to walk.',
      'Her clock had been ten minutes slow.',
      'Her shoes were dusty.',
      'She reached the gate out of breath.',
    ],
  },
  {
    title: 'Broken Bridge',
    ask: 'Which sentence is the CAUSE, not the result?',
    clue: 3,
    sentences: [
      'Cars turned back at the sign.',
      'The market was quiet that morning.',
      'Boats carried people instead.',
      'Floodwater had torn a plank from the bridge.',
      'School started an hour late.',
    ],
  },
  {
    title: 'Loud Night',
    ask: 'Which sentence is the CAUSE, not the result?',
    clue: 1,
    sentences: [
      'The baby cried until dawn.',
      'Thunder shook the windows all night.',
      'Mother looked tired at breakfast.',
      'Coffee went cold on the table.',
      'The walk to work felt long.',
    ],
  },
  {
    title: 'Prize Seeds',
    ask: 'Which sentence is the CAUSE, not the result?',
    clue: 4,
    sentences: [
      'The tomatoes were larger than last year.',
      'Neighbors asked for the name of the plant.',
      'The bed stayed damp.',
      'Bees visited every afternoon.',
      'The gardener had mixed rich compost into the soil.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'The lamp stayed on all night, so the room was hot by morning. What is the cause?',
    options: ['The lamp stayed on', 'The room was hot', 'Morning arrived', 'The window was shut only'],
  },
  {
    ask: 'Because the gate was locked, the team practiced in the street. What is the effect?',
    options: ['They practiced in the street', 'The gate was locked', 'The street was wide', 'Practice was on Tuesday'],
  },
  {
    ask: 'Smoke set off the alarm, and the class lined up outside. What happened because of the smoke?',
    options: ['The class lined up outside', 'The alarm was a new model', 'The class had a test', 'Smoke is always gray'],
  },
  {
    ask: 'The path was icy, so the bus took a longer road. Why did the bus change roads?',
    options: ['The path was icy', 'The road was longer', 'The driver was new', 'School was closed'],
  },
  {
    ask: 'After the well dried, villagers carried water from the river. What is the effect?',
    options: ['They carried water from the river', 'The well dried', 'The river is wide', 'Villagers own buckets'],
  },
  {
    ask: 'A loose bolt made the wheel wobble. Which part is the cause?',
    options: ['A loose bolt', 'The wheel wobbled', 'Wheels are round', 'The bolt is metal'],
  },
];

export const whyItFollowed: ContentModule = {
  id: 'r5-u4-m1',
  unitId: 'r5-u4',
  grade: 5,
  title: 'Why It Followed',
  icon: '🔗',
  prereq: ['r5-u3-m1'],
  skills: ['read-cause'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['cause', 'effect', 'result', 'sentence', 'because', 'followed', 'why', 'happened', 'follows'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A cause is why it happened.',
      visual: {
        kind: 'evidence-text',
        title: 'Flat Tire',
        sentences: ['A nail went through the tire.', 'Rafi walked the rest of the way.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the cause, not the result.',
      visual: {
        kind: 'evidence-text',
        title: 'Why',
        sentences: ['He was late.', 'A nail had punctured the tire.', 'The coach pointed at the clock.'],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'The effect follows the cause.',
      visual: {
        kind: 'evidence-text',
        title: 'Cause',
        sentences: ['Ask what made the next thing happen.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-cause',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-cause',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
