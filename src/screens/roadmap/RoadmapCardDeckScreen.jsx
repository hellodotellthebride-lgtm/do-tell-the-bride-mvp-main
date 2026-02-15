import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import CardDeck from '../../components/roadmap/CardDeck';
import {
  CHECKLIST_DESTINATIONS,
  getChecklistItemCopy,
  getStageHubRoute,
  getChecklistCardDeckOrFallback,
} from '../../roadmap/roadmapData';
import { loadRoadmapOutputs, mergeRoadmapOutputs } from '../../roadmap/outputsStorage';
import { loadChecklistState, persistStageChecklist } from '../../roadmap/progressStorage';
import { colors } from '../../theme';

const getAtPath = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = String(path || '')
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const alternateOutputKey = (key) => {
  const raw = String(key || '').trim();
  if (!raw) return null;
  if (raw.startsWith('roadmapOutputs.')) return raw.slice('roadmapOutputs.'.length);
  return `roadmapOutputs.${raw}`;
};

const resolveOutputValue = (outputs, key) => {
  const direct = getAtPath(outputs, key);
  if (direct !== undefined && direct !== null && direct !== '') return direct;
  const alt = alternateOutputKey(key);
  if (!alt) return undefined;
  const secondary = getAtPath(outputs, alt);
  if (secondary !== undefined && secondary !== null && secondary !== '') return secondary;
  return undefined;
};

const buildLabelLookup = (cards) => {
  const map = {};
  (cards || []).forEach((card) => {
    if (card?.kind !== 'inputs') return;
    (card?.inputs || []).forEach((input) => {
      if (input?.writeKey && input?.label) {
        map[input.writeKey] = input.label;
        const alt = alternateOutputKey(input.writeKey);
        if (alt) map[alt] = input.label;
      }
    });
  });
  return map;
};

export default function RoadmapCardDeckScreen({ navigation, route }) {
  const stageId = route?.params?.stageId;
  const itemId = route?.params?.itemId;

  const stageHubRoute = useMemo(
    () => (stageId ? getStageHubRoute(stageId) : 'WeddingRoadmap'),
    [stageId],
  );

  const deckDef = useMemo(() => {
    if (!stageId || !itemId) return null;
    return getChecklistCardDeckOrFallback(stageId, itemId);
  }, [stageId, itemId]);

  const checklistCopy = useMemo(
    () => (stageId && itemId ? getChecklistItemCopy(stageId, itemId) : { label: '', description: '' }),
    [stageId, itemId],
  );

  const quickDestination = useMemo(() => {
    if (!stageId || !itemId) return null;
    return CHECKLIST_DESTINATIONS?.[stageId]?.[itemId] ?? null;
  }, [stageId, itemId]);

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    setInitialValues({});
  }, [stageId, itemId]);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const cards = deckDef?.cards || [];
        const keys = [];
        cards.forEach((card) => {
          if (card?.kind !== 'inputs') return;
          (card?.inputs || []).forEach((input) => {
            if (input?.writeKey) keys.push(input.writeKey);
          });
        });
        if (!keys.length) return;

        const outputs = await loadRoadmapOutputs();
        if (!mounted) return;

        const next = {};
        keys.forEach((key) => {
          const existing = resolveOutputValue(outputs, key);
          if (existing === null || existing === undefined) return;
          next[key] = String(existing);
        });
        setInitialValues(next);
      } catch (error) {
        console.warn('[RoadmapCardDeck] unable to hydrate outputs', error);
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, [deckDef]);

  const handleBackToHub = useCallback(() => {
    navigation?.navigate?.(stageHubRoute);
  }, [navigation, stageHubRoute]);

  const handleSavePatch = useCallback(async (patch) => {
    if (!patch || Object.keys(patch).length === 0) return;
    await mergeRoadmapOutputs(patch);
  }, []);

  const handleConfirmComplete = useCallback(
    async (patch) => {
      if (!stageId || !itemId) return { ok: false, message: 'Missing stage or item.' };

      try {
        if (patch && Object.keys(patch).length > 0) {
          await mergeRoadmapOutputs(patch);
        }

        const completion = deckDef?.completion;
        const completionType = completion?.type;

        if (!completionType) {
          navigation?.navigate?.(stageHubRoute);
          return { ok: true };
        }

        if (completionType === 'hybrid') {
          const requiredKeys = Array.isArray(completion?.requiredWriteKeys)
            ? completion.requiredWriteKeys
            : [];
          const outputs = await loadRoadmapOutputs();
          const labelByKey = buildLabelLookup(deckDef?.cards || []);

          const missing = requiredKeys
            .map((key) => {
              const value = resolveOutputValue(outputs, key);
              if (value === null || value === undefined || value === '') return labelByKey[key] || key;
              return null;
            })
            .filter(Boolean);

          if (missing.length) {
            return { ok: false, message: `Missing: ${missing.join(', ')}` };
          }
        }

        const completionStageId = completion?.checklistStageId ?? stageId;
        const completionItemId = completion?.checklistItemId ?? itemId;

        const checklistState = await loadChecklistState();
        const stageMap = checklistState?.[completionStageId] ?? {};
        const nextStageMap = { ...stageMap, [completionItemId]: true };
        await persistStageChecklist(completionStageId, nextStageMap);

        navigation?.navigate?.(stageHubRoute);
        return { ok: true };
      } catch (error) {
        console.warn('[RoadmapCardDeck] unable to complete', error);
        Alert.alert('Something went wrong', 'Please try again.');
        return { ok: false, message: 'Please try again.' };
      }
    },
    [deckDef, itemId, navigation, stageHubRoute, stageId],
  );

  const handleOpenRoute = useCallback(
    (routeName) => {
      if (!routeName) return;
      navigation?.navigate?.(routeName);
    },
    [navigation],
  );

  if (!deckDef) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  const title = deckDef?.title || checklistCopy?.label || 'Checklist';
  const subtitle = deckDef?.subtitle || checklistCopy?.description || '';

  const cards = useMemo(() => {
    const raw = deckDef?.cards || [];
    if (!raw.length) return raw;
    if (!quickDestination) return raw;

    // If the deck doesn't already include an openRoute action, attach the tool as a secondary CTA
    // to the final action card (so tools remain reachable even while content is still filling in).
    const next = raw.map((card) => ({ ...card }));
    const lastIndex = next.length - 1;
    const last = next[lastIndex];
    if (last?.kind !== 'action') return next;
    const hasAnyOpenRoute =
      next.some((c) => c?.kind === 'action' && (c?.primaryCta?.action === 'openRoute' || c?.secondaryCta?.action === 'openRoute')) ||
      next.some((c) => c?.kind === 'action' && c?.route);
    if (hasAnyOpenRoute) return next;

    next[lastIndex] = {
      ...last,
      route: quickDestination,
      secondaryCta: last.secondaryCta ?? { label: 'Open tool', action: 'openRoute' },
    };
    return next;
  }, [deckDef, quickDestination]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <CardDeck
        title={title}
        subtitle={subtitle}
        cards={cards}
        initialValues={initialValues}
        onBack={handleBackToHub}
        onSavePatch={handleSavePatch}
        onConfirmComplete={handleConfirmComplete}
        onOpenRoute={handleOpenRoute}
      />
    </SafeAreaView>
  );
}
