export type ChecklistItemKind = 'quick' | 'tip' | 'journey';

// Overrides only. Anything not listed defaults to 'journey'.
export const ITEM_KIND: Record<string, Record<string, ChecklistItemKind>> = {
  'stage-1': {},
  'stage-2': {},
  'stage-3': {},
  'stage-4': {},
  'stage-5': {},
  'stage-6': {},
  'stage-7': {},
  'stage-8': {},
};

export const getItemKind = (stageId: string, itemId: string): ChecklistItemKind => {
  return ITEM_KIND?.[stageId]?.[itemId] ?? 'journey';
};
