import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

/** Kesimpulan disebut di pertanyaan. Satu kalimat yang menopangnya. */
const stories: ClueStory[] = [
  {
    title: 'The Picnic',
    ask: 'The conclusion is that they should move inside. Which sentence supports that?',
    clue: 2,
    sentences: [
      'The blanket was already spread.',
      'A ball sat by the basket.',
      'Then cold drops began to spot the bread.',
      'The gate was still open.',
      'They had two hours before the bus.',
    ],
  },
  {
    title: 'Night Before',
    ask: 'The conclusion is that Lina is ready. Which sentence supports that?',
    clue: 3,
    sentences: [
      'Lina set two alarms.',
      'Her brother watched a film.',
      'The kitchen light stayed on late.',
      'She had reviewed every chapter and slept.',
      'The bus pass was in her bag.',
    ],
  },
  {
    title: 'The Bowl',
    ask: 'The conclusion is that the dog is hungry. Which sentence supports that?',
    clue: 1,
    sentences: [
      'The dog sat by the kitchen door.',
      'His bowl was empty and he licked the floor around it.',
      'A leash hung on the hook.',
      'Rain tapped the window.',
      'Someone had left a shoe in the hall.',
    ],
  },
  {
    title: 'The Field',
    ask: 'The conclusion is that a storm is coming. Which sentence supports that?',
    clue: 4,
    sentences: [
      'Practice started on time.',
      'The cones were in a neat row.',
      'Players passed the ball in pairs.',
      'The coach checked the roster.',
      'The sky went dark and a low rumble rolled over the field.',
    ],
  },
  {
    title: 'The Bridge',
    ask: 'The conclusion is that the bridge is unsafe. Which sentence supports that?',
    clue: 2,
    sentences: [
      'The river looked calm.',
      'Birds sat on the rail.',
      'A wide crack split the walking boards.',
      'Flowers grew on the bank.',
      'The path continued into the trees.',
    ],
  },
  {
    title: 'After Practice',
    ask: 'The conclusion is that she puts the team first. Which sentence supports that?',
    clue: 0,
    sentences: [
      'She gave her water to the player who forgot a bottle.',
      'Her own bag was by the bench.',
      'The field lights hummed.',
      'A parent waited in a car.',
      'The scoreboard was already dark.',
    ],
  },
];

type TypedPassage = {
  title: string;
  sentences: string[];
  ask: string;
  words: string[];
};

/** Kata kesimpulan tidak tertulis di paragraf. */
const typed: TypedPassage[] = [
  {
    title: 'Dark Afternoon',
    ask: 'Type one word for what is coming.',
    words: ['storm', 'rain'],
    sentences: [
      'The wind lifted the corner of the tarp.',
      'Clouds stacked into a tall gray wall.',
      'A low rumble moved closer.',
      'People started packing the chairs.',
      'The air smelled like wet dust.',
    ],
  },
  {
    title: 'Before the Test',
    ask: 'Type one word for how prepared she is.',
    words: ['ready', 'prepared'],
    sentences: [
      'She checked each chapter twice.',
      'Her pencil case was packed.',
      'She slept as soon as the light was off.',
      'Breakfast waited by the door.',
      'She walked to the stop without rushing.',
    ],
  },
  {
    title: 'Empty Bowl',
    ask: 'Type one word for what the dog is.',
    words: ['hungry'],
    sentences: [
      'The bowl had been full at dawn.',
      'Now it was bare.',
      'The dog licked the mat again and again.',
      'He watched the kitchen and whined.',
      'No one had filled it since morning.',
    ],
  },
  {
    title: 'The Street',
    ask: 'Type one word for the time of day.',
    words: ['night', 'evening'],
    sentences: [
      'Shops had pulled their shutters down.',
      'Streetlights made pools on the road.',
      'Only two cars passed in ten minutes.',
      'A cat crossed and vanished.',
      'Windows above the bakery were dark.',
    ],
  },
  {
    title: 'Last Minute',
    ask: 'Type one word for how the match feels.',
    words: ['tense', 'close', 'tight'],
    sentences: [
      'The score was even.',
      'Both keepers were breathing hard.',
      'One minute showed on the clock.',
      'Neither bench was sitting down.',
      'The crowd had gone quiet.',
    ],
  },
  {
    title: 'The Pot',
    ask: 'Type one word for what the plant is.',
    words: ['thirsty', 'dry'],
    sentences: [
      'The soil had pulled away from the sides.',
      'Leaves curled at the edges.',
      'The can beside the pot was empty.',
      'No one had filled it all week.',
      'The plant leaned toward the window.',
    ],
  },
];

export const theConclusion: ContentModule = {
  id: 'r6-u4-m1',
  unitId: 'r6-u4',
  grade: 6,
  title: 'The Conclusion',
  icon: '🧩',
  prereq: ['r6-u3-m1'],
  skills: ['read-conclusion'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'type-word'],
  visuals: ['evidence-text'],
  vocab: ['conclusion', 'comes', 'clues', 'sentence', 'supports', 'type', 'word'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A conclusion comes from the clues.',
      visual: {
        kind: 'evidence-text',
        title: 'Picnic',
        sentences: [
          'The blanket was spread.',
          'Cold drops hit the bread.',
          'They should move inside.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence that supports it.',
      visual: {
        kind: 'evidence-text',
        title: 'Support',
        sentences: [
          'The blanket was spread.',
          'Cold drops hit the bread.',
          'The gate was still open.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Type the conclusion in one word.',
      visual: {
        kind: 'evidence-text',
        title: 'Conclusion',
        sentences: ['Put the clues together. The conclusion is the idea they add up to.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-conclusion',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'type-word',
      skill: 'read-conclusion',
      params: { w: [0, typed.length - 1] },
      answer: () => 0,
      text: (p) => typed[p.w as number]?.ask ?? '',
      options: (p) => typed[p.w as number]?.words ?? ['word'],
      visual: (p) => ({
        kind: 'evidence-text' as const,
        title: typed[p.w as number]?.title,
        sentences: [...(typed[p.w as number]?.sentences ?? [])],
      }),
    },
  ],
};
