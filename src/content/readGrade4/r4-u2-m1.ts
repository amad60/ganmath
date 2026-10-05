import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Save the Pond',
    ask: 'Which sentence shows the author wants you to ACT?',
    clue: 1,
    sentences: [
      'The pond behind school is full of litter.',
      'Please bring gloves on Friday and help pick it up.',
      'Ducks still nest in the reeds.',
    ],
  },
  {
    title: 'How a Compass Works',
    ask: 'Which sentence TEACHES a fact?',
    clue: 2,
    sentences: [
      'I once got lost on a hike.',
      'You should always pack a snack.',
      'A compass needle points toward magnetic north.',
    ],
  },
  {
    title: 'The Talking Shoe',
    ask: 'Which sentence is there to make you SMILE?',
    clue: 0,
    sentences: [
      'The left shoe cleared its throat and asked for a day off.',
      'Shoes are made of leather or cloth.',
      'Please tie your laces before you run.',
    ],
  },
  {
    title: 'Join the Club',
    ask: 'Which sentence shows the author wants you to ACT?',
    clue: 2,
    sentences: [
      'The chess club meets in room 12.',
      'Last year the team won two matches.',
      'Sign up on the library door if you want to play.',
    ],
  },
  {
    title: 'Bat Facts',
    ask: 'Which sentence TEACHES a fact?',
    clue: 1,
    sentences: [
      'Please do not touch a bat you find.',
      'Most bats eat insects and help farms.',
      'A bat in a cape would look very fancy.',
    ],
  },
  {
    title: 'Rain Joke',
    ask: 'Which sentence is there to make you SMILE?',
    clue: 2,
    sentences: [
      'Clouds are made of tiny water drops.',
      'Carry a coat if the sky turns gray.',
      'The cloud said it was just feeling a little under the weather.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: '“Bring a bottle, a bag, and your friends — the beach cleanup starts at nine.” Why was this written?',
    options: ['To persuade you to help', 'To tell a joke', 'To explain how tides work', 'To describe a fish'],
  },
  {
    ask: '“A year on Mars lasts about 687 Earth days.” Why was this written?',
    options: ['To inform you of a fact', 'To make you buy a ticket', 'To make you laugh', 'To teach a recipe'],
  },
  {
    ask: '“The pencil gasped, ‘Not another math test!’ and tried to roll off the desk.” Why was this written?',
    options: ['To entertain you', 'To explain how pencils are made', 'To persuade you to study', 'To give a safety rule'],
  },
  {
    ask: '“Our town needs a new crosswalk. Write to the mayor today.” Why was this written?',
    options: ['To persuade you to act', 'To describe a holiday', 'To tell a funny story', 'To list cloud types'],
  },
  {
    ask: '“Honeybees dance to tell other bees where flowers are.” Why was this written?',
    options: ['To inform you', 'To sell honey', 'To make a joke', 'To ask for a vote'],
  },
  {
    ask: '“Why did the scarecrow win a prize? He was outstanding in his field.” Why was this written?',
    options: ['To entertain you', 'To teach farming steps', 'To ask you to visit', 'To compare two crops'],
  },
];

export const authorsPurpose: ContentModule = {
  id: 'r4-u2-m1',
  unitId: 'r4-u2',
  grade: 4,
  title: 'Why It Was Written',
  icon: '🎯',
  prereq: ['r4-u1-m1'],
  skills: ['read-purpose'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['author', 'purpose', 'inform', 'entertain', 'persuade', 'act', 'ask', 'why', 'reason'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Authors write for a reason.',
      visual: {
        kind: 'evidence-text',
        title: 'Three Reasons',
        sentences: ['To teach a fact.', 'To make you smile.', 'To ask you to act.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap where the author asks you to act.',
      visual: {
        kind: 'evidence-text',
        title: 'Feed the Birds',
        sentences: [
          'Birds visit our yard in winter.',
          'Food is hard for them to find.',
          'Please hang a seed feeder by your window.',
        ],
      },
      action: 'tap-clue',
      target: 2,
    },
    {
      stage: 'abstract',
      prompt: 'Purpose is why the author writes.',
      visual: {
        kind: 'evidence-text',
        title: 'Purpose',
        sentences: ['Inform, entertain, or persuade.'],
      },
      action: 'watch',
      caption: 'why ➔ purpose',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-purpose',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-purpose',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
