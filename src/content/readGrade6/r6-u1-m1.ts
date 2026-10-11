import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

/** Paragraf. Kalimat petunjuk adalah bukti, bukan kalimat klaimnya. */
const stories: ClueStory[] = [
  {
    title: 'The Park Gate',
    ask: 'Which sentence is evidence for closing the park at dusk?',
    clue: 3,
    sentences: [
      'Some people say the park should close at dusk.',
      'The gates stick when the weather is wet.',
      'A new bench was painted in June.',
      'Last month two children were still on the dark path with no lights.',
      'The mayor will vote on Friday.',
    ],
  },
  {
    title: 'Screens Later',
    ask: 'Which sentence supports finishing homework before screens?',
    clue: 2,
    sentences: [
      'Rafi should finish homework before screens.',
      'He plays football on Saturdays.',
      'His math score fell in the month he played games first.',
      'The tablet on his desk is new.',
      'His sister works at the kitchen table.',
    ],
  },
  {
    title: 'The Trip',
    ask: 'Which sentence supports bringing coats?',
    clue: 4,
    sentences: [
      'The class should bring coats on the trip.',
      'The bus leaves at seven.',
      'Everyone packed a water bottle.',
      'The teacher sent the note on Monday.',
      'The forecast says the hill will be near freezing.',
    ],
  },
  {
    title: 'Late Library',
    ask: 'Which sentence supports keeping the library open later?',
    clue: 1,
    sentences: [
      'The library should stay open later.',
      'Students who work after school cannot arrive before five.',
      'Story time is on Wednesday morning.',
      'The carpet was replaced last year.',
      'New books arrived in a crate.',
    ],
  },
  {
    title: 'Longer Recess',
    ask: 'Which sentence supports making recess longer?',
    clue: 3,
    sentences: [
      'Recess should be longer.',
      'The field was muddy on Monday.',
      'Lunch is served in the hall.',
      'Several children stop a game the moment the bell rings.',
      'The teacher keeps a ball in the closet.',
    ],
  },
  {
    title: 'Bike Racks',
    ask: 'Which sentence supports adding more bike racks?',
    clue: 2,
    sentences: [
      'The school needs more bike racks.',
      'Rain fell all morning.',
      'Ten bikes were locked to the fence because the rack was full.',
      'Art class is on the second floor.',
      'The bell rings at three.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'Claim: practice should end earlier. Which evidence fits?',
    options: [
      'Two players missed the late bus home',
      'The coach likes blue shirts',
      'The field has new white lines',
      'Someone brought a bag of oranges',
    ],
  },
  {
    ask: 'Claim: the town should fix the bridge. Which evidence fits?',
    options: [
      'A crack runs across the walking boards',
      'Flowers grow near the river',
      'The town bus is yellow',
      'Shops close on Sunday',
    ],
  },
  {
    ask: 'Claim: the plants need less water this week. Which evidence fits?',
    options: [
      'The soil is still wet from three rainy days',
      'The pots are red',
      'Class starts at eight',
      'A bird sat on the fence',
    ],
  },
  {
    ask: 'Claim: the play should have a second show. Which evidence fits?',
    options: [
      'Every seat was full and people waited outside',
      'The curtains are red',
      'Programs were printed on white paper',
      'One actor tied a shoe on stage',
    ],
  },
  {
    ask: 'Claim: this street needs a crossing. Which evidence fits?',
    options: [
      'Cars pass the school gate very fast at three',
      'The bakery sells bread',
      'Trees line both sides of the road',
      'A cat sleeps in a window',
    ],
  },
  {
    ask: 'Claim: read the chapter before class. Which evidence fits?',
    options: [
      'The talk made no sense to people who skipped it',
      'The chairs are set in rows',
      'The clock on the wall is slow',
      'The windows face the yard',
    ],
  },
];

export const theProof: ContentModule = {
  id: 'r6-u1-m1',
  unitId: 'r6-u1',
  grade: 6,
  title: 'The Proof',
  icon: '📎',
  prereq: [],
  skills: ['read-claim'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['claim', 'needs', 'evidence', 'sentence', 'proves', 'supports'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A claim needs evidence.',
      visual: {
        kind: 'evidence-text',
        title: 'The Park',
        sentences: [
          'The park should close at dusk.',
          'A bench was painted in June.',
          'Two children were on the dark path with no lights.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence that proves it.',
      visual: {
        kind: 'evidence-text',
        title: 'Proof',
        sentences: [
          'The park should close at dusk.',
          'A bench was painted in June.',
          'Children were still on the dark path.',
        ],
      },
      action: 'tap-clue',
      target: 2,
    },
    {
      stage: 'abstract',
      prompt: 'Evidence supports the claim.',
      visual: {
        kind: 'evidence-text',
        title: 'Claim',
        sentences: ['The claim is the idea. The evidence is the proof.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-claim',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-claim',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
