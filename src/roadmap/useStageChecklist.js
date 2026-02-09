import { useCallback, useEffect, useMemo, useState } from 'react';
import { getChecklistItems } from './checklists';
import { loadChecklistState, persistStageChecklist } from './progressStorage';

const buildInitialMap = (items) =>
  items.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});

export default function useStageChecklist(stageId) {
  const items = getChecklistItems(stageId);
  const [checkedMap, setCheckedMap] = useState(() => buildInitialMap(items));

  useEffect(() => {
    let isMounted = true;
    loadChecklistState().then((state) => {
      if (!isMounted) return;
      const storedStage = state[stageId];
      if (storedStage) {
        setCheckedMap((prev) => ({ ...prev, ...storedStage }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [stageId]);

  const toggleItem = useCallback(
    (itemId) => {
      setCheckedMap((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        persistStageChecklist(stageId, next);
        return next;
      });
    },
    [stageId],
  );

  const completeCount = useMemo(
    () => items.reduce((sum, item) => sum + (checkedMap[item.id] ? 1 : 0), 0),
    [items, checkedMap],
  );

  return {
    items,
    checkedMap,
    toggleItem,
    completeCount,
    totalCount: items.length,
  };
}
