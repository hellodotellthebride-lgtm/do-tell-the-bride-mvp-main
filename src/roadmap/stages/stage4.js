export const STAGE_4_ID = 'stage-4';

export const stage4Config = {
  id: STAGE_4_ID,
  number: 4,
  title: 'Your Guest List & Invitations',
  subtitle: 'Finalise your guest list and manage communication with clarity.',
  intro: 'This stage locks in your confirmed guest list and communication plan.',
  note:
    'Invitation customs and timelines vary by country and culture — adjust based on your region.',
  outcomes: [
    'A confirmed working guest count',
    'A complete contact database',
    'A clear children + plus-one policy',
    'Save-the-dates or invitations sent (if applicable)',
  ],
  unlocks: [
    'Final catering numbers',
    'Seating plan accuracy',
    'Print deadlines',
    'Transport planning',
  ],
  checklist: [
    { id: 'plan-guest-list', route: 'Stage4PlanGuestList' },
    // This is a guide/check rather than a full subpage yet.
    { id: 'venue-capacity', route: 'Stage4PlanGuestList' },
    { id: 'guest-policies', route: 'Stage4KidsFamily' },
    { id: 'collect-contact-info', route: 'Stage4CollectContacts' },
    { id: 'accessibility-comfort', route: 'Stage4AccessibilityComfort' },
    { id: 'website-setup', route: 'Stage4WeddingWebsite' },
    { id: 'send-save-dates', route: 'Stage4SaveTheDates' },
    { id: 'create-invitations', route: 'Stage4CreateInvitations' },
    { id: 'manage-rsvps', route: 'Stage4ManageRSVPs' },
  ],
  continue: {
    label: 'Continue to Stage 5 — Wedding Style',
    route: 'Stage5Style',
  },
  footer: {
    title: '“You can lead this part calmly.”',
    body: 'Every clear note you capture here means one less favour to chase later.',
  },
};

