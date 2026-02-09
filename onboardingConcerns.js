export const ONBOARDING_CONCERNS = [
  {
    id: 'unsure_where_to_start',
    label: "I don't know what I should be doing first",
  },
  {
    id: 'cant_picture_feel',
    label: "I can't picture how I want my wedding to feel yet",
  },
  {
    id: 'worried_budget',
    label: "I'm worried about the budget",
  },
  {
    id: 'guest_list_stress',
    label: 'The guest list is stressing me out',
  },
  {
    id: 'suppliers_overwhelming',
    label: 'Finding the right suppliers feels overwhelming',
  },
  {
    id: 'lots_of_questions',
    label: "I have lots of questions and don't know who to ask",
  },
  {
    id: 'want_feel_calmer',
    label: "I just want to feel calmer about all of this",
  },
  {
    id: 'want_everything_one_place',
    label: 'I want everything in one place',
  },
];

const planningPathRecommendation = {
  destinationRoute: 'PlanningPath',
  startHereTitle: 'Start here: Planning Path',
  startHereSubtitle: 'A simple roadmap for what to do next.',
  startHereCardBody:
    'Follow a calm checklist so the next handful of moves always feel obvious.',
  bulletLabel: "I don't know what I should be doing first",
  ctaLabel: 'Take me there',
};

const guestNestRecommendation = {
  destinationRoute: 'GuestNest',
  startHereTitle: 'Start here: Guest Nest',
  startHereSubtitle: 'A calmer way to build your guest list.',
  startHereCardBody:
    'Sort guests with less guilt, fewer spreadsheets, and way more "okay, that makes sense."',
  bulletLabel: 'The guest list is stressing me out',
  ctaLabel: 'Take me there',
};

export const RECOMMENDATION_CONFIG = {
  unsure_where_to_start: planningPathRecommendation,
  guest_list_stress: guestNestRecommendation,
  worried_budget: {
    destinationRoute: 'BudgetBuddy',
    startHereTitle: 'Start here: Budget Buddy',
    startHereSubtitle: 'Clear numbers, calmer decisions.',
    startHereCardBody:
      "See what you're working with, what's realistic, and what needs a tiny rethink - without spiralling.",
    bulletLabel: "I'm worried about the budget",
    ctaLabel: 'Take me there',
  },
  suppliers_overwhelming: {
    destinationRoute: 'Vendors',
    startHereTitle: 'Start here: Vendors',
    startHereSubtitle: 'Find the right suppliers without the overwhelm.',
    startHereCardBody:
      'Get clear on what you need, then browse with confidence (and fewer 47-tab meltdowns).',
    bulletLabel: 'Finding the right suppliers feels overwhelming',
    ctaLabel: 'Take me there',
  },
  lots_of_questions: {
    destinationRoute: 'AskIvy',
    startHereTitle: 'Start here: Ask Ivy',
    startHereSubtitle: 'When you need answers, not opinions.',
    startHereCardBody:
      'Ask your question and get a calm, practical next step - minus the group chat chaos.',
    bulletLabel: "I have lots of questions and don't know who to ask",
    ctaLabel: 'Take me there',
  },
  cant_picture_feel: {
    destinationRoute: 'InspirationStation',
    startHereTitle: 'Start here: Inspiration Station',
    startHereSubtitle: 'Find a vibe that actually feels like you.',
    startHereCardBody:
      "Save styles, colours and details - then we'll turn them into clearer decisions.",
    bulletLabel: "I can't picture how I want my wedding to feel yet",
    ctaLabel: 'Take me there',
  },
  want_everything_one_place: {
    destinationRoute: 'WeddingHub',
    startHereTitle: 'Start here: Your Wedding Hub',
    startHereSubtitle: 'Everything in one place, finally.',
    startHereCardBody:
      'Your planning home base - tools, progress, notes and next steps, all together.',
    bulletLabel: 'I want everything in one place',
    ctaLabel: 'Take me there',
  },
  want_feel_calmer: {
    destinationRoute: 'CalmCorner',
    startHereTitle: 'Start here: Calm Corner',
    startHereSubtitle: 'A quick reset before the next decision.',
    startHereCardBody:
      'Short breathing and grounding tools to take the volume down - so you can keep going.',
    bulletLabel: "I just want to feel calmer about all of this",
    ctaLabel: 'Take me there',
  },
};

export const DEFAULT_RECOMMENDATION = {
  destinationRoute: 'WeddingHub',
  startHereTitle: 'Start here: Your Wedding Hub',
  startHereSubtitle: 'Everything in one place, finally.',
  startHereCardBody:
    'Your planning home base - tools, progress, notes and next steps, all together.',
  bulletLabel: 'I want everything in one place',
  ctaLabel: 'Take me there',
};

export const getRecommendation = (primaryFocus) =>
  RECOMMENDATION_CONFIG[primaryFocus] ?? DEFAULT_RECOMMENDATION;

export const getConcernLabel = (id) => {
  const match = ONBOARDING_CONCERNS.find((concern) => concern.id === id);
  return match ? match.label : id;
};
