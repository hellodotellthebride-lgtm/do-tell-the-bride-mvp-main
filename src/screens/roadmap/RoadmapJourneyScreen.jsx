import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CTAButton from '../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../components/roadmap/tokens';
import {
  getJourneyDeckDefinition,
  getQuickDestinationForItem,
  getStageHubRoute,
} from '../../roadmap/roadmapData';
import { loadRoadmapOutputs, mergeRoadmapOutputs } from '../../roadmap/outputsStorage';
import { loadChecklistState, persistStageChecklist } from '../../roadmap/progressStorage';
import JourneyCardCarousel from '../../roadmap/components/JourneyCardCarousel';

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

const coerceValue = (raw, fieldType) => {
  if (fieldType === 'multiSelect') {
    return Array.isArray(raw) && raw.length > 0 ? raw : undefined;
  }
  const text = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
  if (!text) return undefined;
  if (fieldType === 'number') {
    const numeric = Number(text.replace(/,/g, ''));
    return Number.isFinite(numeric) ? numeric : undefined;
  }
  return text;
};

const buildFieldIndex = (cards) => {
  const safe = Array.isArray(cards) ? cards : [];
  const fieldByKey = {};
  const cardIndexByKey = {};
  safe.forEach((card, index) => {
    if (card?.kind !== 'inputs') return;
    (card?.fields || []).forEach((field) => {
      if (!field?.key) return;
      fieldByKey[field.key] = field;
      cardIndexByKey[field.key] = index;
      const alt = alternateOutputKey(field.key);
      if (alt) {
        fieldByKey[alt] = field;
        cardIndexByKey[alt] = index;
      }
    });
  });
  return { fieldByKey, cardIndexByKey };
};

const toCarouselCards = (deckCards, quickDestination) => {
  const safe = Array.isArray(deckCards) ? deckCards.filter(Boolean) : [];
  const total = safe.length;

  return safe.map((card, index) => {
    const kicker = `CARD ${index + 1} OF ${total}`;

    if (card?.type === 'inputs') {
      const requiredSet = new Set(Array.isArray(card?.requiredKeys) ? card.requiredKeys : []);
      const fields = (card?.fields || []).map((field) => ({
        ...field,
        required: requiredSet.has(field.key) || requiredSet.has(alternateOutputKey(field.key)),
      }));
      return {
        id: card.id,
        kind: 'inputs',
        kicker,
        heading: card.heading,
        body: card.helper,
        fields,
        requiredKeys: card.requiredKeys || [],
        primaryCtaLabel: card.nextLabel || 'Save & continue',
        secondaryCtaLabel: 'Skip for now',
      };
    }

    if (card?.type === 'cta') {
      return {
        id: card.id,
        kind: 'confirm',
        kicker,
        heading: card.heading,
        body: card.body,
        primaryCtaLabel: card.primaryLabel || 'Confirm & mark complete',
        secondaryCtaLabel: card.secondaryLabel || 'Back',
      };
    }

    if (card?.type === 'bullets') {
      return {
        id: card.id,
        kind: 'bullets',
        kicker,
        heading: card.heading,
        body: card.body,
        bullets: card.bullets,
        primaryCtaLabel: 'Next',
        secondaryAction:
          index === 0 && quickDestination
            ? { label: 'Open the related tool', routeName: quickDestination }
            : null,
      };
    }

    return {
      id: card.id,
      kind: 'info',
      kicker,
      heading: card.heading,
      body: card.body,
      primaryCtaLabel: 'Next',
      secondaryAction:
        index === 0 && quickDestination
          ? { label: 'Open the related tool', routeName: quickDestination }
          : null,
    };
  });
};

export default function RoadmapJourneyScreen({ navigation, route }) {
  const stageId = route?.params?.stageId;
  const itemId = route?.params?.itemId;

  const stageHubRoute = useMemo(
    () => (stageId ? getStageHubRoute(stageId) : 'WeddingRoadmap'),
    [stageId],
  );

  const journeyDef = useMemo(() => {
    if (!stageId || !itemId) return null;
    return getJourneyDeckDefinition(stageId, itemId);
  }, [stageId, itemId]);

  const quickDestination = useMemo(() => {
    if (!stageId || !itemId) return null;
    return getQuickDestinationForItem(stageId, itemId);
  }, [stageId, itemId]);

  const [values, setValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [inlineError, setInlineError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({});
    setFieldErrors({});
    setInlineError('');
  }, [stageId, itemId]);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const cards = journeyDef?.cards || [];
        const inputFields = cards
          .filter((card) => card?.type === 'inputs')
          .flatMap((card) => card?.fields || []);
        if (!inputFields.length) return;

        const outputs = await loadRoadmapOutputs();
        if (!mounted) return;

        const next = {};
        inputFields.forEach((field) => {
          const existing = resolveOutputValue(outputs, field.key);
          if (existing === null || existing === undefined) return;
          if (field.type === 'multiSelect' && Array.isArray(existing)) {
            next[field.key] = existing;
            return;
          }
          next[field.key] = String(existing);
        });
        setValues(next);
      } catch (error) {
        console.warn('[RoadmapJourney] unable to hydrate outputs', error);
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, [journeyDef]);

  const handleBackToHub = useCallback(() => {
    navigation?.navigate?.(stageHubRoute);
  }, [navigation, stageHubRoute]);

  const cards = useMemo(
    () => toCarouselCards(journeyDef?.cards ?? [], quickDestination),
    [journeyDef, quickDestination],
  );

  const { fieldByKey, cardIndexByKey } = useMemo(() => buildFieldIndex(cards), [cards]);

  const inputFields = useMemo(
    () => cards.filter((card) => card?.kind === 'inputs').flatMap((card) => card?.fields || []),
    [cards],
  );

  const buildPatchForFields = useCallback(
    (fields = []) => {
      const patch = {};
      (fields || []).forEach((field) => {
        const raw = values?.[field.key];
        const coerced = coerceValue(raw, field.type);
        if (coerced === undefined) return;

        const keys = [field.key, alternateOutputKey(field.key)].filter(Boolean);
        keys.forEach((k) => {
          const parts = String(k || '')
            .split('.')
            .map((p) => p.trim())
            .filter(Boolean);
          if (!parts.length) return;
          let cursor = patch;
          parts.forEach((part, idx) => {
            if (idx === parts.length - 1) {
              cursor[part] = coerced;
              return;
            }
            if (!cursor[part] || typeof cursor[part] !== 'object' || Array.isArray(cursor[part])) {
              cursor[part] = {};
            }
            cursor = cursor[part];
          });
        });
      });
      return patch;
    },
    [values],
  );

  const handleSavePartial = useCallback(
    async ({ patch }) => {
      if (saving) return;
      try {
        if (patch && Object.keys(patch).length > 0) {
          await mergeRoadmapOutputs(patch);
        }
      } catch (error) {
        console.warn('[RoadmapJourney] unable to save partial', error);
        Alert.alert('Something went wrong', 'Please try again.');
      }
    },
    [saving],
  );

  const handleComplete = useCallback(
    async ({ patch }) => {
      if (saving) return;
      if (!stageId || !itemId) return;

      setSaving(true);
      try {
        if (patch && Object.keys(patch).length > 0) {
          await mergeRoadmapOutputs(patch);
        }

        const checklistState = await loadChecklistState();
        const stageMap = checklistState?.[stageId] ?? {};
        const nextStageMap = { ...stageMap, [itemId]: true };
        await persistStageChecklist(stageId, nextStageMap);

        navigation?.navigate?.(stageHubRoute);
      } catch (error) {
        console.warn('[RoadmapJourney] unable to complete journey', error);
        Alert.alert('Something went wrong', 'Please try again.');
      } finally {
        setSaving(false);
      }
    },
    [saving, stageId, itemId, navigation, stageHubRoute],
  );

  if (!journeyDef) return null;

  const validateKeys = (requiredKeys) => {
    const required = Array.isArray(requiredKeys) ? requiredKeys : [];
    if (!required.length) return { ok: true, missingKeys: [] };

    const missingKeys = [];
    required.forEach((key) => {
      const field = fieldByKey?.[key] ?? fieldByKey?.[alternateOutputKey(key)];
      const canonicalKey = field?.key ?? key;
      const fieldType = field?.type ?? 'text';
      const raw = values?.[canonicalKey];
      const coerced = coerceValue(raw, fieldType);
      if (coerced === undefined) missingKeys.push(key);
    });

    return { ok: missingKeys.length === 0, missingKeys };
  };

  const applyMissingErrors = (missingKeys) => {
    const nextErrors = {};
    missingKeys.forEach((key) => {
      const field = fieldByKey?.[key] ?? fieldByKey?.[alternateOutputKey(key)];
      if (field?.key) nextErrors[field.key] = 'Required';
    });
    setFieldErrors(nextErrors);
    if (missingKeys.length) {
      const labels = missingKeys.map((key) => fieldByKey?.[key]?.label ?? key);
      setInlineError(`Missing: ${labels.join(', ')}`);
    } else {
      setInlineError('');
    }
  };

  const renderField = (field) => {
    const key = field?.key;
    if (!key) return null;
    const error = fieldErrors?.[key];
    const value = values?.[key];
    const isSelect = field.type === 'singleSelect' || field.type === 'multiSelect';

    return (
      <View key={key} style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>
          {field.label}
          {field.required ? <Text style={styles.requiredMark}> *</Text> : null}
        </Text>

        {isSelect ? (
          <View style={styles.optionsWrap}>
            {(field.options || []).map((option) => {
              const isSelected =
                field.type === 'multiSelect'
                  ? Array.isArray(value) && value.includes(option)
                  : value === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    setValues((prev) => {
                      const existing = prev?.[key];
                      if (field.type === 'multiSelect') {
                        const next = Array.isArray(existing) ? [...existing] : [];
                        const idx = next.indexOf(option);
                        if (idx >= 0) next.splice(idx, 1);
                        else next.push(option);
                        return { ...prev, [key]: next };
                      }
                      return { ...prev, [key]: option };
                    });
                    setFieldErrors((prev) => {
                      if (!prev?.[key]) return prev;
                      const copy = { ...prev };
                      delete copy[key];
                      return copy;
                    });
                    setInlineError('');
                  }}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                  hitSlop={8}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <TextInput
            value={
              typeof value === 'string' ? value : value === undefined ? '' : String(value)
            }
            onChangeText={(text) => {
              setValues((prev) => ({ ...(prev || {}), [key]: text }));
              setFieldErrors((prev) => {
                if (!prev?.[key]) return prev;
                const copy = { ...prev };
                delete copy[key];
                return copy;
              });
              setInlineError('');
            }}
            placeholder={field.placeholder}
            placeholderTextColor="rgba(43,43,43,0.35)"
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            multiline={!!field.multiline}
            style={[styles.input, field.multiline && styles.inputMultiline, !!error && styles.inputError]}
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) return value.join(', ');
    if (value === null || value === undefined) return '—';
    return String(value);
  };

  const renderCard = (card, helpers, index) => {
    const isLast = index === helpers.total - 1;

    const goNext = () => {
      if (isLast) return;
      helpers.goNext?.();
    };

    const onOpenSecondary = () => {
      if (!card?.secondaryAction?.routeName) return;
      navigation?.navigate?.(card.secondaryAction.routeName, card.secondaryAction.params);
    };

    const saveInputsAndContinue = async () => {
      const required = Array.isArray(card?.requiredKeys) ? card.requiredKeys : [];
      const { ok, missingKeys } = validateKeys(required);
      if (!ok) {
        applyMissingErrors(missingKeys);
        return;
      }

      const patch = buildPatchForFields(card?.fields || []);
      await handleSavePartial({ patch });
      goNext();
    };

    const skipForNow = () => {
      goNext();
    };

    const confirmAndComplete = async () => {
      const { ok, missingKeys } = validateKeys(journeyDef?.requiredKeys || []);
      if (!ok) {
        applyMissingErrors(missingKeys);
        const targetIndex = missingKeys
          .map((key) => cardIndexByKey?.[key] ?? cardIndexByKey?.[alternateOutputKey(key)])
          .filter((n) => typeof n === 'number' && n >= 0)
          .sort((a, b) => a - b)[0];
        if (typeof targetIndex === 'number') helpers.goTo?.(targetIndex);
        return;
      }

      const patch = buildPatchForFields(inputFields);
      await handleComplete({ patch });
    };

    const saveWithoutCompleting = async () => {
      const patch = buildPatchForFields(inputFields);
      await handleSavePartial({ patch });
      setInlineError('Saved.');
    };

    return (
      <View style={styles.cardInner}>
        <ScrollView
          style={styles.cardScroll}
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          {card?.kicker ? <Text style={styles.kicker}>{card.kicker}</Text> : null}
          <Text style={styles.cardTitle}>{card?.heading}</Text>
          {card?.body ? <Text style={styles.cardBody}>{card.body}</Text> : null}

          {card?.kind === 'bullets' && Array.isArray(card?.bullets) && card.bullets.length ? (
            <View style={styles.bullets}>
              {card.bullets.map((line) => (
                <View key={line} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {card?.kind === 'inputs' ? (
            <View style={styles.inputsBlock}>
              {(card.fields || []).map(renderField)}
            </View>
          ) : null}

          {card?.kind === 'confirm' && inputFields.length ? (
            <View style={styles.summaryList}>
              {inputFields.map((field) => {
                const raw = values?.[field.key];
                const coerced = coerceValue(raw, field.type);
                if (coerced === undefined) return null;
                return (
                  <Text key={field.key} style={styles.summaryLine}>
                    • {field.label}: {formatValue(coerced)}
                  </Text>
                );
              })}
            </View>
          ) : null}

          {card?.secondaryAction?.routeName ? (
            <Pressable onPress={onOpenSecondary} hitSlop={10} style={styles.quickLinkButton}>
              <Text style={styles.quickLinkText}>{card.secondaryAction.label}</Text>
            </Pressable>
          ) : null}

          {inlineError && (card?.kind === 'inputs' || card?.kind === 'confirm') ? (
            <Text style={styles.inlineError}>{inlineError}</Text>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {card?.kind === 'inputs' ? (
            <View style={styles.footerRow}>
              <CTAButton
                label={card.secondaryCtaLabel || 'Skip for now'}
                variant="secondary"
                onPress={skipForNow}
                style={styles.footerButton}
              />
              <CTAButton
                label={saving ? 'Saving…' : card.primaryCtaLabel || 'Save & continue'}
                onPress={saveInputsAndContinue}
                style={styles.footerButton}
              />
            </View>
          ) : card?.kind === 'confirm' ? (
            card.secondaryCtaLabel && card.secondaryCtaLabel !== 'Back' ? (
              <View style={styles.footerRow}>
                <CTAButton
                  label={card.secondaryCtaLabel}
                  variant="secondary"
                  onPress={saveWithoutCompleting}
                  style={styles.footerButton}
                />
                <CTAButton
                  label={saving ? 'Saving…' : card.primaryCtaLabel || 'Confirm & mark complete'}
                  onPress={confirmAndComplete}
                  style={styles.footerButton}
                />
              </View>
            ) : (
              <CTAButton
                label={saving ? 'Saving…' : card.primaryCtaLabel || 'Confirm & mark complete'}
                onPress={confirmAndComplete}
                style={styles.footerSingle}
              />
            )
          ) : (
            <CTAButton
              label={card.primaryCtaLabel || 'Next'}
              onPress={goNext}
              style={styles.footerSingle}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <JourneyCardCarousel
      key={`${stageId}:${itemId}`}
      title={journeyDef.title}
      subtitle={journeyDef.subtitle}
      cards={cards}
      onClose={handleBackToHub}
      onComplete={handleComplete}
      onSavePartial={handleSavePartial}
      renderCard={renderCard}
    />
  );
}

const styles = StyleSheet.create({
  cardInner: {
    flex: 1,
  },
  cardScroll: {
    flex: 1,
  },
  cardContent: {
    padding: roadmapSpacing.cardPadding,
    paddingBottom: 12,
    flexGrow: 1,
    justifyContent: 'center',
    gap: 12,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.mutedText,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    textAlign: 'center',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
  bullets: {
    marginTop: 6,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    marginTop: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: roadmapColors.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  inputsBlock: {
    marginTop: 6,
  },
  fieldBlock: {
    marginTop: 14,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
    marginBottom: 8,
  },
  requiredMark: {
    color: '#C4554D',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.12)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.textDark,
    backgroundColor: '#FFFFFF',
  },
  inputMultiline: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'rgba(196,85,77,0.6)',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Outfit_400Regular',
    color: '#C4554D',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.15)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  optionChipSelected: {
    backgroundColor: 'rgba(255,155,133,0.10)',
    borderColor: 'rgba(255,155,133,0.35)',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  optionTextSelected: {
    color: roadmapColors.textDark,
  },
  summaryList: {
    marginTop: 16,
    gap: 8,
  },
  summaryLine: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'left',
  },
  inlineError: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Outfit_400Regular',
    color: '#C4554D',
    textAlign: 'center',
  },
  quickLinkButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.14)',
    backgroundColor: 'transparent',
  },
  quickLinkText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  footer: {
    padding: roadmapSpacing.cardPadding,
    paddingTop: 0,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    marginBottom: 0,
  },
  footerSingle: {
    marginBottom: 0,
  },
});
