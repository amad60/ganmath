import type { ContentModule } from '../types';

export const mainIdeaSummary: ContentModule = {
  id: 'r2-u1-m1',
  unitId: 'r2-u1',
  grade: 2,
  title: 'The Big Idea',
  icon: '💡',
  prereq: [],
  skills: ['read-main-idea'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['idea', 'mostly', 'topic', 'about', 'bees', 'hive', 'sentence'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A paragraph has one big main idea.',
      visual: {
        kind: 'evidence-text',
        title: 'Busy Honeybees',
        sentences: [
          'Honeybees are hard workers.',
          'They fly to flowers to sip nectar.',
          'Then they fly home to make sweet honey.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the big idea sentence.',
      visual: {
        kind: 'evidence-text',
        title: 'Busy Ants',
        sentences: [
          'Ants are hard workers.',
          'They carry crumbs home.',
          'They dig long tunnels.',
        ],
      },
      action: 'tap-clue',
      target: 0,
    },
    {
      stage: 'abstract',
      prompt: 'Main idea means what the text is mostly about.',
      visual: {
        kind: 'evidence-text',
        title: 'Big Idea',
        sentences: ['Details give extra clues about the main idea.'],
      },
      action: 'watch',
      caption: 'topic ➔ details',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-main-idea',
      params: { s: [0, 7] },
      answer: () => 0, // kalimat pertama memuat ide utama
      text: () => 'Which sentence states the MAIN IDEA of the story?',
      visual: (p) => {
        const stories = [
          {
            title: 'Sea Turtles',
            sentences: [
              'Sea turtles are built for swimming in the ocean.',
              'Their front flippers act like strong paddles.',
              'Their smooth shells glide through deep blue water.',
            ],
          },
          {
            title: 'Tree Houses',
            sentences: [
              'A tree house is a fun outdoor hideout.',
              'Kids climb wooden ladders to reach the top.',
              'From high up they can view the whole backyard.',
            ],
          },
          {
            title: 'Rainy Days',
            sentences: [
              'Rainy days are great for indoor crafts.',
              'Ana cuts paper stars with safety scissors.',
              'Budi paints colorful rainbows with watercolor.',
            ],
          },
          {
            title: 'Beaver Builders',
            sentences: [
              'Beavers are skilled builders of the river.',
              'They cut sturdy logs with sharp orange teeth.',
              'They pack river mud tightly to construct dams.',
            ],
          },
          {
            title: 'Autumn Leaves',
            sentences: [
              'Autumn brings beautiful color changes to leaves.',
              'Green leaves turn fiery red and bright orange.',
              'Crisp leaves drift softly down to the forest floor.',
            ],
          },
          {
            title: 'City Trains',
            sentences: [
              'Trains move people across a busy city.',
              'Doors slide open at each station.',
              'Riders hold the rail when the car turns.',
            ],
          },
          {
            title: 'Night Owls',
            sentences: [
              'Owls hunt quietly after the sun sets.',
              'Soft feathers muffle every wingbeat.',
              'Round eyes gather light in the dark.',
            ],
          },
          {
            title: 'School Garden',
            sentences: [
              'The class garden grows food for lunch.',
              'Students water the tomato vines.',
              'Ripe fruit goes to the school kitchen.',
            ],
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
      skill: 'read-main-idea',
      params: { c: [0, 7] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Penguins have thick feathers, layer of blubber, and huddle together to keep warm in Antarctica. What is this mostly about?',
          'Cheetahs have flexible spines, wide nostrils, and muscular legs that let them sprint fast across open savannah. What is this mostly about?',
          'Cactus plants have thick stems to store rain water, waxy skin, and sharp spines instead of wide leaves. What is this mostly about?',
          'An astronaut wears a pressurized suit with helmet, radio microphone, and oxygen backpack in space. What is this mostly about?',
          'A fire truck carries high ladders, long water hoses, and flashing sirens to rescue people quickly. What is this mostly about?',
          'Whales sing long songs, swim in pods, and rise to breathe air. What is this mostly about?',
          'Beavers cut logs, pack mud, and build dams across streams. What is this mostly about?',
          'The class plants seeds, waters them, and picks tomatoes for lunch. What is this mostly about?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['How penguins survive freezing cold', 'What penguins eat', 'Penguin flying skills', 'How penguins lay eggs'],
          ['Why cheetahs can run so fast', 'How cheetahs climb trees', 'What cheetah cubs play', 'Cheetah spots'],
          ['How cactus plants survive dry deserts', 'Desert sand dunes', 'Cactus flowers', 'Desert lizards'],
          ['Equipment an astronaut needs in space', 'The planet Mars', 'How to fly a rocket', 'Star constellations'],
          ['Tools on a fire truck for rescue', 'Police car sirens', 'How water freezes', 'Driving fast'],
          ['How whales live in the ocean', 'Ship horns', 'Ocean maps', 'Whale size charts'],
          ['How beavers build their dams', 'Fish recipes', 'River names', 'Boat races'],
          ['A class garden that feeds lunch', 'How to buy tomatoes', 'School bells', 'Rain clouds'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
