import { buildChecklistNavigationTarget, getStageChecklistItems } from '../roadmapData';

export type RecommendedStep = {
  stageId: string;
  itemId: string;
  title: string;
  description?: string;
  kind: 'quick' | 'tip' | 'journey';
  routeName: string | null;
  params?: any;
};

export const selectRecommendedNextStepInStage = (
  stageId: string,
  roadmapChecklistState: Record<string, Record<string, boolean>> = {},
): RecommendedStep | null => {
  const items = getStageChecklistItems(stageId);
  const stageMap = roadmapChecklistState?.[stageId] ?? {};
  const nextItem: any = items.find((item: any) => !stageMap?.[item.id]);
  if (!nextItem?.id) return null;

  const navTarget = buildChecklistNavigationTarget(stageId, nextItem.id);

  return {
    stageId,
    itemId: nextItem.id,
    title: nextItem.label ?? nextItem.id,
    description: nextItem.description ?? '',
    kind: navTarget.kind,
    routeName: navTarget.routeName,
    params: navTarget.params,
  };
};

