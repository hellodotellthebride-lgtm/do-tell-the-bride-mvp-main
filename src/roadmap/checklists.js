export const STAGE_CHECKLISTS = {
  'stage-1': [
    { id: 'money-guest-chat', label: 'Have the first money + guest chat' },
    { id: 'agree-rough-budget', label: 'Agree your rough total budget' },
    { id: 'choose-wedding-vibe', label: 'Choose your yearly vibe / atmosphere' },
    { id: 'top-three-priorities', label: 'Write down your top 3 priorities (non-negotiables)' },
    { id: 'engagement-length', label: 'Decide your preferred engagement length' },
    { id: 'clarify-contributors', label: 'Clarify who’s contributing financially' },
  ],
  'stage-2': [
    { id: 'guest-count', label: 'Get a rough guest count' },
    { id: 'location-area', label: 'Agree preferred location / area' },
    { id: 'ceremony-reception', label: 'Decide one vs separate ceremony + reception' },
    {
      id: 'logistics-needs',
      label: 'List your must-have logistics (travel, access, weather, etc.)',
    },
  ],
  'stage-3': [
    { id: 'vendor-shortlist', label: 'Shortlist your top “must-have” vendors' },
    { id: 'diy-vs-hire', label: 'Decide what you’ll DIY vs hire' },
    { id: 'book-key-vendors', label: 'Book your venue and 1–2 key vendors' },
    { id: 'transport-plan', label: 'Start a simple transport plan' },
  ],
  'stage-4': [
    { id: 'plan-guest-list', label: 'Plan your guest list' },
    { id: 'collect-contact-info', label: 'Collect contact info' },
    { id: 'create-invitations', label: 'Create invitations' },
    { id: 'send-save-dates', label: 'Send save-the-dates' },
    { id: 'manage-rsvps', label: 'Manage RSVPs' },
  ],
  'stage-5': [
    { id: 'plan-wedding-dress', label: 'Plan your wedding dress' },
    { id: 'bridesmaid-dresses', label: 'Choose bridesmaid dresses' },
    { id: 'groom-style', label: 'Decide groom & groomsmen style' },
    { id: 'sustainable-fashion', label: 'Explore sustainable fashion' },
    { id: 'stag-hen', label: 'Plan stag & hen celebrations' },
    { id: 'photo-video', label: 'Plan photo & video' },
    { id: 'cultural-traditions', label: 'Consider cultural or religious traditions' },
  ],
  'stage-6': [
    { id: 'vendor-finalise', label: 'Finalise all details with vendors' },
    { id: 'send-invitations', label: 'Send final invitations' },
    { id: 'seating-logistics', label: 'Plan seating & logistics' },
    { id: 'vows-speeches', label: 'Prepare vows & speeches' },
    { id: 'decor-setup', label: 'Organise décor & setup' },
  ],
  'stage-7': [
    { id: 'confirm-final-timings', label: 'Confirm final timings & logistics' },
    { id: 'prep-calm-morning', label: 'Prep calm morning essentials' },
    { id: 'set-boundaries', label: 'Set boundaries & expectations' },
    { id: 'hand-over-plans', label: 'Hand over plans' },
    { id: 'prepare-day-after', label: 'Prepare for the day (and after)' },
  ],
};

export const getChecklistItems = (stageId) => STAGE_CHECKLISTS[stageId] ?? [];
