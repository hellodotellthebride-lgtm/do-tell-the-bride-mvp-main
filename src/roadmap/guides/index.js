import { stage4Guides, getStage4GuideById } from './stage4Guides';

export const getGuidesForStage = (stageId) => {
  switch (stageId) {
    case 'stage-4':
      return stage4Guides;
    default:
      return [];
  }
};

export const getGuideById = (stageId, guideId) => {
  switch (stageId) {
    case 'stage-4':
      return getStage4GuideById(guideId);
    default:
      return null;
  }
};

