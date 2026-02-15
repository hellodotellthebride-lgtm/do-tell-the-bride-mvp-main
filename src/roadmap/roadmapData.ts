import { STAGE_CHECKLISTS, getChecklistItems } from './checklists';
import { getItemKind, type ChecklistItemKind } from './itemKinds';
import { stage4Config } from './stages/stage4';

export const ROADMAP_STAGE_ORDER = [
  'stage-1',
  'stage-2',
  'stage-3',
  'stage-4',
  'stage-5',
  'stage-6',
  'stage-7',
  'stage-8',
] as const;

export const STAGE_HUB_ROUTE_MAP: Record<string, string> = {
  'stage-1': 'Stage1Overview',
  'stage-2': 'Stage2EarlyDecisions',
  'stage-3': 'Stage3DreamTeam',
  'stage-4': 'Stage4GuestsInvitations',
  'stage-5': 'Stage5Style',
  'stage-6': 'Stage6FinalDetails',
  'stage-7': 'Stage7WeddingWeek',
  'stage-8': 'Stage8WrapUp',
};

const STAGE_4_DESTINATIONS = (stage4Config?.checklist || []).reduce<Record<string, string>>(
  (acc, entry) => {
    if (entry?.id && entry?.route) {
      acc[entry.id] = entry.route;
    }
    return acc;
  },
  {},
);

export const CHECKLIST_DESTINATIONS: Record<string, Record<string, string>> = {
  'stage-1': {
    'money-guest-chat': 'Stage1SetYourBudget',
    'agree-rough-budget': 'Stage1SetYourBudget',
    'clarify-contributors': 'Stage1SetYourBudget',
    'choose-wedding-vibe': 'Stage1DefineWeddingVibe',
    'target-date-season': 'Account',
    'top-three-priorities': 'Stage1DefineWeddingVibe',
  },
  'stage-2': {
    'guest-count': 'Stage2GuestCount',
    'logistics-needs': 'Stage2Logistics',
    'location-area': 'Stage2Logistics',
    'ceremony-reception': 'Stage2CeremonySetup',
  },
  'stage-3': {
    'diy-vs-hire': 'Stage3DIYorHire',
    'vendor-shortlist': 'Stage3VendorCheatSheets',
    'book-key-vendors': 'Stage3VendorTimeline',
    'secure-priority-vendors': 'Stage3MeetingPrepLibrary',
  },
  'stage-4': STAGE_4_DESTINATIONS,
  'stage-5': {
    'plan-wedding-dress': 'Stage5WeddingDress',
    'groom-style': 'Stage5GroomStyle',
    'bridesmaid-dresses': 'Stage5BridesmaidPlanner',
    'photo-video': 'Stage5PhotoVideo',
    'stag-hen': 'Stage5StagHen',
    'cultural-traditions': 'Stage5CulturalTraditions',
    'sustainable-fashion': 'Stage5SustainableFashion',
  },
  'stage-6': {
    'vendor-finalise': 'Stage6PreCeremony',
    'send-invitations': 'Stage6FinalInvitations',
    'seating-logistics': 'Stage6SeatingPlan',
    'vows-speeches': 'Stage6ToastsVows',
    'decor-setup': 'Stage6DecorPlan',
  },
  'stage-7': {
    'confirm-final-timings': 'Stage7TimelineCards',
    'prep-calm-morning': 'Stage7MorningPrep',
    'set-boundaries': 'Stage7MorningBoundaries',
    'hand-over-plans': 'Stage7Delegation',
    'prepare-day-after': 'Stage7HoneymoonPrep',
    'contingency-plans': 'Stage7RainPlan',
  },
  'stage-8': {
    'thank-yous': 'Stage8ThankYous',
    'vendor-wrap': 'Stage8VendorWrap',
    'gifts-money': 'Stage8GiftsMoney',
    'decor-outfits': 'Stage8DecorItems',
    'name-change': 'Stage8NameChange',
  },
};

export const getStageHubRoute = (stageId: string) =>
  STAGE_HUB_ROUTE_MAP?.[stageId] ?? 'WeddingRoadmap';

export const getQuickDestinationForItem = (stageId: string, itemId: string) =>
  CHECKLIST_DESTINATIONS?.[stageId]?.[itemId] ?? null;

export const getChecklistItemCopy = (stageId: string, itemId: string) => {
  const items = STAGE_CHECKLISTS?.[stageId] ?? [];
  const match = items.find((item: any) => item?.id === itemId);
  return match
    ? { label: match.label ?? '', description: match.description ?? '' }
    : { label: itemId, description: '' };
};

export type CardDeckCompletionDefinition = {
  type: 'manual' | 'hybrid';
  requiredWriteKeys?: string[];
  checklistStageId: string;
  checklistItemId: string;
};

export type CardDeckInfoCard = {
  id: string;
  kind: 'info';
  meta?: string;
  title: string;
  body?: string;
  bullets?: string[];
};

export type CardDeckInputField = {
  id: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  writeKey?: string;
};

export type CardDeckInputsCard = {
  id: string;
  kind: 'inputs';
  meta?: string;
  title: string;
  body?: string;
  inputs: CardDeckInputField[];
  primaryCta?: { label: string; action: 'saveAndContinue' };
  secondaryCta?: { label: string; action: 'skipForNow' };
};

export type CardDeckActionCard = {
  id: string;
  kind: 'action';
  meta?: string;
  title: string;
  body?: string;
  primaryCta: {
    label: string;
    action: 'confirmAndComplete' | 'openRoute' | 'goBackCard';
  };
  secondaryCta?: { label: string; action: 'goBackCard' | 'openRoute' };
  route?: string;
};

export type CardDeckCardDefinition = CardDeckInfoCard | CardDeckInputsCard | CardDeckActionCard;

export type CardDeckDefinition = {
  title: string;
  subtitle?: string;
  cards: CardDeckCardDefinition[];
  completion?: CardDeckCompletionDefinition;
};

export const CHECKLIST_CARD_DECKS: Record<string, Record<string, CardDeckDefinition>> = {
  'stage-1': {
    'agree-rough-budget': {
      title: 'Set Your Comfortable Budget Range',
      subtitle: 'A min and max that feel steady.',
      cards: [
        {
          id: 'why',
          kind: 'info',
          title: 'Why this matters',
          body:
            'A budget range quietly guides everything: venues, guest experience, vendor choices.\n\nA range keeps decisions calm when costs vary by region and quotes change.',
          bullets: [
            'A range is flexible — it’s easier to trade off categories.',
            'It helps you shortlist venues that can actually work.',
            'It reduces panic when reality shows up in quotes.',
          ],
        },
        {
          id: 'how',
          kind: 'info',
          title: 'How to do it (without spiralling)',
          body:
            'Use local averages as a reference — but prioritise your financial stability over trends.\n\nIf you’re unsure, pick a “good for now” range. You can refine later.',
          bullets: [
            'Choose a minimum and a maximum total.',
            'Think about what would feel like “overstretching”.',
            'Keep a buffer idea in mind (you’ll capture it later).',
          ],
        },
        {
          id: 'inputs',
          kind: 'inputs',
          title: 'Your range',
          body: 'Approximate is fine. This is a calm anchor, not a contract.',
          inputs: [
            {
              id: 'min',
              label: 'Minimum budget',
              placeholder: 'e.g. 15000',
              keyboardType: 'numeric',
              writeKey: 'roadmapOutputs.budget.rangeMin',
            },
            {
              id: 'max',
              label: 'Maximum budget',
              placeholder: 'e.g. 25000',
              keyboardType: 'numeric',
              writeKey: 'roadmapOutputs.budget.rangeMax',
            },
          ],
          primaryCta: { label: 'Save & continue', action: 'saveAndContinue' },
          secondaryCta: { label: 'Skip for now', action: 'skipForNow' },
        },
        {
          id: 'confirm',
          kind: 'action',
          title: 'Ready to record it?',
          body: 'We’ll save this and mark this checklist item complete.',
          primaryCta: { label: 'Confirm & mark complete', action: 'confirmAndComplete' },
          secondaryCta: { label: 'Go back', action: 'goBackCard' },
        },
      ],
      completion: {
        type: 'hybrid',
        requiredWriteKeys: ['roadmapOutputs.budget.rangeMin', 'roadmapOutputs.budget.rangeMax'],
        checklistStageId: 'stage-1',
        checklistItemId: 'agree-rough-budget',
      },
    },
  },
};

export const getChecklistCardDeck = (stageId: string, itemId: string) =>
  CHECKLIST_CARD_DECKS?.[stageId]?.[itemId] ?? null;

const buildFallbackCardDeck = (stageId: string, itemId: string): CardDeckDefinition => {
  const copy = getChecklistItemCopy(stageId, itemId);
  const quickDestination = getQuickDestinationForItem(stageId, itemId);

  return {
    title: copy?.label || itemId,
    subtitle: copy?.description || '',
    cards: [
      {
        id: 'coming-soon',
        kind: 'info',
        title: 'Coming soon',
        body:
          'This guided card deck is still being written.\n\nFor now, you can keep moving calmly — one small step at a time.',
        bullets: ['Open the related tool if you want to act now.', 'Or mark this item complete when it feels clear enough.'],
      },
      {
        id: 'complete',
        kind: 'action',
        title: 'Mark complete',
        body: 'When this feels done (even roughly), mark it complete.',
        primaryCta: { label: 'Mark complete', action: 'confirmAndComplete' },
        secondaryCta: quickDestination ? { label: 'Open tool', action: 'openRoute' } : { label: 'Go back', action: 'goBackCard' },
        route: quickDestination || undefined,
      },
    ],
    completion: {
      type: 'manual',
      checklistStageId: stageId,
      checklistItemId: itemId,
    },
  };
};

export const getChecklistCardDeckOrFallback = (stageId: string, itemId: string): CardDeckDefinition => {
  const deck = getChecklistCardDeck(stageId, itemId);
  if (deck) return deck;
  return buildFallbackCardDeck(stageId, itemId);
};

export const buildChecklistNavigationTarget = (
  stageId: string,
  itemId: string,
): { kind: ChecklistItemKind; routeName: string | null; params?: any } => {
  const kind = getItemKind(stageId, itemId);
  if (!stageId || !itemId) return { kind, routeName: null };
  return { kind, routeName: 'RoadmapCardDeck', params: { stageId, itemId } };
};

export type RoadmapLearnCard = {
  title: string;
  body: string;
};

export type CardFlowFieldType = 'text' | 'number' | 'singleSelect' | 'multiSelect';

export type CardFlowField = {
  key: string; // deep key path in ROADMAP_OUTPUTS
  label: string;
  type: CardFlowFieldType;
  placeholder?: string;
  options?: string[];
};

export type CardFlowInputs = {
  requiredKeys: string[];
  fields: CardFlowField[];
};

export type RoadmapItemDefinition = {
  title: string;
  subtitle?: string;
  cards: RoadmapLearnCard[];
  inputs?: CardFlowInputs;
  writesTo?: string[];
  deepLinks?: { label: string; routeName: string; params?: any }[];
};

export const ROADMAP_ITEM_DEFINITIONS: Record<string, Record<string, RoadmapItemDefinition>> = {
  'stage-1': {
    'money-guest-chat': {
      title: 'Align on Budget Range & Guest Estimate',
      subtitle: 'Two ranges that guide everything.',
      cards: [
        {
          title: 'Why this matters',
          body: 'Budget + guest count quietly drive venue options, catering cost, and how your day feels.\n\nYou’re not locking anything yet — you’re setting calm parameters.',
        },
        {
          title: 'How to do it (in 10 minutes)',
          body: '• Pick a calm moment (not mid-stress).\n• Talk what feels comfortable, not what looks impressive.\n• Capture ranges, not exact numbers.\n\nThis is about alignment, not perfection.',
        },
        {
          title: 'Tiny next step',
          body: 'Write one line each:\n• Budget range guess\n• Guest range guess\n\nYou can refine later — the win is having a starting point.',
        },
      ],
    },
    'agree-rough-budget': {
      title: 'Set Your Comfortable Budget Range',
      subtitle: 'A min and max that feel steady.',
      cards: [
        {
          title: 'Choose a range, not a single number',
          body: 'A range keeps decisions calm when quotes vary.\n\nIt also makes trade-offs easier: you can adjust category-by-category without feeling like you “blew the budget.”',
        },
        {
          title: 'Keep it region-aware',
          body: 'Wedding costs vary widely by city and country.\n\nUse local averages as a reference — but prioritise your financial stability over trends.',
        },
        {
          title: 'What this unlocks',
          body: 'A clear range helps you:\n• Shortlist venues that fit\n• Compare vendor quotes faster\n• Avoid panic when costs change',
        },
      ],
      inputs: {
        requiredKeys: ['roadmapOutputs.budget.rangeMin', 'roadmapOutputs.budget.rangeMax'],
        fields: [
          {
            key: 'roadmapOutputs.budget.rangeMin',
            label: 'Minimum budget',
            placeholder: 'e.g. 15000',
            type: 'number',
          },
          {
            key: 'roadmapOutputs.budget.rangeMax',
            label: 'Maximum budget',
            placeholder: 'e.g. 25000',
            type: 'number',
          },
          {
            key: 'roadmapOutputs.budget.currency',
            label: 'Currency (optional)',
            placeholder: 'e.g. USD',
            type: 'text',
          },
          {
            key: 'roadmapOutputs.budget.bufferPct',
            label: 'Buffer % (optional)',
            placeholder: 'e.g. 10',
            type: 'number',
          },
        ],
      },
      writesTo: [
        'roadmapOutputs.budget.rangeMin',
        'roadmapOutputs.budget.rangeMax',
        'roadmapOutputs.budget.currency',
        'roadmapOutputs.budget.bufferPct',
      ],
    },
    'budget-cashflow-plan': {
      title: 'Plan Budget Cashflow & Payments',
      subtitle: 'Deposits, instalments, final balances.',
      cards: [
        {
          title: 'Avoid one scary month',
          body: 'Wedding payments are often “lumpy”. Deposits and final balances can stack up.\n\nA simple plan protects your month-to-month life.',
        },
        {
          title: 'A calm approach',
          body: '• List big deposits and final payments first.\n• Decide what comes from savings vs monthly cash flow.\n• Keep a small buffer rule so you don’t spend your safety net by accident.',
        },
      ],
    },
    'clarify-contributors': {
      title: 'Confirm Financial Contributors & Expectations',
      subtitle: 'Alignment now prevents conflict later.',
      cards: [
        {
          title: 'Get clear early',
          body: 'If family or others are contributing, align early on amounts and decision roles.\n\nThis is about clarity — not pressure.',
        },
        {
          title: 'Three questions',
          body: '• Who is contributing (and roughly how much)?\n• Are contributions fixed or flexible?\n• Who has the final say on major spends?',
        },
      ],
    },
    'legal-requirements': {
      title: 'Check Legal Requirements for Your Ceremony',
      subtitle: 'Rules vary by country and region.',
      cards: [
        {
          title: 'Why this matters',
          body: 'Some regions require notice periods, specific documents, or residency rules.\n\nA quick check now prevents last-minute stress.',
        },
        {
          title: 'What to capture',
          body: '• Ceremony type (civil / religious / cultural)\n• Required documents\n• Any notice periods\n• Deadlines and lead times',
        },
        {
          title: 'Where to check',
          body: 'Start with official local guidance where you live or where you’re getting married.\n\nIf you’re unsure, ask your venue or officiant what couples typically need in your region.',
        },
      ],
    },
    'planning-support-level': {
      title: 'Decide Your Planning Support Level',
      subtitle: 'Support is a strategy, not a weakness.',
      cards: [
        {
          title: 'Pick the support that protects your energy',
          body: 'DIY, coordinator, partial planning, full planning — the best choice is the one that fits your capacity and timeline.',
        },
        {
          title: 'Quick self-check',
          body: 'If any of these are true, more support often helps:\n• Time is tight\n• Decisions feel heavy\n• The wedding is complex (travel, culture, multi-day, big guest count)',
        },
      ],
    },
    'choose-wedding-vibe': {
      title: 'Define Your Wedding Type & Feel',
      subtitle: 'A few words that guide decisions.',
      cards: [
        {
          title: 'This is not a mood board — it’s a filter',
          body: 'A clear “type + feel” helps you say yes/no faster when you look at venues and vendors.\n\nKeep it simple.',
        },
        {
          title: 'Choose your anchors',
          body: 'Decide what fits:\n• Local / destination\n• One-day / multi-day\n• Indoor / outdoor / mixed\n• Formal / relaxed / cultural',
        },
        {
          title: 'One sentence is enough',
          body: 'Try: “Relaxed coastal, one-day, mostly outdoors, with cultural touches.”\n\nThat sentence will guide a lot of decisions.',
        },
      ],
    },
    'target-date-season': {
      title: 'Choose a Target Date or Season',
      subtitle: 'Even a flexible window helps planning.',
      cards: [
        {
          title: 'A window is enough',
          body: 'You don’t need a perfect date yet.\n\nA month or season helps vendors confirm availability and pricing — and helps you plan with less guesswork.',
        },
        {
          title: 'If you’re unsure',
          body: 'Pick two candidate seasons and compare calmly:\n• Weather comfort\n• Travel ease for guests\n• Venue availability in your region',
        },
      ],
    },
    'top-three-priorities': {
      title: 'Define Your Top 3 Non-Negotiables',
      subtitle: 'Three anchors for every decision.',
      cards: [
        {
          title: 'Why three',
          body: 'Three priorities keep decisions calmer.\n\nIf everything is a priority, nothing is.',
        },
        {
          title: 'Examples',
          body: 'Food quality, photography, guest experience, ceremony meaning, music, décor.\n\nPick what matters most to you — not what’s trending.',
        },
        {
          title: 'How to use them',
          body: 'Spend and compromise in line with your top three.\n\nWhen you’re stuck, ask: “Does this support our priorities?”',
        },
      ],
    },
  },
};

export const getRoadmapItemDefinition = (stageId: string, itemId: string) =>
  ROADMAP_ITEM_DEFINITIONS?.[stageId]?.[itemId] ?? null;

export type JourneyInputFieldType = 'text' | 'number' | 'singleSelect' | 'multiSelect';

export type JourneyInputField = {
  key: string; // deep key path in ROADMAP_OUTPUTS
  label: string;
  placeholder?: string;
  type: JourneyInputFieldType;
  multiline?: boolean;
  options?: string[];
};

export type JourneyCardKind = 'content' | 'inputs' | 'confirm';

export type JourneyCard = {
  id: string;
  kind: JourneyCardKind;
  title: string;
  body?: string;
  bullets?: string[];
  ctaLabel?: string;
  secondaryAction?: { label: string; routeName: string; params?: any };
  inputs?: {
    requiredKeys?: string[];
    fields?: JourneyInputField[];
  };
};

export type JourneyDefinition = {
  id: string; // `${stageId}:${itemId}`
  title: string;
  subtitle?: string;
  cards?: JourneyCard[];
};

export type ResolvedJourneyDefinition = {
  id: string;
  title: string;
  subtitle?: string;
  cards: JourneyCard[];
};

export const WRITES_TO: Record<string, Record<string, string[]>> = {
  'stage-1': {
    'agree-rough-budget': ['budget.rangeMin', 'budget.rangeMax'],
    'budget-cashflow-plan': [
      'payments.depositStrategy',
      'payments.estimatedSchedule',
      'payments.bufferRule',
      'payments.reminderCadence',
    ],
    'legal-requirements': [
      'legal.countryRegion',
      'legal.ceremonyType',
      'legal.documents',
      'legal.noticePeriodDays',
      'legal.officiantRequirement',
      'legal.deadlines',
    ],
    'planning-support-level': [
      'support.planningMode',
      'support.coordinatorNeeded',
      'support.plannerBudgetCap',
      'support.delegationPreference',
    ],
    'choose-wedding-vibe': ['wedding.typeFeel'],
    'target-date-season': ['wedding.targetDateOrSeason'],
    'top-three-priorities': ['priorities.topThree'],
  },
  'stage-2': {
    'venue-dealbreakers': [
      'venue.criteria.cateringRule',
      'venue.criteria.barRule',
      'venue.criteria.noiseCurfew',
      'venue.criteria.accessibilityNotes',
      'venue.criteria.weatherPlanNeed',
      'venue.criteria.notes',
    ],
    'accommodation-transport': [
      'logistics.accommodationStrategy',
      'logistics.transportStrategy',
      'logistics.shuttleNeed',
      'logistics.notes',
    ],
  },
};

export const JOURNEY_DEFINITIONS: Record<string, JourneyDefinition> = {
  'stage-1:agree-rough-budget': {
    id: 'stage-1:agree-rough-budget',
    title: 'Set Your Comfortable Budget Range',
    subtitle: 'A min and max that feel steady.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Choose a minimum and maximum total that feels realistic in your region.\n\nA range keeps decisions calm when costs change.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your range',
        body: 'Add what you know — it can be approximate.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['budget.rangeMin', 'budget.rangeMax'],
          fields: [
            {
              key: 'budget.rangeMin',
              label: 'Minimum budget',
              placeholder: 'e.g. 15000',
              type: 'number',
            },
            {
              key: 'budget.rangeMax',
              label: 'Maximum budget',
              placeholder: 'e.g. 25000',
              type: 'number',
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-1:budget-cashflow-plan': {
    id: 'stage-1:budget-cashflow-plan',
    title: 'Plan Budget Cashflow & Payments',
    subtitle: 'Deposits, instalments, final balances.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Map how payments will land in real life.\n\nThis is about avoiding “one scary month” by choosing a calm plan: deposits, instalments, and final balances.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your plan',
        body: 'Keep it simple. Approximate is fine.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['payments.depositStrategy', 'payments.bufferRule'],
          fields: [
            {
              key: 'payments.depositStrategy',
              label: 'Deposit strategy',
              placeholder: 'e.g. deposits from savings, finals from monthly cash flow',
              type: 'text',
              multiline: true,
            },
            {
              key: 'payments.estimatedSchedule',
              label: 'Estimated schedule (optional)',
              placeholder: 'One per line: what + when (e.g. Venue deposit — now)',
              type: 'text',
              multiline: true,
            },
            {
              key: 'payments.bufferRule',
              label: 'Buffer rule',
              placeholder: 'e.g. Keep 10% buffer untouched until the final month',
              type: 'text',
              multiline: true,
            },
            {
              key: 'payments.reminderCadence',
              label: 'Reminder cadence (days, optional)',
              placeholder: 'e.g. 7',
              type: 'number',
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-1:target-date-season': {
    id: 'stage-1:target-date-season',
    title: 'Choose a Target Date or Season',
    subtitle: 'Even a flexible window helps planning.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'This doesn’t need to be perfect.\n\nEven a month or season helps vendors confirm availability and pricing — and helps you plan with less guesswork.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your window',
        body: 'A month or season is enough.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['wedding.targetDateOrSeason'],
          fields: [
            {
              key: 'wedding.targetDateOrSeason',
              label: 'Target date or season',
              placeholder: 'e.g. September 2026 / Spring 2027',
              type: 'text',
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-1:legal-requirements': {
    id: 'stage-1:legal-requirements',
    title: 'Check Legal Requirements for Your Ceremony',
    subtitle: 'Region-specific rules, calmly captured.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Rules vary by country, region, and ceremony type.\n\nA quick check now prevents avoidable stress later (documents, notice periods, officiant rules, deadlines).',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Capture the basics',
        body: 'Keep it simple. You can refine later.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['legal.countryRegion', 'legal.ceremonyType'],
          fields: [
            {
              key: 'legal.countryRegion',
              label: 'Country / region',
              placeholder: 'e.g. Ontario, Canada',
              type: 'text',
            },
            {
              key: 'legal.ceremonyType',
              label: 'Ceremony type',
              placeholder: 'e.g. civil / religious / cultural / symbolic',
              type: 'text',
            },
            {
              key: 'legal.documents',
              label: 'Documents (optional)',
              placeholder: 'One per line (e.g. passport, birth certificate)',
              type: 'text',
              multiline: true,
            },
            {
              key: 'legal.noticePeriodDays',
              label: 'Notice period (days, optional)',
              placeholder: 'e.g. 30',
              type: 'number',
            },
            {
              key: 'legal.officiantRequirement',
              label: 'Officiant requirement (optional)',
              placeholder: 'e.g. licensed officiant / registrar',
              type: 'text',
              multiline: true,
            },
            {
              key: 'legal.deadlines',
              label: 'Deadlines (optional)',
              placeholder: 'One per line: date + what it is',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-1:planning-support-level': {
    id: 'stage-1:planning-support-level',
    title: 'Decide Your Planning Support Level',
    subtitle: 'Support that matches your capacity.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'There’s no “right” way to plan.\n\nPick the support level that matches your energy, complexity, and timeline — so planning stays steady.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your support level',
        body: 'This can change later — choose what fits now.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['support.planningMode'],
          fields: [
            {
              key: 'support.planningMode',
              label: 'Planning mode',
              placeholder: 'DIY / coordinator / partial planning / full planning',
              type: 'text',
            },
            {
              key: 'support.coordinatorNeeded',
              label: 'Day-of coordinator needed? (optional)',
              placeholder: 'yes / no / maybe',
              type: 'text',
            },
            {
              key: 'support.plannerBudgetCap',
              label: 'Planner budget cap (optional)',
              placeholder: 'e.g. 2500',
              type: 'number',
            },
            {
              key: 'support.delegationPreference',
              label: 'Delegation preference (optional)',
              placeholder: 'What do you want help holding, and what do you want to keep?',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-1:choose-wedding-vibe': {
    id: 'stage-1:choose-wedding-vibe',
    title: 'Define Your Wedding Type & Feel',
    subtitle: 'A few words that guide decisions.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Keep this simple. A clear “type + feel” helps you say yes/no faster when you look at venues and vendors.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your type & feel',
        body: 'One sentence is enough.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['wedding.typeFeel'],
          fields: [
            {
              key: 'wedding.typeFeel',
              label: 'Type & feel (short description)',
              placeholder: 'e.g. relaxed coastal, one-day, mostly outdoors',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-1:top-three-priorities': {
    id: 'stage-1:top-three-priorities',
    title: 'Define Your Top 3 Non-Negotiables',
    subtitle: 'Three anchors for every decision.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'These guide your venue, vendors, and budget choices.\n\nExamples: food quality, photography, guest experience, ceremony meaning.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your top 3',
        body: 'Comma-separated is fine.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['priorities.topThree'],
          fields: [
            {
              key: 'priorities.topThree',
              label: 'Your top 3 (comma separated)',
              placeholder: 'e.g. food, photos, guest experience',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-2:guest-count': {
    id: 'stage-2:guest-count',
    title: 'Confirm Guest Range & Maximum',
    subtitle: 'A number that keeps venue choices realistic.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Capture a guest range and your maximum.\n\nThis doesn’t need to be perfect — but it will save you from shortlisting venues that can’t work.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your numbers',
        body: 'Range + hard cap is enough for now.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['guests.rangeMin', 'guests.rangeMax', 'guests.max'],
          fields: [
            {
              key: 'guests.rangeMin',
              label: 'Minimum (range)',
              placeholder: 'e.g. 80',
              type: 'number',
            },
            {
              key: 'guests.rangeMax',
              label: 'Maximum (range)',
              placeholder: 'e.g. 100',
              type: 'number',
            },
            {
              key: 'guests.max',
              label: 'Hard maximum (cap)',
              placeholder: 'e.g. 110',
              type: 'number',
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-2:logistics-needs': {
    id: 'stage-2:logistics-needs',
    title: 'Define Your Non-Negotiable Logistics',
    subtitle: 'The practical filters that guide location choices.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'List the logistics that must be true for your day to feel calm.\n\nTravel, climate, accessibility, cultural or religious requirements — keep it short and real.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your non-negotiables',
        body: 'Write it like rules, not essays.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['logistics.nonNegotiables'],
          fields: [
            {
              key: 'logistics.nonNegotiables',
              label: 'Non-negotiables (short list)',
              placeholder: 'e.g. Step-free access · close to an airport · indoor backup',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-2:location-area': {
    id: 'stage-2:location-area',
    title: 'Choose Your Location Direction',
    subtitle: 'Local, destination, or region-focused.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Choose a location direction that fits your guest reality, logistics, and budget.\n\nYou can refine later — this is to focus your venue search.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your direction',
        body: 'Direction is enough — not a postcode.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['venue.locationDirection'],
          fields: [
            {
              key: 'venue.locationDirection',
              label: 'Location direction',
              placeholder: 'e.g. Local · destination · within 2 hours drive · coastal region',
              type: 'text',
              multiline: true,
            },
            {
              key: 'venue.locationNotes',
              label: 'Notes (optional)',
              placeholder: 'Anything that matters (weather, travel time, culture, family).',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-2:ceremony-reception': {
    id: 'stage-2:ceremony-reception',
    title: 'Confirm Ceremony & Reception Structure',
    subtitle: 'One venue or two? Same day or multi-day?',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'This decision shapes your venue type, transport needs, and timeline.\n\nKeep it simple: one venue or two, and whether you’re planning one day or multiple.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your structure',
        body: 'One sentence is enough.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['ceremony.structure'],
          fields: [
            {
              key: 'ceremony.structure',
              label: 'Structure',
              placeholder: 'e.g. One venue, same day · Two venues · Multi-day celebration',
              type: 'text',
              multiline: true,
            },
            {
              key: 'ceremony.notes',
              label: 'Notes (optional)',
              placeholder: 'Anything important about flow, timings, or cultural format.',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-2:venue-dealbreakers': {
    id: 'stage-2:venue-dealbreakers',
    title: 'Define Venue Dealbreakers & Rules',
    subtitle: 'Protect your shortlist from “almost” venues.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Capture the venue rules that matter most to you.\n\nThis keeps your venue search focused and prevents getting attached to options that can’t work.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your dealbreakers',
        body: 'Short and clear is best.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: [
            'venue.criteria.cateringRule',
            'venue.criteria.barRule',
            'venue.criteria.noiseCurfew',
            'venue.criteria.weatherPlanNeed',
          ],
          fields: [
            {
              key: 'venue.criteria.cateringRule',
              label: 'Catering rule',
              placeholder: 'e.g. Must allow outside catering / In-house only / Flexible',
              type: 'text',
            },
            {
              key: 'venue.criteria.barRule',
              label: 'Bar rule',
              placeholder: 'e.g. BYO allowed / In-house packages / Flexible',
              type: 'text',
            },
            {
              key: 'venue.criteria.noiseCurfew',
              label: 'Noise curfew',
              placeholder: 'e.g. Music must end by 11pm / No restriction known',
              type: 'text',
            },
            {
              key: 'venue.criteria.weatherPlanNeed',
              label: 'Weather backup need',
              placeholder: 'e.g. Must have indoor backup / Tent ok / Flexible',
              type: 'text',
            },
            {
              key: 'venue.criteria.accessibilityNotes',
              label: 'Accessibility notes (optional)',
              placeholder: 'Any access needs you want the venue to meet.',
              type: 'text',
              multiline: true,
            },
            {
              key: 'venue.criteria.notes',
              label: 'Other dealbreakers (optional)',
              placeholder: 'Anything else that would be a clear “no”.',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-2:accommodation-transport': {
    id: 'stage-2:accommodation-transport',
    title: 'Plan Accommodation & Transport',
    subtitle: 'A realistic plan for where people stay and move.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Keep this simple and practical.\n\nA calm accommodation + transport plan prevents last-minute confusion and keeps your location choices grounded.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your plan',
        body: 'Realistic > perfect.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['logistics.accommodationStrategy', 'logistics.transportStrategy'],
          fields: [
            {
              key: 'logistics.accommodationStrategy',
              label: 'Accommodation strategy',
              placeholder: 'e.g. Hotel block · list of options · venue rooms · self-book',
              type: 'text',
              multiline: true,
            },
            {
              key: 'logistics.transportStrategy',
              label: 'Transport strategy',
              placeholder: 'e.g. Everyone drives · taxi/rideshare · coach · walkable',
              type: 'text',
              multiline: true,
            },
            {
              key: 'logistics.shuttleNeed',
              label: 'Shuttle needed? (optional)',
              placeholder: 'yes / no / maybe',
              type: 'text',
            },
            {
              key: 'logistics.notes',
              label: 'Notes (optional)',
              placeholder: 'Any timing, access, or guest needs to remember.',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-4:venue-capacity': {
    id: 'stage-4:venue-capacity',
    title: 'Confirm Ceremony & Reception Capacity',
    subtitle: 'A number that prevents over-inviting.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'This is your reality check.\n\nIf you have a capacity limit, your guest list becomes easier and calmer.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your capacity',
        body: 'A single number is enough.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['guests.venueCapacityMax'],
          fields: [
            {
              key: 'guests.venueCapacityMax',
              label: 'Maximum capacity',
              placeholder: 'e.g. 95',
              type: 'number',
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-4:guest-policies': {
    id: 'stage-4:guest-policies',
    title: 'Define Guest Policies & Boundaries',
    subtitle: 'Clear rules reduce future drama.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Keep this simple and consistent.\n\nA clear policy helps you communicate kindly and avoid renegotiating the same decisions.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Your policy',
        body: 'Short and clear is best.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['guests.policiesSummary'],
          fields: [
            {
              key: 'guests.policiesSummary',
              label: 'Your guest policy (short summary)',
              placeholder: 'e.g. Adults-only · named guests only · plus-ones by invitation',
              type: 'text',
              multiline: true,
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
  'stage-4:manage-rsvps': {
    id: 'stage-4:manage-rsvps',
    title: 'Activate RSVP Tracking System',
    subtitle: 'One method, calmly maintained.',
    cards: [
      {
        id: 'why',
        kind: 'content',
        title: 'Why this matters',
        body:
          'Choose one tracking method so your numbers stay consistent.\n\nYou can keep it simple — the win is having one source of truth.',
        ctaLabel: 'Next',
      },
      {
        id: 'inputs',
        kind: 'inputs',
        title: 'Tracking basics',
        body: 'One method is enough.',
        ctaLabel: 'Save & continue',
        inputs: {
          requiredKeys: ['guests.rsvp.trackingMethod'],
          fields: [
            {
              key: 'guests.rsvp.trackingMethod',
              label: 'Tracking method',
              placeholder: 'e.g. Guest Nest / spreadsheet / website form',
              type: 'text',
            },
            {
              key: 'guests.rsvp.deadline',
              label: 'RSVP deadline (optional)',
              placeholder: 'e.g. 10 Aug 2026 / 4 weeks before',
              type: 'text',
            },
            {
              key: 'guests.rsvp.followUpCadenceDays',
              label: 'Follow-up cadence (days, optional)',
              placeholder: 'e.g. 3',
              type: 'number',
            },
          ],
        },
      },
      {
        id: 'confirm',
        kind: 'confirm',
        title: 'Confirm',
        body: 'If this looks right, we’ll save it and mark this checklist item complete.',
        ctaLabel: 'Confirm & mark complete',
      },
    ],
  },
};

const buildFallbackJourneyCards = (stageId: string, itemId: string): JourneyCard[] => {
  const copy = getChecklistItemCopy(stageId, itemId);
  const quickRoute = getQuickDestinationForItem(stageId, itemId);
  const secondaryAction = quickRoute
    ? {
        label: `Open ${copy?.label || 'tool'}`,
        routeName: quickRoute,
      }
    : undefined;

  return [
    {
      id: 'why',
      kind: 'content',
      title: 'Why this matters',
      body: copy?.description || `A small step to keep your plan moving: ${copy?.label || itemId}.`,
      ctaLabel: 'Next',
    },
    {
      id: 'how',
      kind: 'content',
      title: 'How to do it',
      body: 'Keep it simple. One clear decision is enough for today.',
      bullets: [
        'Write down what you already know.',
        'Choose a starting point you can stand behind.',
        'If you’re unsure, pick the calmest option and adjust later.',
      ],
      ctaLabel: 'Next',
      secondaryAction,
    },
    {
      id: 'confirm',
      kind: 'confirm',
      title: 'Mark complete',
      body: 'When this feels done (even roughly), mark it complete.',
      ctaLabel: 'Mark complete',
    },
  ];
};

const ensureConfirmCard = (cards: JourneyCard[]): JourneyCard[] => {
  const safe = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const hasConfirm = safe.some((card) => card?.kind === 'confirm');
  if (hasConfirm) return safe;
  return [
    ...safe,
    {
      id: 'confirm',
      kind: 'confirm',
      title: 'Mark complete',
      body: 'When this feels done, mark it complete.',
      ctaLabel: 'Mark complete',
    },
  ];
};

export type RoadmapDeckCardType = 'info' | 'bullets' | 'inputs' | 'cta';

export type RoadmapDeckBaseCard = {
  id: string;
  type: RoadmapDeckCardType;
  heading: string;
};

export type RoadmapDeckInfoCard = RoadmapDeckBaseCard & {
  type: 'info';
  body: string;
};

export type RoadmapDeckBulletsCard = RoadmapDeckBaseCard & {
  type: 'bullets';
  body?: string;
  bullets: string[];
};

export type RoadmapDeckInputsCard = RoadmapDeckBaseCard & {
  type: 'inputs';
  helper?: string;
  fields: JourneyInputField[];
  requiredKeys?: string[];
  nextLabel?: string;
};

export type RoadmapDeckCtaCard = RoadmapDeckBaseCard & {
  type: 'cta';
  body?: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

export type RoadmapDeckCard =
  | RoadmapDeckInfoCard
  | RoadmapDeckBulletsCard
  | RoadmapDeckInputsCard
  | RoadmapDeckCtaCard;

export type ResolvedJourneyDeckDefinition = {
  id: string;
  title: string;
  subtitle?: string;
  cards: RoadmapDeckCard[];
  requiredKeys: string[];
  writesToStateKeys: string[];
};

const ensureCtaCard = (cards: RoadmapDeckCard[]): RoadmapDeckCard[] => {
  const safe = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const hasCta = safe.some((card) => card?.type === 'cta');
  if (hasCta) return safe;
  return [
    ...safe,
    {
      id: 'cta',
      type: 'cta',
      heading: 'Mark complete',
      body: 'When this feels done, mark it complete.',
      primaryLabel: 'Mark complete',
    },
  ];
};

const collectDeckRequiredKeys = (cards: RoadmapDeckCard[]): string[] => {
  const required = new Set<string>();
  (cards || []).forEach((card) => {
    if (card?.type !== 'inputs') return;
    (card?.requiredKeys || []).forEach((key) => required.add(key));
  });
  return Array.from(required);
};

const toDeckCardsFromRoadmapItemDef = (def: RoadmapItemDefinition): RoadmapDeckCard[] => {
  const learnCards = (def?.cards || []).map((card, index) => ({
    id: `learn-${index + 1}`,
    type: 'info' as const,
    heading: card.title,
    body: card.body,
  }));

  const inputCard =
    def?.inputs && Array.isArray(def.inputs.fields) && def.inputs.fields.length
      ? [
          {
            id: 'inputs',
            type: 'inputs' as const,
            heading: 'Add what you know',
            helper: 'Approximate is fine — you can refine later.',
            fields: def.inputs.fields as unknown as JourneyInputField[],
            requiredKeys: def.inputs.requiredKeys,
            nextLabel: 'Continue',
          },
        ]
      : [];

  const ctaCard = {
    id: 'cta',
    type: 'cta' as const,
    heading: def?.inputs ? 'Confirm' : 'Mark complete',
    body: def?.inputs
      ? 'If this looks right, we’ll save it and mark this checklist item complete.'
      : 'When this feels done (even roughly), mark it complete.',
    primaryLabel: def?.inputs ? 'Save & mark complete' : 'Mark complete',
    secondaryLabel: def?.inputs ? 'Save without completing' : undefined,
  };

  return ensureCtaCard([...learnCards, ...inputCard, ctaCard]);
};

const toDeckCardsFromLegacyJourney = (legacyCards: JourneyCard[]): RoadmapDeckCard[] => {
  const safe = Array.isArray(legacyCards) ? legacyCards.filter(Boolean) : [];
  const next: RoadmapDeckCard[] = [];

  safe.forEach((card) => {
    if (!card?.kind) return;

    if (card.kind === 'content') {
      if (Array.isArray(card.bullets) && card.bullets.length) {
        next.push({
          id: card.id,
          type: 'bullets',
          heading: card.title,
          body: card.body,
          bullets: card.bullets,
        });
        return;
      }
      next.push({
        id: card.id,
        type: 'info',
        heading: card.title,
        body: card.body || '',
      });
      return;
    }

    if (card.kind === 'inputs') {
      next.push({
        id: card.id,
        type: 'inputs',
        heading: card.title,
        helper: card.body,
        fields: (card.inputs?.fields || []) as JourneyInputField[],
        requiredKeys: card.inputs?.requiredKeys,
        nextLabel: card.ctaLabel || 'Save & continue',
      });
      return;
    }

    if (card.kind === 'confirm') {
      next.push({
        id: card.id,
        type: 'cta',
        heading: card.title,
        body: card.body,
        primaryLabel: card.ctaLabel || 'Mark complete',
      });
    }
  });

  return ensureCtaCard(next);
};

const buildFallbackDeckCards = (stageId: string, itemId: string): RoadmapDeckCard[] => {
  const copy = getChecklistItemCopy(stageId, itemId);
  return ensureCtaCard([
    {
      id: 'why',
      type: 'info',
      heading: 'Why this matters',
      body: copy?.description || 'A small step that makes future choices easier.',
    },
    {
      id: 'how',
      type: 'bullets',
      heading: 'A calm way to do it',
      bullets: [
        'Keep it simple — one small decision at a time.',
        'Write down what you decide so it doesn’t live in your head.',
        'If you get stuck, pick the “good enough for now” option.',
      ],
    },
    {
      id: 'cta',
      type: 'cta',
      heading: 'Mark complete',
      body: 'When this feels done (even roughly), mark it complete.',
      primaryLabel: 'Mark complete',
    },
  ]);
};

export const getJourneyDefinition = (stageId: string, itemId: string): ResolvedJourneyDefinition | null => {
  if (!stageId || !itemId) return null;
  const raw = JOURNEY_DEFINITIONS[`${stageId}:${itemId}`];
  const copy = getChecklistItemCopy(stageId, itemId);

  const cardsFromDef = Array.isArray(raw?.cards) && raw.cards.length > 0 ? raw.cards : null;
  const cards = ensureConfirmCard(cardsFromDef ?? buildFallbackJourneyCards(stageId, itemId));

  return {
    id: raw?.id || `${stageId}:${itemId}`,
    title: raw?.title || copy?.label || itemId,
    subtitle: raw?.subtitle || copy?.description || '',
    cards,
  };
};

export const getJourneyDeckDefinition = (
  stageId: string,
  itemId: string,
): ResolvedJourneyDeckDefinition | null => {
  if (!stageId || !itemId) return null;

  // Journey card-deck definitions:
  // - Prefer ROADMAP_ITEM_DEFINITIONS for curated "learn cards" (+ optional inputs) per item.
  // - Otherwise, adapt legacy JOURNEY_DEFINITIONS (content/inputs/confirm) into the deck model.
  // - Finally, fall back to a simple 3-card template so every item remains usable.
  const itemDef = getRoadmapItemDefinition(stageId, itemId);
  if (itemDef) {
    const cards = toDeckCardsFromRoadmapItemDef(itemDef);
    return {
      id: `${stageId}:${itemId}`,
      title: itemDef.title,
      subtitle: itemDef.subtitle,
      cards,
      requiredKeys: collectDeckRequiredKeys(cards),
      writesToStateKeys: itemDef.writesTo ?? [],
    };
  }

  const legacy = getJourneyDefinition(stageId, itemId);
  const cards = legacy?.cards?.length
    ? toDeckCardsFromLegacyJourney(legacy.cards)
    : buildFallbackDeckCards(stageId, itemId);

  return {
    id: legacy?.id || `${stageId}:${itemId}`,
    title: legacy?.title || itemId,
    subtitle: legacy?.subtitle || '',
    cards,
    requiredKeys: collectDeckRequiredKeys(cards),
    writesToStateKeys: WRITES_TO?.[stageId]?.[itemId] ?? [],
  };
};

export type TipContent = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
};

export const TIP_CONTENT: Record<string, TipContent> = {
  'stage-1:money-guest-chat': {
    id: 'stage-1:money-guest-chat',
    title: 'Align on Budget Range & Guest Estimate',
    subtitle: 'A calm first conversation.',
    body:
      'You’re not finalising anything yet — you’re setting parameters so decisions feel lighter.\n\nIf it helps, aim for ranges, not exact numbers.',
    bullets: [
      'Pick a calm moment (not mid-scroll, not mid-stress).',
      'Talk about what feels comfortable, not what looks impressive.',
      'Capture a guest estimate as a range (it can change later).',
    ],
  },
  'stage-1:clarify-contributors': {
    id: 'stage-1:clarify-contributors',
    title: 'Confirm Financial Contributors & Expectations',
    subtitle: 'Alignment now prevents conflict later.',
    body:
      'If anyone else is contributing, it helps to align early on amounts and decision roles — kindly and clearly.',
    bullets: [
      'Who is contributing (and roughly how much)?',
      'Are contributions fixed or flexible?',
      'Who has the final say on major spends?',
    ],
  },
  'stage-1:budget-cashflow-plan': {
    id: 'stage-1:budget-cashflow-plan',
    title: 'Plan Budget Cashflow & Payments',
    subtitle: 'Avoid one scary month.',
    body:
      'Weddings are often “lumpy” — deposits and final balances can land close together.\n\nA simple plan protects your month-to-month life.',
    bullets: [
      'Map your biggest deposits and final payments first.',
      'Decide what comes from savings vs monthly cash flow.',
      'Keep a buffer rule so you don’t accidentally spend your safety net.',
    ],
  },
  'stage-1:legal-requirements': {
    id: 'stage-1:legal-requirements',
    title: 'Check Legal Requirements for Your Ceremony',
    subtitle: 'Region rules vary — a quick check helps.',
    body:
      'Documents, notice periods, and officiant rules vary by country/region and ceremony type.\n\nA 10-minute check now saves a lot of last-minute stress.',
    bullets: [
      'Confirm what documents are required (and how long they take).',
      'Note any minimum notice periods or residency rules.',
      'Capture deadlines so they don’t sneak up later.',
    ],
  },
  'stage-1:planning-support-level': {
    id: 'stage-1:planning-support-level',
    title: 'Decide Your Planning Support Level',
    subtitle: 'Support is a strategy, not a weakness.',
    body:
      'DIY, coordinator, partial planning, full planning — the best choice is the one that protects your energy and time.',
    bullets: [
      'If you want calm on the day: consider a coordinator.',
      'If decisions feel heavy: partial planning can be perfect.',
      'If time is tight: full planning might be the kindest option.',
    ],
  },
  'stage-2:guest-count': {
    id: 'stage-2:guest-count',
    title: 'Confirm Guest Range & Maximum',
    subtitle: 'The number that shapes everything.',
    body:
      'Guest count quietly drives venue options, catering cost, and the feel of your day.\n\nA range + a hard cap is enough for now.',
    bullets: [
      'Start with ranges (e.g. 80–100) so you don’t over-commit too early.',
      'Pick a hard maximum that you won’t exceed without a real reason.',
      'If your vibe + budget + guest count clash, adjust one — not all at once.',
    ],
  },
  'stage-2:logistics-needs': {
    id: 'stage-2:logistics-needs',
    title: 'Define Your Non-Negotiable Logistics',
    subtitle: 'Practical filters reduce overwhelm.',
    body:
      'Logistics aren’t “boring admin” — they are the filters that make planning calmer.\n\nKeep it short: what must be true for your guests and day to work.',
    bullets: [
      'Think: travel time, climate, accessibility, cultural/religious needs.',
      'Write it like rules, not essays.',
      'Use this list to say “no” faster when browsing venues.',
    ],
  },
  'stage-2:location-area': {
    id: 'stage-2:location-area',
    title: 'Choose Your Location Direction',
    subtitle: 'A focus lens for venue shortlisting.',
    body:
      'You’re choosing direction, not locking a postcode.\n\nThis helps you shortlist venues that are actually realistic for your people.',
    bullets: [
      'Local vs destination (or both) changes guest behaviour and budget.',
      'Consider travel for your core people first.',
      'If you’re unsure, pick two “candidate regions” and compare calmly.',
    ],
  },
  'stage-2:ceremony-reception': {
    id: 'stage-2:ceremony-reception',
    title: 'Confirm Ceremony & Reception Structure',
    subtitle: 'This choice shapes your venue type.',
    body:
      'One venue vs two venues is a major logistics decision.\n\nChoose a structure that protects your energy and your guest flow.',
    bullets: [
      'One venue often means simpler transport and timelines.',
      'Two venues can be beautiful — but plan the movement.',
      'Multi-day weddings need clear anchors (start/end times and roles).',
    ],
  },
  'stage-2:venue-dealbreakers': {
    id: 'stage-2:venue-dealbreakers',
    title: 'Define Venue Dealbreakers & Rules',
    subtitle: 'Stop falling for the wrong venues.',
    body:
      'A shortlist is calmer when you know your “yes/no” rules.\n\nThese dealbreakers protect you from wasting time (and getting emotionally attached).',
    bullets: [
      'Capture catering and bar rules early — they change total cost a lot.',
      'Noise curfews matter more than you think (especially outdoors).',
      'If weather is a risk, decide now what “acceptable backup” means.',
    ],
  },
  'stage-2:accommodation-transport': {
    id: 'stage-2:accommodation-transport',
    title: 'Plan Accommodation & Transport',
    subtitle: 'Keep it realistic and guest-friendly.',
    body:
      'You don’t need a perfect transport plan yet — just a realistic approach.\n\nThis supports your location choice and reduces guest confusion later.',
    bullets: [
      'Decide if guests will drive, rideshare, coach, or walk.',
      'If many guests travel, consider an accommodation “anchor” option.',
      'Shuttles are optional — only add them if they reduce stress.',
    ],
  },
};

export const getTipContent = (stageId: string, itemId: string) =>
  TIP_CONTENT[`${stageId}:${itemId}`] ?? null;

export const getStageChecklistItems = (stageId: string) => getChecklistItems(stageId);
