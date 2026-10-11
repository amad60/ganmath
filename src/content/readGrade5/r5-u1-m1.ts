import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

/** Paragraf. Kalimat petunjuk menyiratkan sesuatu yang tidak ditulis langsung. */
const stories: ClueStory[] = [
  {
    title: 'The Bench',
    ask: 'Which sentence is the clue that Amir felt left out?',
    clue: 3,
    sentences: [
      'The field behind the school was still wet from the rain.',
      'Amir had carried his ball all the way from home.',
      'The other children were already shouting by the goal.',
      'He sat on the far bench and kept his eyes on his shoes.',
      'A whistle ended the game twenty minutes later.',
    ],
  },
  {
    title: 'The Kitchen',
    ask: 'Which sentence is the clue that the cake was a surprise?',
    clue: 2,
    sentences: [
      'Nia came home the long way, past the market.',
      'Her bag was heavy with library books.',
      'The lights were off, then everyone jumped out at once.',
      'There was a cake with her name on it.',
      'She laughed so hard she had to sit down.',
    ],
  },
  {
    title: 'Late Bus',
    ask: 'Which sentence is the clue that Father was worried?',
    clue: 4,
    sentences: [
      'The last bus was twelve minutes late.',
      'Rain tapped the plastic roof of the stop.',
      'Rafi counted the cars that passed.',
      'His homework was still in his bag.',
      'Father was pacing at the gate when the bus finally came.',
    ],
  },
  {
    title: 'The Test',
    ask: 'Which sentence is the clue that Lina was not ready?',
    clue: 1,
    sentences: [
      'The teacher placed the paper face down.',
      'Lina had spent the evening fixing her little brother’s kite.',
      'The room went quiet when the timer started.',
      'Question three asked about the water cycle.',
      'She filled the last line as the bell rang.',
    ],
  },
  {
    title: 'New Puppy',
    ask: 'Which sentence is the clue that the puppy was frightened?',
    clue: 3,
    sentences: [
      'The box on the porch had air holes.',
      'Dewi peeled the tape slowly.',
      'A small brown face looked up.',
      'The puppy pressed itself into the corner and would not come out.',
      'Dewi sat on the floor and waited.',
    ],
  },
  {
    title: 'The Match',
    ask: 'Which sentence is the clue that the team still respected each other?',
    clue: 4,
    sentences: [
      'The score was two to one at the end.',
      'Mud covered both keepers.',
      'Someone in the crowd booed.',
      'The losing captain stared at the ground.',
      'Then both teams lined up and shook hands.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'A girl checks the clock, repacks her bag, and still misses the bus. What can you tell?',
    options: ['She was running late', 'She does not go to school', 'The bus was early all week', 'She wanted to walk'],
  },
  {
    ask: 'A boy smiles at his score, then hides the paper when his friend looks over. What can you tell?',
    options: ['He does not want to show off', 'He failed the test', 'His friend wrote the paper', 'The score is blank'],
  },
  {
    ask: 'The picnic basket is still full, and everyone is looking at the dark clouds. What can you tell?',
    options: ['They may leave before they eat', 'The food is already gone', 'They are waiting for snow', 'The park is closed'],
  },
  {
    ask: 'Mother puts a sweater on the chair before anyone asks. What can you tell?',
    options: ['She expects the evening to be cool', 'She is giving the sweater away', 'The chair is broken', 'Nobody lives in the house'],
  },
  {
    ask: 'A dog brings the leash and stands by the door. What can you tell?',
    options: ['The dog wants a walk', 'The dog is afraid of the door', 'The leash is new', 'Someone is locked out'],
  },
  {
    ask: 'The classroom is silent, but several pencils are still moving. What can you tell?',
    options: ['The children are still working', 'School is over', 'The pencils are broken', 'Nobody is in the room'],
  },
];

export const readBetween: ContentModule = {
  id: 'r5-u1-m1',
  unitId: 'r5-u1',
  grade: 5,
  title: 'Read Between the Lines',
  icon: '🔍',
  prereq: [],
  skills: ['read-infer'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['read', 'whole', 'paragraph', 'clue', 'sentence', 'inference', 'careful', 'guess'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Read the whole paragraph.',
      visual: {
        kind: 'evidence-text',
        title: 'The Bench',
        sentences: [
          'Amir brought his ball.',
          'The others played without him.',
          'He watched his shoes from the bench.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the clue sentence.',
      visual: {
        kind: 'evidence-text',
        title: 'Left Out',
        sentences: [
          'The field was wet.',
          'He sat alone and would not look up.',
          'The whistle ended the game.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Inference is a careful guess.',
      visual: {
        kind: 'evidence-text',
        title: 'Inference',
        sentences: ['Use the clue. Say what the writer did not write out loud.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-infer',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-infer',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
