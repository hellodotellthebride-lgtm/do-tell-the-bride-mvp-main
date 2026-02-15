import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StageScreenContainer from './stage1/StageScreenContainer';
import SoftInfoCard from '../../components/roadmap/SoftInfoCard';
import CTAButton from '../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../components/roadmap/tokens';
import {
  getChecklistItemCopy,
  getRoadmapItemDefinition,
  getStageHubRoute,
} from '../../roadmap/roadmapData';
import { loadRoadmapOutputs, mergeRoadmapOutputs, setAtPath } from '../../roadmap/outputsStorage';
import { loadChecklistState, persistStageChecklist } from '../../roadmap/progressStorage';

const getAtPath = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = String(path || '')
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const coerceValue = (raw, type) => {
  if (type === 'multiSelect') {
    return Array.isArray(raw) && raw.length > 0 ? raw : undefined;
  }

  const text = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
  if (!text) return undefined;

  if (type === 'number') {
    const numeric = Number(text.replace(/,/g, ''));
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  return text;
};

const formatValue = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '—';
  return String(value);
};

export default function RoadmapCardFlowScreen({ navigation, route }) {
  const stageId = route?.params?.stageId;
  const itemId = route?.params?.itemId;

  const stageHubRoute = useMemo(
    () => (stageId ? getStageHubRoute(stageId) : 'WeddingRoadmap'),
    [stageId],
  );

  const checklistCopy = useMemo(
    () => (stageId && itemId ? getChecklistItemCopy(stageId, itemId) : { label: '', description: '' }),
    [stageId, itemId],
  );

  const definition = useMemo(() => {
    if (!stageId || !itemId) return null;
    return getRoadmapItemDefinition(stageId, itemId);
  }, [stageId, itemId]);

  const learnCards = useMemo(() => {
    const cards = definition?.cards;
    if (Array.isArray(cards) && cards.length > 0) return cards;
    return [
      {
        title: 'Coming soon',
        body: 'This step is not configured yet — you can still mark it complete if it feels done.',
      },
    ];
  }, [definition]);

  const inputs = definition?.inputs;
  const hasInputs = !!inputs?.fields?.length;
  const steps = useMemo(
    () => ['learn', ...(hasInputs ? ['inputs'] : []), 'confirm'],
    [hasInputs],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setCardIndex(0);
    setFormValues(() => {
      if (stageId === 'stage-1' && itemId === 'agree-rough-budget') {
        return { 'roadmapOutputs.budget.currency': 'USD' };
      }
      return {};
    });
    setHydrated(false);
  }, [stageId, itemId]);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        if (!inputs?.fields?.length) return;
        const outputs = await loadRoadmapOutputs();
        if (!mounted) return;

        const next = {};
        inputs.fields.forEach((field) => {
          const existing = getAtPath(outputs, field.key);
          if (existing === null || existing === undefined) return;
          if (field.type === 'multiSelect' && Array.isArray(existing)) {
            next[field.key] = existing;
            return;
          }
          next[field.key] = String(existing);
        });
        setFormValues((prev) => ({ ...prev, ...next }));
      } catch (error) {
        console.warn('[RoadmapCardFlow] unable to hydrate outputs', error);
      } finally {
        if (mounted) setHydrated(true);
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, [inputs]);

  const handleBackToHub = useCallback(() => {
    navigation?.navigate?.(stageHubRoute);
  }, [navigation, stageHubRoute]);

  const title = definition?.title || checklistCopy?.label || 'Card flow';
  const subtitle = definition?.subtitle || checklistCopy?.description || 'A short guided step.';

  const totalSteps = steps.length;
  const stepKey = steps[stepIndex] || 'learn';
  const stepLabel = `Step ${Math.min(stepIndex + 1, totalSteps)} of ${totalSteps}`;

  const validateRequired = useCallback(() => {
    const required = Array.isArray(inputs?.requiredKeys) ? inputs.requiredKeys : [];
    if (required.length === 0) return { ok: true, missing: [] };

    const missing = [];
    required.forEach((key) => {
      const field = inputs?.fields?.find((f) => f.key === key);
      const value = coerceValue(formValues[key], field?.type);
      if (value === undefined) {
        missing.push(field?.label || key);
      }
    });

    return { ok: missing.length === 0, missing };
  }, [inputs, formValues]);

  const buildOutputsPatch = useCallback(() => {
    const patch = {};
    (inputs?.fields || []).forEach((field) => {
      const value = coerceValue(formValues[field.key], field.type);
      if (value === undefined) return;
      setAtPath(patch, field.key, value);
    });
    return patch;
  }, [inputs, formValues]);

  const handleConfirm = useCallback(async () => {
    if (saving) return;
    if (!stageId || !itemId) {
      Alert.alert('Something went wrong', 'Missing stage or item.');
      return;
    }

    if (hasInputs) {
      const { ok, missing } = validateRequired();
      if (!ok) {
        Alert.alert('Almost there', `Please complete: ${missing.join(', ')}`);
        const inputsIndex = steps.indexOf('inputs');
        if (inputsIndex >= 0) setStepIndex(inputsIndex);
        return;
      }
    }

    setSaving(true);
    try {
      if (hasInputs) {
        const patch = buildOutputsPatch();
        await mergeRoadmapOutputs(patch);
      }

      const checklistState = await loadChecklistState();
      const stageMap = checklistState?.[stageId] ?? {};
      const nextStageMap = { ...stageMap, [itemId]: true };
      await persistStageChecklist(stageId, nextStageMap);

      navigation?.navigate?.(stageHubRoute);
    } catch (error) {
      console.warn('[RoadmapCardFlow] unable to confirm', error);
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [
    saving,
    stageId,
    itemId,
    hasInputs,
    validateRequired,
    steps,
    buildOutputsPatch,
    navigation,
    stageHubRoute,
  ]);

  const renderLearn = () => {
    const card = learnCards[cardIndex] || learnCards[0];
    const eyebrow = `${stepLabel} • Card ${Math.min(cardIndex + 1, learnCards.length)} of ${learnCards.length}`;

    return (
      <>
        <SoftInfoCard eyebrow={eyebrow} title={card?.title} body={card?.body} />
        <View style={styles.navRow}>
          <CTAButton
            label="Back"
            variant="secondary"
            onPress={() => {
              if (cardIndex > 0) {
                setCardIndex((prev) => Math.max(0, prev - 1));
                return;
              }
              handleBackToHub();
            }}
          />
          <CTAButton
            label={cardIndex < learnCards.length - 1 ? 'Next' : hasInputs ? 'Continue' : 'Continue'}
            onPress={() => {
              if (cardIndex < learnCards.length - 1) {
                setCardIndex((prev) => Math.min(learnCards.length - 1, prev + 1));
                return;
              }
              setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
            }}
            style={styles.primaryButton}
          />
        </View>
      </>
    );
  };

  const renderInputs = () => {
    const eyebrow = `${stepLabel} • Inputs`;

    return (
      <>
        <SoftInfoCard eyebrow={eyebrow} title="Add what you know" body="Approximate is fine — you can refine later.">
          {!hydrated ? <Text style={styles.helperText}>Loading…</Text> : null}
          {(inputs?.fields || []).map((field) => {
            const value = formValues[field.key];
            return (
              <View key={field.key} style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>{field.label}</Text>

                {field.type === 'singleSelect' || field.type === 'multiSelect' ? (
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
                            setFormValues((prev) => {
                              if (field.type === 'multiSelect') {
                                const current = Array.isArray(prev[field.key]) ? prev[field.key] : [];
                                const next = current.includes(option)
                                  ? current.filter((x) => x !== option)
                                  : [...current, option];
                                return { ...prev, [field.key]: next };
                              }
                              return { ...prev, [field.key]: isSelected ? '' : option };
                            });
                          }}
                          style={[styles.optionChip, isSelected && styles.optionChipSelected]}
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
                    value={typeof value === 'string' ? value : value === undefined ? '' : String(value)}
                    onChangeText={(text) => setFormValues((prev) => ({ ...prev, [field.key]: text }))}
                    placeholder={field.placeholder}
                    placeholderTextColor="rgba(43,43,43,0.35)"
                    keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                    style={styles.input}
                  />
                )}
              </View>
            );
          })}
        </SoftInfoCard>

        <View style={styles.navRow}>
          <CTAButton label="Back" variant="secondary" onPress={() => setStepIndex((prev) => Math.max(0, prev - 1))} />
          <CTAButton
            label="Next"
            onPress={() => {
              const { ok, missing } = validateRequired();
              if (!ok) {
                Alert.alert('Almost there', `Please complete: ${missing.join(', ')}`);
                return;
              }
              setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
            }}
            style={styles.primaryButton}
          />
        </View>
      </>
    );
  };

  const renderConfirm = () => {
    const eyebrow = `${stepLabel} • Confirm`;
    const filled = (inputs?.fields || []).flatMap((field) => {
      const value = coerceValue(formValues[field.key], field.type);
      if (value === undefined) return [];
      return [{ label: field.label, value }];
    });

    return (
      <>
        <SoftInfoCard
          eyebrow={eyebrow}
          title="Confirm & mark complete"
          body={
            hasInputs
              ? 'If this looks right, we’ll save it and mark this checklist item complete.'
              : 'If this feels clear enough, you can mark this checklist item complete.'
          }
        >
          {hasInputs ? (
            <View style={styles.summaryList}>
              {filled.length > 0 ? (
                filled.map((row) => (
                  <Text key={row.label} style={styles.summaryLine}>
                    • {row.label}: {formatValue(row.value)}
                  </Text>
                ))
              ) : (
                <Text style={styles.helperText}>No values added yet.</Text>
              )}
            </View>
          ) : null}

          {Array.isArray(definition?.deepLinks) && definition.deepLinks.length > 0 ? (
            <View style={styles.deepLinkRow}>
              {definition.deepLinks.map((link) => (
                <CTAButton
                  key={link.label}
                  label={link.label}
                  variant="secondary"
                  onPress={() => {
                    if (!link?.routeName) return;
                    navigation?.navigate?.(link.routeName, link.params);
                  }}
                />
              ))}
            </View>
          ) : null}
        </SoftInfoCard>

        <View style={styles.navRow}>
          <CTAButton label="Back" variant="secondary" onPress={() => setStepIndex((prev) => Math.max(0, prev - 1))} />
          <CTAButton
            label={saving ? 'Saving…' : 'Confirm & mark complete'}
            onPress={handleConfirm}
            style={[styles.primaryButton, saving && styles.buttonDisabled]}
          />
        </View>
      </>
    );
  };

  return (
    <StageScreenContainer backLabel="Back" onBackPress={handleBackToHub} title={title} subtitle={subtitle}>
      {stepKey === 'learn' ? renderLearn() : null}
      {stepKey === 'inputs' ? renderInputs() : null}
      {stepKey === 'confirm' ? renderConfirm() : null}
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  navRow: {
    marginTop: 4,
  },
  primaryButton: {
    marginTop: 0,
  },
  helperText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
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
    backgroundColor: roadmapColors.card,
    borderColor: 'rgba(255,155,133,0.65)',
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
    marginTop: roadmapSpacing.sectionGap,
    gap: 8,
  },
  summaryLine: {
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  deepLinkRow: {
    marginTop: roadmapSpacing.sectionGap,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
});
