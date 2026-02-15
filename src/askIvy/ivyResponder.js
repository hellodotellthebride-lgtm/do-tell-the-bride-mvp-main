const DEFAULT_FOLLOW_UP_QUESTION = 'What’s most true for you right now?';
const MAX_BULLETS = 5;

const includesAny = (haystack, needles) =>
  needles.some((needle) => haystack.includes(needle));

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const formatCurrencyGBP = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `£${Math.round(numeric).toLocaleString('en-GB')}`;
  }
};

const clampBullets = (bullets) => {
  const safeBullets = Array.isArray(bullets) ? bullets.filter(Boolean) : [];
  return safeBullets.slice(0, MAX_BULLETS);
};

const formatResponse = ({
  openingLine,
  bullets = [],
  followUpQuestion = DEFAULT_FOLLOW_UP_QUESTION,
  hiddenToken,
}) => {
  const bulletLines = clampBullets(bullets)
    .map((line) => `• ${line}`)
    .join('\n');

  const core = `${openingLine}\n\n${bulletLines}\n\n${followUpQuestion}`;
  if (!hiddenToken) return core;
  return `${core}\n\n${hiddenToken}`;
};

const toContext = (context) => (context && typeof context === 'object' ? context : {});

const toFiniteNumber = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
};

const roadmapToken = ({ stageId, label }) =>
  stageId ? `[[ROADMAP_STAGE:${stageId}|${label || 'Open your Roadmap'}]]` : null;

const suggestionTokens = (suggestions = []) => {
  const safe = Array.isArray(suggestions)
    ? suggestions.map((value) => String(value || '').trim()).filter(Boolean)
    : [];
  return safe.slice(0, 3).map((label) => `[[SUGGEST:${label}]]`).join('\n');
};

export const respondToUser = (text = '', context) => {
  const normalized = normalizeText(text);
  const ctx = toContext(context);

  const isBudget = includesAny(normalized, [
    'budget',
    'cost',
    'price',
    'spend',
    'spending',
    '$',
  ]);
  const isVendor = includesAny(normalized, [
    'vendor',
    'photographer',
    'photo',
    'videographer',
    'venue',
    'cater',
    'dj',
    'band',
    'planner',
    'florist',
    'contract',
  ]);
  const isGuest = includesAny(normalized, [
    'guest',
    'awkward',
    'family',
    'plus one',
    'plus-one',
    'kids',
    'child',
    'invite',
    'rsvp',
  ]);
  const isOverwhelmed = includesAny(normalized, [
    'overwhelmed',
    'stressed',
    'anxious',
    'start',
    'next',
    'what next',
    'where do i begin',
    'what should i do',
  ]);

  const isDistressed = includesAny(normalized, [
    'panic',
    'panicking',
    'spiral',
    'spiraling',
    'freaking out',
    'meltdown',
    'breaking down',
    "can't cope",
    'cant cope',
    'cannot cope',
    'too much',
    'overwhelmed',
    'stressed',
    'anxious',
  ]);

  const budgetTotal = toFiniteNumber(ctx?.budgetTotal);
  const guestCount = toFiniteNumber(ctx?.guestCount);
  const roadmapNextStage = ctx?.roadmapNextStage && typeof ctx.roadmapNextStage === 'object'
    ? ctx.roadmapNextStage
    : null;

  if (isDistressed) {
    const formattedTotal = formatCurrencyGBP(budgetTotal);
    const hasBudgetTotal = Boolean(formattedTotal);
    const hasWeddingDate = Boolean(ctx?.hasWeddingDate);
    const hasBudget = Boolean(ctx?.hasBudget);
    const hasGuests = Boolean(ctx?.hasGuests);

    const followUpQuestion = !hasWeddingDate
      ? 'Do you have a rough season or month in mind for your wedding date?'
      : !hasBudget
          ? 'Do you have a rough total budget number in mind yet (even a range)?'
          : !hasGuests
              ? 'About how many guests are you planning for (roughly)?'
              : 'What’s the one thing you want to feel easier this week?';

    const hiddenTokenParts = [
      roadmapNextStage?.id && roadmapNextStage?.number && roadmapNextStage?.title
        ? roadmapToken({
            stageId: roadmapNextStage.id,
            label: `Open Stage ${roadmapNextStage.number} — ${roadmapNextStage.title}`,
          })
        : null,
      suggestionTokens([
        'What should I do today?',
        'Give me a 1-week plan',
        'Help me decide between two options',
      ]),
    ]
      .filter(Boolean)
      .join('\n');

    if (isGuest) {
      return formatResponse({
        openingLine: 'That sounds like a lot. Let’s keep this gentle and practical.',
        bullets: [
          'Choose one short line and repeat it once (no debating).',
          'Script: “We’re at capacity, so the guest list is set — we can’t add anyone else.”',
          'Tell me who’s asking and what they want (plus-one / kids / extra invite), and I’ll tailor a 2‑sentence text.',
        ],
        followUpQuestion,
        hiddenToken: hiddenTokenParts,
      });
    }

    if (isBudget) {
      return formatResponse({
        openingLine: 'That sounds like a lot. We can make the money piece feel steadier.',
        bullets: [
          hasBudgetTotal
            ? `You already have a total budget of ${formattedTotal} — that’s a strong start.`
            : 'Write down a total budget number (even a guess) so decisions have a container.',
          'Pick one “must-protect” category (the thing you care most about).',
          'Do one 10‑minute check: look up 2 real examples (venues/catering) to get a range.',
        ],
        followUpQuestion,
        hiddenToken: hiddenTokenParts,
      });
    }

    if (isVendor) {
      return formatResponse({
        openingLine: 'That sounds like a lot. Let’s make vendor decisions smaller and calmer.',
        bullets: [
          'Pick one vendor to focus on this week (venue / photo / food / music).',
          'Ask 3 questions: what’s included, what’s the all‑in cost, and what happens if you reschedule.',
          'Send one short inquiry message today — that’s enough progress.',
        ],
        followUpQuestion,
        hiddenToken: hiddenTokenParts,
      });
    }

    return formatResponse({
      openingLine: 'That sounds like a lot. Let’s make the next step tiny and doable.',
      bullets: [
        'Pick one lane: budget, vendors, guests, or timeline.',
        'Do one 10‑minute action in that lane (one message, one list, or one number).',
        roadmapNextStage?.id && roadmapNextStage?.number
          ? `If it helps, focus only on Stage ${roadmapNextStage.number} next.`
          : 'If it helps, focus only on one small checklist item next.',
      ].filter(Boolean),
      followUpQuestion,
      hiddenToken: hiddenTokenParts,
    });
  }

  if (isBudget) {
    const formattedTotal = formatCurrencyGBP(budgetTotal);
    const hasBudgetTotal = Boolean(formattedTotal);

    const bufferLow = hasBudgetTotal ? formatCurrencyGBP(budgetTotal * 0.1) : null;
    const bufferHigh = hasBudgetTotal ? formatCurrencyGBP(budgetTotal * 0.15) : null;
    const bufferText = bufferLow && bufferHigh ? `${bufferLow}–${bufferHigh}` : null;

    const openingLine = hasBudgetTotal
      ? `You’ve set a total budget of ${formattedTotal} — we can make this calmer.`
      : 'Money decisions can feel loaded — we can make this calmer.';

    const bullets = [
      hasBudgetTotal && bufferText
        ? `Set a 10–15% buffer (${bufferText}) so surprises don’t sting.`
        : 'Set a 10–15% buffer for surprises so nothing catches you off guard.',
      'Choose your top 3 priorities — the things you’ll protect even if you trim elsewhere.',
      guestCount
        ? `With ~${Math.round(guestCount)} guests, sanity-check big-ticket quotes early (venue + food/drink).`
        : 'Sanity-check big-ticket quotes early (venue + food/drink + photo/video).',
      'Give each category a range (not a perfect number) and adjust after 2–3 real quotes.',
      'If you want, open Budget Buddy and track quotes as they come in.',
    ];

    const followUpQuestion = !hasBudgetTotal
      ? 'Do you have a rough total budget number in mind yet (even a range)?'
      : !guestCount
          ? 'About how many guests are you planning for (even roughly)?'
          : 'What’s the one area you’re happy to spend on — and the one you want to keep lean?';

    const hiddenToken = suggestionTokens([
      'Help me set category ranges',
      'How do I cut costs?',
      'What should my buffer be?',
    ]);

    return formatResponse({ openingLine, bullets, followUpQuestion, hiddenToken });
  }

  if (isVendor) {
    return formatResponse({
      openingLine: 'Vendor decisions get easier with a clean checklist.',
      bullets: [
        'Ask what’s included vs. add-ons (hours, edits, travel, setup/strike, assistants).',
        'Confirm deposit, payment schedule, and cancellation/reschedule policy in writing.',
        'Request a full sample gallery (or full event) plus 1–2 references.',
        'Clarify deliverables + timeline (what you get, when you get it).',
        'Red flags: no contract, pressure to pay fast, vague scope, or unclear refunds.',
      ],
      followUpQuestion: 'Which vendor are you choosing right now — and what matters most (price, style, or ease)?',
      hiddenToken: suggestionTokens([
        'What are red flags?',
        'Help me decide between two options',
        'Give me a short vendor email',
      ]),
    });
  }

  if (isGuest) {
    return formatResponse({
      openingLine: 'Awkward guest situations are common — we can keep it kind and firm.',
      bullets: [
        'Soft script: “We’re keeping it small, so we can’t add anyone else — I hope you understand.”',
        'Firm script: “We’re at capacity, so the guest list is set.”',
        'Clear script: “We’re not making guest list changes, but we’re excited to celebrate with you.”',
        'Pick one clear plus-one rule (named guests only / long-term partners) and repeat it consistently.',
        'Tell me the exact scenario and I’ll tailor a 2‑sentence message.',
      ],
      followUpQuestion: 'Who is asking — and what do you want the rule to be? (Plus-one, kids, or extra invites?)',
      hiddenToken: suggestionTokens([
        'Give me a 2-sentence text',
        'Make it softer',
        'Make it firmer',
      ]),
    });
  }

  if (isOverwhelmed) {
    const hasWeddingDate = Boolean(ctx?.hasWeddingDate);
    const hasBudget = Boolean(ctx?.hasBudget);
    const hasGuests = Boolean(ctx?.hasGuests);

    const missingFollowUp = !hasWeddingDate
      ? 'Do you have a rough season or month in mind for your wedding date?'
      : !hasBudget
          ? 'Do you have a rough total budget number in mind yet (even a range)?'
          : !hasGuests
              ? 'About how many guests are you planning for (roughly)?'
              : null;

    if (roadmapNextStage?.id && roadmapNextStage?.number && roadmapNextStage?.title) {
      const stageLabel = `Open Stage ${roadmapNextStage.number} — ${roadmapNextStage.title}`;
      const hiddenToken = [
        roadmapToken({ stageId: roadmapNextStage.id, label: stageLabel }),
        suggestionTokens([
          'Give me a 1-week plan',
          'What should I do today?',
          'Help me decide between two options',
        ]),
      ]
        .filter(Boolean)
        .join('\n');

      const stageChecklist = Array.isArray(roadmapNextStage.checklistLabels)
        ? roadmapNextStage.checklistLabels
        : [];

      const bullets =
        stageChecklist.length > 0
          ? stageChecklist
          : roadmapNextStage.id === 'stage-8'
            ? [
                'Make a tiny thank-you plan (who, how, and by when).',
                'Chase any final vendor deliverables (photos/video timelines, remaining edits).',
                'Return rentals + collect deposits back (write a single list so nothing is missed).',
                'Save your key docs in one folder (contracts, receipts, seating plan, speeches).',
                'Choose one keepsake/memory task (album, prints, or a simple highlights folder).',
              ]
          : [
              'Write 3 words for your vibe + your top 3 priorities.',
              'Set a guest count range (small/medium/large) — it guides everything.',
              'Pick a date window and start venue outreach first.',
              'Do one money task: total budget + buffer.',
              'Do one people task: draft an A/B guest list (must-have vs. nice-to-have).',
            ];

      return formatResponse({
        openingLine: `You don’t have to figure everything out at once — your next Roadmap stage is Stage ${roadmapNextStage.number}: ${roadmapNextStage.title}.`,
        bullets,
        followUpQuestion: missingFollowUp || 'Which of these feels easiest to do first?',
        hiddenToken,
      });
    }

    return formatResponse({
      openingLine: 'You don’t have to figure everything out at once — let’s choose the next calm step.',
      bullets: [
        'Write 3 words for your vibe + your top 3 priorities (what matters most).',
        'Set a guest count range (small/medium/large) — it guides everything.',
        'Pick a date window and start venue outreach first.',
        'Do one money task: total budget + buffer.',
        'Do one people task: draft an A/B guest list (must-have vs. nice-to-have).',
      ],
      followUpQuestion: missingFollowUp || DEFAULT_FOLLOW_UP_QUESTION,
      hiddenToken: suggestionTokens([
        'Give me a 1-week plan',
        'What should I do today?',
        'Help me decide between two options',
      ]),
    });
  }

  return formatResponse({
    openingLine: 'I can help — we’ll keep it simple.',
    bullets: [
      'Pick one area (budget, vendors, guests, or next steps) — we’ll do a 10‑minute first step.',
      'Budget clarity (total + category ranges)',
      'Vendor questions (what to ask + red flags)',
      'Guest scripts (kind but firm wording)',
      'Next steps (a calm 1–2 week plan)',
    ],
    followUpQuestion: 'Which area do you want help with first — budget, vendors, guests, or next steps?',
    hiddenToken: suggestionTokens([
      'Help me decide between two options',
      'What are red flags?',
      'Give me a 1-week plan',
    ]),
  });
};
