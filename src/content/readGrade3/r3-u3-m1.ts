import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Snapped Kite',
    ask: 'Which sentence tells the PROBLEM?',
    clue: 0,
    sentences: [
      'The kite string snapped in the wind.',
      'Rudi tied a new knot.',
      'The kite climbed again.',
    ],
  },
  {
    title: 'Burning Cake',
    ask: 'Which sentence tells the SOLUTION?',
    clue: 2,
    sentences: [
      'The cake started to smell burnt.',
      'Smoke drifted from the oven.',
      'Dad switched the oven off.',
    ],
  },
  {
    title: 'Missing Pencil',
    ask: 'Which sentence tells the PROBLEM?',
    clue: 1,
    sentences: [
      'Ana opened her school bag.',
      'Her only pencil was missing.',
      'Timi lent her a spare one.',
    ],
  },
  {
    title: 'Wilted Plant',
    ask: 'Which sentence tells the SOLUTION?',
    clue: 0,
    sentences: [
      'Mina moved the pot into the shade.',
      'The leaves had drooped in the sun.',
      'By evening the plant stood up.',
    ],
  },
  {
    title: 'Locked Gate',
    ask: 'Which sentence tells the PROBLEM?',
    clue: 2,
    sentences: [
      'The team arrived for practice.',
      'Coach found another entrance.',
      'The front gate was locked shut.',
    ],
  },
  {
    title: 'Spilled Paint',
    ask: 'Which sentence tells the SOLUTION?',
    clue: 1,
    sentences: [
      'Blue paint ran across the table.',
      'Dewi wiped it with a wet cloth.',
      'The picture was still drying.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'The plant wilted in the hot sun. Mina moved it to the shade. What solved the problem?',
    options: ['Moving the plant to the shade', 'Buying a new plant', 'Painting the pot', 'Closing the window'],
  },
  {
    ask: 'The flashlight would not turn on. Leo put in fresh batteries. What was the problem?',
    options: ['The flashlight had no power', 'The room was too bright', 'Leo lost his shoes', 'The tent was wet'],
  },
  {
    ask: 'Rain came through a cracked window. Dad taped the crack. What solved the problem?',
    options: ['Taping the cracked window', 'Opening the window wider', 'Turning on a fan', 'Watering the garden'],
  },
  {
    ask: 'The soup was too salty. Nia added plain water and stirred. What was the problem?',
    options: ['The soup had too much salt', 'The bowl was empty', 'The spoon was wooden', 'Dinner was late'],
  },
  {
    ask: 'A wheel fell off the cart. Siti pushed the wheel back on. What solved the problem?',
    options: ['Putting the wheel back on', 'Leaving the cart outside', 'Painting the cart red', 'Buying a new bell'],
  },
  {
    ask: 'The dog hid under the bed during thunder. What was the problem?',
    options: ['The thunder frightened the dog', 'The bed was too small', 'The dog wanted a snack', 'The door was open'],
  },
];

export const problemAndSolution: ContentModule = {
  id: 'r3-u3-m1',
  unitId: 'r3-u3',
  grade: 3,
  title: 'Problem and Solution',
  icon: '🧩',
  prereq: ['r3-u2-m1'],
  skills: ['read-problem-solution'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['problem', 'solution', 'fixed', 'solved', 'wrong'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A problem is something that goes wrong.',
      visual: {
        kind: 'evidence-text',
        title: 'Snapped Kite',
        sentences: ['The kite string snapped in the wind.', 'Rudi tied a new knot.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'A solution is what fixes it.',
      visual: {
        kind: 'evidence-text',
        title: 'The Fix',
        sentences: ['Tying a new knot is the solution.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Find the problem, then the fix.',
      visual: {
        kind: 'evidence-text',
        title: 'Two Parts',
        sentences: ['The problem comes. The solution answers it.'],
      },
      action: 'watch',
      caption: 'problem ➔ fix',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-problem-solution',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-problem-solution',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
