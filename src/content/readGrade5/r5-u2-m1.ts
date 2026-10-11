import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Market Morning',
    ask: 'Which sentence tells the WHOLE paragraph, not one detail?',
    clue: 0,
    sentences: [
      'A Saturday market takes a family from dawn until the bags are full.',
      'Mother chose ripe mangoes.',
      'Father argued over the price of rice.',
      'The little boy held the empty basket at the start.',
      'They walked home with both hands full.',
    ],
  },
  {
    title: 'River Clean',
    ask: 'Which sentence tells the WHOLE paragraph, not one detail?',
    clue: 4,
    sentences: [
      'Class 5 carried gloves and sacks.',
      'They pulled plastic from the reeds.',
      'One student found a broken bucket.',
      'The teacher wrote down what they collected.',
      'The class spent the morning clearing rubbish from the riverbank.',
    ],
  },
  {
    title: 'Library Hour',
    ask: 'Which sentence tells the WHOLE paragraph, not one detail?',
    clue: 2,
    sentences: [
      'Sari picked a book about whales.',
      'Omar chose a comic.',
      'Everyone in the class used the quiet hour to read something they liked.',
      'The clock over the door ticked.',
      'No one spoke above a whisper.',
    ],
  },
  {
    title: 'Storm Prep',
    ask: 'Which sentence tells the WHOLE paragraph, not one detail?',
    clue: 0,
    sentences: [
      'The household got ready before the storm arrived.',
      'Windows were latched.',
      'A lamp was set on the table.',
      'Dry food went into a box.',
      'The radio stayed on for news.',
    ],
  },
  {
    title: 'School Garden',
    ask: 'Which sentence tells the WHOLE paragraph, not one detail?',
    clue: 3,
    sentences: [
      'Beans climbed the sticks.',
      'A watering can sat by the tap.',
      'Weeds came out in handfuls.',
      'The students cared for the garden all term.',
      'Tomatoes turned red in the last week.',
    ],
  },
  {
    title: 'Match Day',
    ask: 'Which sentence tells the WHOLE paragraph, not one detail?',
    clue: 1,
    sentences: [
      'The bus left at seven.',
      'The whole trip was about getting the team to the final and back.',
      'They ate bananas on the way.',
      'The game lasted an hour.',
      'They sang on the ride home.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'A paragraph tells about packing, the long ride, the tent, and the hike back. What is the best summary?',
    options: [
      'A family went camping for the weekend',
      'Someone packed a tent',
      'The hike back was uphill',
      'They ate rice at night',
    ],
  },
  {
    ask: 'A paragraph lists a fever, a clinic visit, rest, and a return to school. What is the best summary?',
    options: [
      'A child was ill and then got better',
      'The clinic had a long queue',
      'School opened on Monday',
      'The fever started at night',
    ],
  },
  {
    ask: 'A paragraph describes measuring, cutting, sanding, and painting a stool. What is the best summary?',
    options: [
      'They made a stool from start to finish',
      'The paint was blue',
      'Sandpaper is rough',
      'Someone measured twice',
    ],
  },
  {
    ask: 'A paragraph covers rehearsal, costumes, nerves, and the final bow. What is the best summary?',
    options: [
      'The class put on a play',
      'One costume was too long',
      'The bow lasted a second',
      'Rehearsal was on Tuesday',
    ],
  },
  {
    ask: 'A paragraph explains roots, the stem, leaves, and how flowers make seeds. What is the best summary?',
    options: [
      'The paragraph explains the parts of a plant',
      'Roots drink water',
      'Seeds are small',
      'Leaves are green',
    ],
  },
  {
    ask: 'A paragraph follows a lost key, a search, and the key under a mat. What is the best summary?',
    options: [
      'A lost key was found after a search',
      'The mat was brown',
      'Someone shouted in the hall',
      'Keys are made of metal',
    ],
  },
];

export const sumItUp: ContentModule = {
  id: 'r5-u2-m1',
  unitId: 'r5-u2',
  grade: 5,
  title: 'Sum It Up',
  icon: '📝',
  prereq: ['r5-u1-m1'],
  skills: ['read-summary'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['summary', 'whole', 'paragraph', 'detail', 'sentence', 'covers'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A summary covers the whole paragraph.',
      visual: {
        kind: 'evidence-text',
        title: 'Market Morning',
        sentences: [
          'The family shopped from dawn until the bags were full.',
          'They bought mangoes.',
          'They bought rice.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence that covers all.',
      visual: {
        kind: 'evidence-text',
        title: 'One Idea',
        sentences: [
          'They bought mangoes.',
          'A morning at the market filled every bag.',
          'Father paid for the rice.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A detail is not the summary.',
      visual: {
        kind: 'evidence-text',
        title: 'Summary',
        sentences: ['One sentence should fit every part, not just one fact.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-summary',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-summary',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
