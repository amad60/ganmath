import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'My Turn',
    ask: 'Which sentence shows the character is telling the story?',
    clue: 0,
    sentences: [
      'I gripped the rope and did not look down.',
      'The crowd below was a blur of color.',
      'The coach called a time.',
      'Wind pushed against the bridge.',
      'One step remained.',
    ],
  },
  {
    title: 'Told from Outside',
    ask: 'Which sentence shows a narrator outside the story?',
    clue: 2,
    sentences: [
      'The boat rocked in the harbor.',
      'Nets dried on the rail.',
      'She did not know the storm was already turning toward shore.',
      'Gulls sat on the posts.',
      'A bell rang on the dock.',
    ],
  },
  {
    title: 'Dear Diary',
    ask: 'Which sentence shows this is the writer’s own day?',
    clue: 1,
    sentences: [
      'Thursday was hot.',
      'I forgot my lunch and had to borrow bread.',
      'The fan in the room barely moved.',
      'Math took the whole afternoon.',
      'Home smelled like fried fish.',
    ],
  },
  {
    title: 'Two Sides',
    ask: 'Which sentence shows only one player’s view?',
    clue: 3,
    sentences: [
      'The whistle was sharp.',
      'Both teams wanted the ball.',
      'Mud stuck to every boot.',
      'I was sure the referee had missed the foul.',
      'The score stayed level.',
    ],
  },
  {
    title: 'The Report',
    ask: 'Which sentence shows the writer is not in the event?',
    clue: 0,
    sentences: [
      'Residents said the river rose overnight.',
      'Chairs were carried upstairs.',
      'A dog was lifted into a truck.',
      'By noon the street was open again.',
      'Shops rolled their doors up.',
    ],
  },
  {
    title: 'Inside the Cave',
    ask: 'Which sentence shows we only know what the character knows?',
    clue: 4,
    sentences: [
      'The lamp made a small circle.',
      'Water dripped somewhere ahead.',
      'His hand found a cold wall.',
      'He counted his steps.',
      'He could not tell whether the path split.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'The text says “I hid the letter in my pocket.” Who is telling it?',
    options: ['The person in the story', 'A narrator who sees everyone', 'The teacher outside the book', 'Nobody — it is a list'],
  },
  {
    ask: 'The text says “They did not notice the door was open.” Who is telling it?',
    options: ['A narrator outside the characters', 'One child using I', 'The door itself', 'A diary from next year'],
  },
  {
    ask: 'A diary begins “Today I lost the race and felt sick.” Whose view is this?',
    options: ['The runner’s own view', 'The winner’s view', 'The coach’s report', 'A newspaper'],
  },
  {
    ask: 'A news line says “Witnesses saw the roof lift.” Whose view is this?',
    options: ['A reporter using other people’s eyes', 'The wind', 'The roof', 'A diary of the builder'],
  },
  {
    ask: 'The line is “We thought the path was safe.” What does “we” tell you?',
    options: ['A group inside the story is speaking', 'The author is a map', 'Only one stranger is speaking', 'No one went on the path'],
  },
  {
    ask: 'The line is “She hoped he would turn back, but he could not hear her.” What is limited?',
    options: ['We hear her hope, not his thoughts', 'We know both minds fully', 'Nobody hopes anything', 'The story has no people'],
  },
];

export const whoseView: ContentModule = {
  id: 'r5-u3-m1',
  unitId: 'r5-u3',
  grade: 5,
  title: 'Whose View?',
  icon: '👁️',
  prereq: ['r5-u2-m1'],
  skills: ['read-view'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['view', 'narrator', 'character', 'sentence', 'tells', 'outside', 'i', 'means', 'telling', 'stand'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'I means the character is telling it.',
      visual: {
        kind: 'evidence-text',
        title: 'My Turn',
        sentences: ['I gripped the rope.', 'The crowd waited below.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence with I.',
      visual: {
        kind: 'evidence-text',
        title: 'Who Speaks',
        sentences: ['The bridge was high.', 'I did not look down.', 'Wind pushed hard.'],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A narrator can stand outside.',
      visual: {
        kind: 'evidence-text',
        title: 'View',
        sentences: ['If the text knows what a character does not, a narrator is telling it.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-view',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-view',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
