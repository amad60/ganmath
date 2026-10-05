import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'The Shared Coat',
    ask: 'Which sentence tells the LESSON, not just what happened?',
    clue: 2,
    sentences: [
      'Lina gave her coat to a shivering friend.',
      'They walked home in the wind.',
      'Kindness matters more than staying perfectly warm.',
    ],
  },
  {
    title: 'Practice Pays',
    ask: 'Which sentence tells the LESSON, not just what happened?',
    clue: 0,
    sentences: [
      'Steady practice can turn a miss into a basket.',
      'Rafi shot and missed ten times.',
      'On the eleventh try the ball went in.',
    ],
  },
  {
    title: 'The Shortcut',
    ask: 'Which sentence tells the LESSON, not just what happened?',
    clue: 1,
    sentences: [
      'They left the path to save time.',
      'A shortcut can cost more than it saves.',
      'They were lost until dusk.',
    ],
  },
  {
    title: 'Team Puzzle',
    ask: 'Which sentence tells the LESSON, not just what happened?',
    clue: 2,
    sentences: [
      'No one could finish the puzzle alone.',
      'Each friend placed one piece.',
      'Hard jobs get lighter when people work together.',
    ],
  },
  {
    title: 'The Promise',
    ask: 'Which sentence tells the LESSON, not just what happened?',
    clue: 1,
    sentences: [
      'Sari said she would feed the cat, then forgot.',
      'A promise is only real if you keep it.',
      'The cat meowed by an empty bowl.',
    ],
  },
  {
    title: 'New Student',
    ask: 'Which sentence tells the LESSON, not just what happened?',
    clue: 0,
    sentences: [
      'A small welcome can change someone’s whole day.',
      'Omar sat alone at lunch.',
      'Dewi waved him over to her table.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'A boy tells the truth even though he might get in trouble. What lesson fits?',
    options: ['Honesty is worth the cost', 'Running away solves problems', 'Friends should keep secrets', 'Rules are optional'],
  },
  {
    ask: 'Two sisters argue, then listen, then fix the game together. What lesson fits?',
    options: ['Listening can repair a fight', 'The loudest person wins', 'Games are better alone', 'Sisters should not share'],
  },
  {
    ask: 'A gardener waits weeks before the first tomato appears. What lesson fits?',
    options: ['Good things can take time', 'Gardens grow overnight', 'Tomatoes are easy to buy', 'Waiting is a waste'],
  },
  {
    ask: 'A girl copies a test and later cannot solve the same problem. What lesson fits?',
    options: ['Copying does not teach you', 'Tests are unfair', 'Friends should share answers', 'Studying is useless'],
  },
  {
    ask: 'A team loses, thanks the other side, and shakes hands. What lesson fits?',
    options: ['Respect matters after a loss', 'Only winning counts', 'Never play again', 'Blame the referee'],
  },
  {
    ask: 'A child returns a found wallet even though it holds money. What lesson fits?',
    options: ['Do the right thing with what is not yours', 'Finders may keep money', 'Wallets should be hidden', 'Money matters most'],
  },
];

export const storyTheme: ContentModule = {
  id: 'r4-u4-m1',
  unitId: 'r4-u4',
  grade: 4,
  title: 'The Lesson',
  icon: '🌟',
  prereq: ['r4-u3-m1'],
  skills: ['read-theme'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['lesson', 'theme', 'matters', 'story', 'teach', 'happened', 'event'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A story can teach a lesson.',
      visual: {
        kind: 'evidence-text',
        title: 'The Shared Coat',
        sentences: ['Lina gave her coat away.', 'Kindness mattered more than staying warm.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the lesson, not what happened.',
      visual: {
        kind: 'evidence-text',
        title: 'The Lost Ball',
        sentences: [
          'Being honest helps people trust you.',
          'Sari found a ball in the park.',
          'She gave it back to the boy who lost it.',
        ],
      },
      action: 'tap-clue',
      target: 0,
    },
    {
      stage: 'abstract',
      prompt: 'Theme is the lesson a story gives.',
      visual: {
        kind: 'evidence-text',
        title: 'Theme',
        sentences: ['Ask what the story wants you to understand.'],
      },
      action: 'watch',
      caption: 'event ➔ lesson',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-theme',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-theme',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
