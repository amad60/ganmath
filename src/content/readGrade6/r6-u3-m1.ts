import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

/** Kalimat kiasan adalah satu-satunya yang tidak harfiah. */
const stories: ClueStory[] = [
  {
    title: 'The Gym',
    ask: 'Which sentence is figurative, not literal?',
    clue: 0,
    sentences: [
      'The gym was a beehive at noon.',
      'Balls bounced in every corner.',
      'No one stood still.',
      'A coach blew the whistle twice.',
      'Then the class lined up.',
    ],
  },
  {
    title: 'Under the Awning',
    ask: 'Which sentence is figurative, not literal?',
    clue: 1,
    sentences: [
      'We waited under the shop awning.',
      'The sky opened its pockets.',
      'Puddles formed along the curb.',
      'Cars slowed at the corner.',
      'My coat was soaked by the time we ran.',
    ],
  },
  {
    title: 'The Last Lap',
    ask: 'Which sentence is figurative, not literal?',
    clue: 1,
    sentences: [
      'The race had four laps.',
      'Her legs were lead.',
      'The crowd stayed on its feet.',
      'She crossed the line and bent over.',
      'A friend handed her water.',
    ],
  },
  {
    title: 'The Timer',
    ask: 'Which sentence is figurative, not literal?',
    clue: 1,
    sentences: [
      'Question one was about rivers.',
      'The clock crawled through the last minutes.',
      'Pencils scratched on paper.',
      'The teacher walked the rows.',
      'A bell ended the test.',
    ],
  },
  {
    title: 'By the Lockers',
    ask: 'Which sentence is figurative, not literal?',
    clue: 1,
    sentences: [
      'They stood by the lockers.',
      'His words were sharp stones.',
      'She turned and walked away.',
      'A teacher asked them to class.',
      'The hall grew quiet.',
    ],
  },
  {
    title: 'After the Bell',
    ask: 'Which sentence is figurative, not literal?',
    clue: 0,
    sentences: [
      'After the bell, the library was a tomb.',
      'Chairs were pushed in.',
      'One lamp stayed on.',
      'Dust sat on the atlas.',
      'The door clicked shut.',
    ],
  },
];

type TypedPassage = {
  title: string;
  sentences: string[];
  ask: string;
  words: string[];
};

/** Kata yang diterima tidak muncul di paragraf, supaya anak menerjemahkan kiasan. */
const typed: TypedPassage[] = [
  {
    title: 'Before the Bell',
    ask: 'The classroom was "a zoo." Type what that means.',
    words: ['noisy', 'wild', 'loud'],
    sentences: [
      'The classroom was a zoo before the bell.',
      'Chairs scraped across the floor.',
      'Three students called across the room.',
      'A pencil cup fell over.',
      'Then the teacher raised one hand.',
    ],
  },
  {
    title: 'After the Loss',
    ask: 'Mia was "a ray of sunshine." Type what that means.',
    words: ['cheerful', 'happy', 'glad'],
    sentences: [
      'The team had just lost by one point.',
      'Mia was a ray of sunshine in the locker room.',
      'She passed out water.',
      'She thanked the goalkeeper.',
      'People started talking again.',
    ],
  },
  {
    title: 'The Rumor',
    ask: 'The news spread "like wildfire." Type how it spread.',
    words: ['fast', 'quickly'],
    sentences: [
      'Someone whispered in the hall.',
      'By lunch the news had spread like wildfire.',
      'Every table was talking about it.',
      'The teacher asked for quiet.',
      'The truth came out in last period.',
    ],
  },
  {
    title: 'The Win',
    ask: 'He was "walking on air." Type what that means.',
    words: ['happy', 'proud', 'glad'],
    sentences: [
      'The final score flashed on the board.',
      'He was walking on air as he left the court.',
      'His friends met him at the door.',
      'He could not stop smiling.',
      'They walked home together.',
    ],
  },
  {
    title: 'The Old Car',
    ask: 'The car was "on its last legs." Type what that means.',
    words: ['worn', 'weak', 'broken'],
    sentences: [
      'The car coughed at every light.',
      'It was on its last legs.',
      'The door had to be lifted to shut.',
      'Father said this was its final year.',
      'They parked it gently in the driveway.',
    ],
  },
  {
    title: 'A Good Story',
    ask: '"Time flew." Type what that means about time.',
    words: ['fast', 'quick', 'quickly'],
    sentences: [
      'The chapter was long.',
      'Time flew until the last page.',
      'No one noticed the sun move.',
      'The ending surprised the group.',
      'They begged for the next chapter.',
    ],
  },
];

export const pictureWords: ContentModule = {
  id: 'r6-u3-m1',
  unitId: 'r6-u3',
  grade: 6,
  title: 'Picture Words',
  icon: '🎨',
  prereq: ['r6-u2-m1'],
  skills: ['read-figure'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'type-word'],
  visuals: ['evidence-text'],
  vocab: ['figure', 'literal', 'sentence', 'type', 'plain', 'meaning'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A figure is not literal.',
      visual: {
        kind: 'evidence-text',
        title: 'The Gym',
        sentences: [
          'The gym was a beehive.',
          'Balls bounced in the corners.',
          'The class lined up.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence that is not literal.',
      visual: {
        kind: 'evidence-text',
        title: 'Not Literal',
        sentences: [
          'Balls bounced in the corners.',
          'The gym was a beehive.',
          'The class lined up.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Type the plain meaning.',
      visual: {
        kind: 'evidence-text',
        title: 'Plain',
        sentences: ['A beehive here means busy, not a nest of bees.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-figure',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'type-word',
      skill: 'read-figure',
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
