import type { ContentModule } from '../types';

export const whyDidItHappen: ContentModule = {
  id: 'r1-u3-m1',
  unitId: 'r1-u3',
  grade: 1,
  title: 'Why Did It Happen?',
  icon: '⚡',
  prereq: ['r1-u2-m1'],
  skills: ['read-cause'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['because', 'mud', 'puddle', 'wet', 'melt', 'thirsty', 'drank'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Things happen for a reason.',
      visual: {
        kind: 'evidence-text',
        title: 'Muddy Shoes',
        sentences: ['It rained all morning.', 'Budi jumped in a mud puddle.', 'His shoes became brown and dirty.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look for the reason why.',
      visual: {
        kind: 'evidence-text',
        title: 'Hot Sun',
        sentences: ['The hot sun shone on the ice cream.', 'The sweet ice cream melted fast.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Why tells the cause of an event.',
      visual: {
        kind: 'evidence-text',
        title: 'Drink Water',
        sentences: ['Ana ran fast in the sun.', 'She drank cool water because she was thirsty.'],
      },
      action: 'watch',
      caption: 'thirsty ➔ drink',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-cause',
      params: { s: [0, 4] },
      answer: () => 1, // kalimat kedua memuat alasan / sebab
      text: () => 'Which sentence tells WHY this happened?',
      visual: (p) => {
        const stories = [
          {
            title: 'Wet Puppy',
            sentences: ['Lucky the puppy ran outside.', 'Rain poured from the dark sky.', 'Lucky got wet from head to tail.'],
          },
          {
            title: 'Empty Bowl',
            sentences: ['Dewi poured milk into the bowl.', 'The kitten was hungry and purred.', 'The kitten licked the bowl clean.'],
          },
          {
            title: 'Warm Jacket',
            sentences: ['Rudi put on a thick wool jacket.', 'Cold wind blew through the trees.', 'He stayed warm on the walk.'],
          },
          {
            title: 'Slippery Floor',
            sentences: ['Budi walked fast with wet boots.', 'Water dripped across the tiles.', 'He slipped and dropped his lunch.'],
          },
          {
            title: 'Green Plants',
            sentences: ['Ana left her plant by the window.', 'Warm sunshine reached the leaves.', 'The plant grew tall and strong.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
    {
      type: 'choose-text',
      skill: 'read-cause',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Siti opened her umbrella because big rain drops fell from the sky. Why did Siti open her umbrella?',
          'Leo the bear took a nap because he was very tired after fishing. Why did Leo take a nap?',
          'Budi washed his hands because they were sticky with honey. Why did Budi wash his hands?',
          'Mimi the cat purred softly because Dewi rubbed her ears. Why did Mimi purr?',
          'The car stopped at the corner because the red traffic light turned on. Why did the car stop?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Rain drops fell from the sky', 'She lost her hat', 'It was night time', 'The wind stopped'],
          ['He was very tired', 'He was hungry', 'He wanted to swim', 'He saw a friend'],
          ['They were sticky with honey', 'They were cold', 'He was sleepy', 'He lost his pencil'],
          ['Dewi rubbed her ears', 'She wanted milk', 'She chased a bug', 'The sun went down'],
          ['The red traffic light turned on', 'The road ended', 'It ran out of gas', 'A bird landed'],
        ];
        return list[p.c as number] ?? ['Alasan A', 'B', 'C', 'D'];
      },
    },
  ],
};
