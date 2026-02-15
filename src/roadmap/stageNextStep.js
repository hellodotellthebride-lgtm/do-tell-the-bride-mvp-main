export const getStageNextStep = (stage) => {
  const items = Array.isArray(stage?.checklistItems) ? stage.checklistItems : [];
  const next = items
    .filter((item) => !item?.completed)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))[0];

  return next ?? null;
};

