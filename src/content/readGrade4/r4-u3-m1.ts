import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Scarce Water',
    ask: 'Which sentence helps you know what SCARCE means?',
    clue: 1,
    sentences: [
      'Water is scarce in the dry season.',
      'There is almost none left in the well.',
      'The village shares what remains.',
    ],
  },
  {
    title: 'A Weary Hiker',
    ask: 'Which sentence helps you know what WEARY means?',
    clue: 0,
    sentences: [
      'Her legs ached and she could barely take another step.',
      'After the long climb, Nia felt weary.',
      'She sat on a rock to rest.',
    ],
  },
  {
    title: 'Fragile Shell',
    ask: 'Which sentence helps you know what FRAGILE means?',
    clue: 2,
    sentences: [
      'The robin egg was fragile.',
      'Rudi cupped it in two hands.',
      'A light squeeze would crack the thin shell.',
    ],
  },
  {
    title: 'Abundant Berries',
    ask: 'Which sentence helps you know what ABUNDANT means?',
    clue: 1,
    sentences: [
      'The bushes were abundant with berries.',
      'Every branch sagged under more fruit than they could pick.',
      'They filled three baskets.',
    ],
  },
  {
    title: 'A Brief Visit',
    ask: 'Which sentence helps you know what BRIEF means?',
    clue: 2,
    sentences: [
      'Uncle’s visit was brief.',
      'He hugged everyone at the door.',
      'He left again after only ten minutes.',
    ],
  },
  {
    title: 'Cautious Deer',
    ask: 'Which sentence helps you know what CAUTIOUS means?',
    clue: 0,
    sentences: [
      'It froze, listened, and stepped only when the path was quiet.',
      'The deer was cautious near the road.',
      'Cars passed far away.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: '“The trail was arduous — steep, rocky, and exhausting.” What does ARDUOUS mean?',
    options: ['Very hard', 'Very short', 'Very shady', 'Very crowded'],
  },
  {
    ask: '“The pup was timid and hid behind its mother.” What does TIMID mean?',
    options: ['Shy and easily afraid', 'Loud and playful', 'Hungry', 'Fast'],
  },
  {
    ask: '“Please be concise. We only have one minute.” What does CONCISE mean?',
    options: ['Short and clear', 'Loud', 'Funny', 'Late'],
  },
  {
    ask: '“The ancient bridge has stood for hundreds of years.” What does ANCIENT mean?',
    options: ['Very old', 'Brand new', 'Made of rope', 'Dangerous to cross'],
  },
  {
    ask: '“Her reply was vague, so nobody knew the plan.” What does VAGUE mean?',
    options: ['Unclear', 'Very detailed', 'Written in ink', 'Repeated twice'],
  },
  {
    ask: '“The soil was parched and cracked after weeks without rain.” What does PARCHED mean?',
    options: ['Extremely dry', 'Muddy', 'Frozen', 'Full of worms'],
  },
];

export const contextClues: ContentModule = {
  id: 'r4-u3-m1',
  unitId: 'r4-u3',
  grade: 4,
  title: 'Words from Context',
  icon: '💬',
  prereq: ['r4-u2-m1'],
  skills: ['read-context-clue'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['context', 'means', 'clue', 'word', 'nearby', 'drenched', 'sentence', 'explain'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A nearby sentence can explain a word.',
      visual: {
        kind: 'evidence-text',
        title: 'Scarce Water',
        sentences: ['Water is scarce.', 'There is almost none left.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the clue for what drenched means.',
      visual: {
        kind: 'evidence-text',
        title: 'Drenched',
        sentences: [
          'Rafi walked home after school.',
          'He came in the door drenched.',
          'Water dripped from his hair and shirt.',
        ],
      },
      action: 'tap-clue',
      target: 2,
    },
    {
      stage: 'abstract',
      prompt: 'Context means the words around it.',
      visual: {
        kind: 'evidence-text',
        title: 'Context',
        sentences: ['Use the words beside an unknown word.'],
      },
      action: 'watch',
      caption: 'word ➔ clue',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-context-clue',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-context-clue',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
