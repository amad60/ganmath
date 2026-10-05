import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'From Seed',
    ask: 'Which sentence tells what happens earliest?',
    clue: 0,
    sentences: [
      'A seed sits under damp soil.',
      'A green shoot pushes upward.',
      'Yellow flowers open in the sun.',
    ],
  },
  {
    title: 'Baking Bread',
    ask: 'Which sentence tells what happens earliest?',
    clue: 2,
    sentences: [
      'The loaf smells ready to eat.',
      'The bread cools on a rack.',
      'Flour and water are mixed into dough.',
    ],
  },
  {
    title: 'Clean Hands',
    ask: 'Which sentence tells what happens earliest?',
    clue: 1,
    sentences: [
      'Soapy hands get rubbed clean.',
      'The tap starts running.',
      'A towel dries the hands.',
    ],
  },
  {
    title: 'Paper Plane',
    ask: 'Which sentence tells what happens earliest?',
    clue: 2,
    sentences: [
      'The plane glides across the room.',
      'Both wings get folded down.',
      'A flat sheet of paper is picked up.',
    ],
  },
  {
    title: 'Letter Home',
    ask: 'Which sentence tells what happens earliest?',
    clue: 0,
    sentences: [
      'The address is written on the envelope.',
      'A stamp is pressed on the corner.',
      'The letter drops into the mailbox.',
    ],
  },
  {
    title: 'Boiled Egg',
    ask: 'Which sentence tells what happens earliest?',
    clue: 1,
    sentences: [
      'The shell is peeled away.',
      'The egg is set in a pot of water.',
      'The water heats until it bubbles.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'You mix the dough, then shape a loaf, then bake it. What comes right AFTER mixing?',
    options: ['Shape a loaf', 'Eat the bread', 'Buy the flour', 'Wash the pan'],
  },
  {
    ask: 'Water the soil, then press in a seed, then cover it. What comes right BEFORE the seed goes in?',
    options: ['Water the soil', 'Cover the seed', 'Pick the flowers', 'Label the pot'],
  },
  {
    ask: 'Tie your laces only after both feet are in the shoes. What must happen first?',
    options: ['Put both feet in the shoes', 'Tie a bow', 'Run to school', 'Take the shoes off'],
  },
  {
    ask: 'Rinse the brush after the paint is wiped off. What happens last?',
    options: ['Rinse the brush', 'Open the paint', 'Dip the brush', 'Choose a color'],
  },
  {
    ask: 'The soup must boil before you add the noodles. When do the noodles go in?',
    options: ['After the soup boils', 'Before the pot is filled', 'While the pan is dry', 'After the bowls are washed'],
  },
  {
    ask: 'Fold the letter, then seal the envelope, then add the stamp. What is in the middle?',
    options: ['Seal the envelope', 'Fold the letter', 'Add the stamp', 'Walk to the box'],
  },
];

export const informationOrder: ContentModule = {
  id: 'r3-u4-m1',
  unitId: 'r3-u4',
  grade: 3,
  title: 'What Happens First',
  icon: '🔢',
  prereq: ['r3-u3-m1'],
  skills: ['read-info-order'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['earliest', 'order', 'before', 'after', 'step', 'happen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Steps in a text happen in order.',
      visual: {
        kind: 'evidence-text',
        title: 'From Seed',
        sentences: ['A seed sits in soil.', 'A shoot comes up.', 'Flowers open.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap what happens earliest.',
      visual: {
        kind: 'evidence-text',
        title: 'Butterfly',
        sentences: [
          'A butterfly opens its wings.',
          'A tiny egg sits on a leaf.',
          'A caterpillar eats and grows.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Order shows what happens before.',
      visual: {
        kind: 'evidence-text',
        title: 'Sequence',
        sentences: ['Read what must happen before the next step.'],
      },
      action: 'watch',
      caption: 'before ➔ after',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-info-order',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-info-order',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
