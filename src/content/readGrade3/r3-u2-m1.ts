import type { ContentModule } from '../types';

export const scienceAnimalClues: ContentModule = {
  id: 'r3-u2-m1',
  unitId: 'r3-u2',
  grade: 3,
  title: 'Animal Adaptations',
  icon: '🦎',
  prereq: ['r3-u1-m1'],
  skills: ['read-science-facts'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['adaptation', 'habitat', 'camouflage', 'prey', 'predator', 'survive', 'feature', 'help', 'animal', 'special', 'body', 'part'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Animals have special body parts to survive.',
      visual: {
        kind: 'evidence-text',
        title: 'Chameleons',
        sentences: [
          'Chameleons change color to blend into green leaves.',
          'Camouflage hides them from hungry predator birds.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap how the feature helps it survive.',
      visual: {
        kind: 'evidence-text',
        title: 'Desert Camel',
        sentences: [
          'A camel has long, thick eyelashes.',
          'The eyelashes keep blowing sand out of its eyes.',
          'Camels walk slowly.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Adaptations help animals survive.',
      visual: {
        kind: 'evidence-text',
        title: 'Feature ➔ Survival',
        sentences: ['Duck webbed feet act like swimming flippers in water.'],
      },
      action: 'watch',
      caption: 'feature ➔ survive',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-science-facts',
      params: { s: [0, 7] },
      answer: () => 1, // kalimat kedua memuat fungsi adaptasi
      text: () => 'Which sentence explains HOW the animal feature helps it survive?',
      visual: (p) => {
        const stories = [
          {
            title: 'Arctic Fox',
            sentences: ['The arctic fox has thick pure white fur in winter.', 'This warm coat traps body heat and blends with white snow.'],
          },
          {
            title: 'Giraffe Neck',
            sentences: ['A giraffe has a six-foot long muscular neck.', 'The tall reach lets it pluck fresh leaves from high acacia branches.'],
          },
          {
            title: 'Barn Owl Ears',
            sentences: ['Barn owls have asymmetrical ear openings behind feathers.', 'The uneven ears help pinpoint tiny rustling mice in total darkness.'],
          },
          {
            title: 'Desert Kangaroo Rat',
            sentences: ['Kangaroo rats live in parched sandy deserts.', 'Their efficient kidneys extract all moisture from dry seeds without drinking.'],
          },
          {
            title: 'Poison Dart Frog',
            sentences: ['Tiny poison dart frogs wear neon yellow and blue skin.', 'The brilliant colors warn predators that their skin tastes toxic.'],
          },
          {
            title: 'Duck Feet',
            sentences: ['A duck has webbed feet.', 'The webs push water so the duck can paddle.'],
          },
          {
            title: 'Cactus Spines',
            sentences: ['A cactus grows sharp spines.', 'The spines stop thirsty animals from eating the plant.'],
          },
          {
            title: 'Penguin Wings',
            sentences: ['A penguin has short stiff wings.', 'Those flippers push the bird through cold water.'],
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
      skill: 'read-science-facts',
      params: { c: [0, 7] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Woodpeckers have thick spongy skulls and stiff tail feathers that brace against tree trunks like a kickstand while hammering. Why do woodpeckers have stiff tail feathers?',
          'Polar bears have wide rough pads on their large paws. What is the main purpose of wide pads on ice?',
          'Cacti have shallow widespread root networks rather than one deep taproot. Why do desert cacti have wide root networks?',
          'Vampire bats have heat-sensing pits near their noses. What do heat sensors help them locate in the dark?',
          'Porcupines have thousands of sharp barbed quills across their backs. What happens when a curious wolf approaches too close?',
          'Ducks have webbed feet. How do the webs help?',
          'Cactus spines are sharp. How do the spines help the plant?',
          'Penguins have short stiff wings. How do those wings help in the sea?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['To brace against the tree trunk while hammering', 'To fly faster in wind', 'To sweep tree sawdust away', 'To attract mates'],
          ['To prevent slipping and distribute weight on ice', 'To swim across oceans', 'To dig deep holes', 'To climb tall trees'],
          ['To quickly catch every drop of brief desert rain', 'To hide from desert sun', 'To anchor in deep rock', 'To stay cold'],
          ['Warm blood vessels beneath animal skin', 'Cold mountain caves', 'Ripe sweet fruits', 'Underground rivers'],
          ['The sharp quills stick into the predator for defense', 'The porcupine flies away', 'The porcupine changes color', 'It shares food'],
          ['They push water so the duck can paddle', 'They keep the duck warm', 'They help the duck climb trees', 'They make the duck fly'],
          ['They stop animals from eating the plant', 'They store extra rain', 'They attract bees', 'They make the cactus taller'],
          ['They push the bird through the water', 'They help it soar over mountains', 'They change color in winter', 'They catch fish in the air'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
