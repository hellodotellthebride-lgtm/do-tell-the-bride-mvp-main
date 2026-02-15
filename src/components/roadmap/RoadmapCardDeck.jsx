import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CardCarousel from './CardCarousel';
import CTAButton from './CTAButton';
import { roadmapColors, roadmapRadius, roadmapSpacing } from './tokens';
import { setAtPath } from '../../roadmap/outputsStorage';

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

const formatValue = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '—';
  return String(value);
};

const collectInputFields = (cards) => {
  const safe = Array.isArray(cards) ? cards : [];
  const fields = [];
  safe.forEach((card) => {
    if (card?.type !== 'inputs') return;
    (card?.fields || []).forEach((f) => fields.push(f));
  });
  return fields;
};

const collectRequiredKeys = (cards) => {
  const safe = Array.isArray(cards) ? cards : [];
  const required = new Set();
  safe.forEach((card) => {
    if (card?.type !== 'inputs') return;
    (card?.requiredKeys || []).forEach((key) => required.add(key));
  });
  return Array.from(required);
};

const buildKeyIndex = (cards) => {
  const safe = Array.isArray(cards) ? cards : [];
  const fieldByKey = {};
  const cardIndexByKey = {};
  safe.forEach((card, idx) => {
    if (card?.type !== 'inputs') return;
    (card?.fields || []).forEach((field) => {
      if (!field?.key) return;
      fieldByKey[field.key] = field;
      cardIndexByKey[field.key] = idx;
    });
  });
  return { fieldByKey, cardIndexByKey };
};

const normalizeOutputKey = (key) => {
  const raw = String(key || '').trim();
  if (raw.startsWith('roadmapOutputs.')) return raw.slice('roadmapOutputs.'.length);
  return raw;
};

/**
 * RoadmapCardDeck
 *
 * Card model:
 * - info:    { id, type:'info', heading, body }
 * - bullets: { id, type:'bullets', heading, body?, bullets[] }
 * - inputs:  { id, type:'inputs', heading, helper?, fields[], requiredKeys? }
 * - cta:     { id, type:'cta', heading, body?, primaryLabel, secondaryLabel? }
 */
export default function RoadmapCardDeck({
  title,
  subtitle,
  cards = [],
  initialValues,
  primaryLoading,
  onComplete,
  onSavePartial,
  onBack,
}) {
  const carouselController = useRef(null);
  const { height: screenHeight } = useWindowDimensions();
  const cardHeight = Math.min(580, Math.max(420, Math.round(screenHeight * 0.62)));

  const safeCards = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const inputFields = useMemo(() => collectInputFields(safeCards), [safeCards]);
  const requiredKeys = useMemo(() => collectRequiredKeys(safeCards), [safeCards]);
  const { fieldByKey, cardIndexByKey } = useMemo(() => buildKeyIndex(safeCards), [safeCards]);

  const [values, setValues] = useState(() =>
    initialValues && typeof initialValues === 'object' ? initialValues : {},
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialValues || typeof initialValues !== 'object') return;
    setValues((prev) => {
      const next = { ...(prev || {}) };
      Object.keys(initialValues).forEach((key) => {
        const existing = next[key];
        const shouldSet =
          existing === undefined ||
          existing === null ||
          existing === '' ||
          (Array.isArray(existing) && existing.length === 0);
        if (shouldSet) next[key] = initialValues[key];
      });
      return next;
    });
  }, [initialValues]);

  const setValue = (key, nextValue) => {
    setValues((prev) => ({ ...prev, [key]: nextValue }));
    setErrors((prev) => {
      if (!prev?.[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const buildPatchFromValues = useMemo(() => {
    return () => {
      const patch = {};
      inputFields.forEach((field) => {
        const value = coerceValue(values[field.key], field.type);
        if (value === undefined) return;
        setAtPath(patch, normalizeOutputKey(field.key), value);
      });
      return patch;
    };
  }, [inputFields, values]);

  const validateKeys = (keys) => {
    const required = Array.isArray(keys) ? keys : [];
    if (required.length === 0) return { ok: true, missingKeys: [] };

    const missingKeys = [];
    required.forEach((key) => {
      const field = fieldByKey?.[key];
      const value = coerceValue(values[key], field?.type);
      if (value === undefined) missingKeys.push(key);
    });
    return { ok: missingKeys.length === 0, missingKeys };
  };

  const applyMissingErrors = (missingKeys) => {
    if (!missingKeys?.length) return;
    setErrors((prev) => {
      const next = { ...(prev || {}) };
      missingKeys.forEach((key) => {
        const label = fieldByKey?.[key]?.label || 'This field';
        next[key] = `${label} is required.`;
      });
      return next;
    });
  };

  const renderField = (field) => {
    const value = values[field.key];
    const error = errors?.[field.key];
    const isSelect = field.type === 'singleSelect' || field.type === 'multiSelect';

    return (
      <View key={field.key} style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{field.label}</Text>

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
                      const existing = prev?.[field.key];
                      if (field.type === 'multiSelect') {
                        const next = Array.isArray(existing) ? [...existing] : [];
                        const idx = next.indexOf(option);
                        if (idx >= 0) {
                          next.splice(idx, 1);
                        } else {
                          next.push(option);
                        }
                        return { ...prev, [field.key]: next };
                      }
                      return { ...prev, [field.key]: option };
                    });
                    setErrors((prev) => {
                      if (!prev?.[field.key]) return prev;
                      const copy = { ...prev };
                      delete copy[field.key];
                      return copy;
                    });
                  }}
                  style={[
                    styles.optionChip,
                    isSelected && styles.optionChipSelected,
                  ]}
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
              typeof value === 'string'
                ? value
                : value === undefined
                  ? ''
                  : String(value)
            }
            onChangeText={(text) => setValue(field.key, text)}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            const idx = carouselController.current?.getIndex?.() ?? 0;
            if (idx > 0) {
              carouselController.current?.goPrev?.();
              return;
            }
            onBack?.();
          }}
          hitSlop={10}
          style={styles.backRow}
        >
          <Ionicons name="chevron-back" size={18} color="#6F5B55" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{title || 'Journey'}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.carouselArea}>
        <CardCarousel
          data={safeCards}
          controllerRef={carouselController}
          renderCard={({ item, index, goNext, goPrev, goTo }) => {
            const isFirst = index === 0;
            const isLast = index === safeCards.length - 1;
            const nextLabel = item?.nextLabel || (item?.type === 'inputs' ? 'Save & continue' : 'Next');

            const handleBack = () => {
              if (isFirst) {
                onBack?.();
                return;
              }
              goPrev();
            };

            const handleNext = () => {
              if (item?.type === 'inputs') {
                const { ok, missingKeys } = validateKeys(item?.requiredKeys);
                if (!ok) {
                  applyMissingErrors(missingKeys);
                  return;
                }
              }
              if (isLast) return;
              goNext();
            };

            const handleSavePartial = async () => {
              const patch = buildPatchFromValues();
              await onSavePartial?.({ patch, values });
            };

            const handleComplete = async () => {
              const { ok, missingKeys } = validateKeys(requiredKeys);
              if (!ok) {
                applyMissingErrors(missingKeys);
                const targetIndex = missingKeys
                  .map((key) => cardIndexByKey?.[key])
                  .filter((n) => typeof n === 'number' && n >= 0)
                  .sort((a, b) => a - b)[0];
                if (typeof targetIndex === 'number') goTo(targetIndex);
                return;
              }
              const patch = buildPatchFromValues();
              await onComplete?.({ patch, values });
            };

            return (
              <View style={[styles.card, { height: cardHeight }]}>
                <ScrollView
                  style={styles.cardScroll}
                  contentContainerStyle={styles.cardContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.cardTitle}>{item?.heading}</Text>

                  {item?.body ? <Text style={styles.cardBody}>{item.body}</Text> : null}

                  {item?.type === 'bullets' && Array.isArray(item?.bullets) && item.bullets.length ? (
                    <View style={styles.bullets}>
                      {item.bullets.map((line) => (
                        <Text key={line} style={styles.bulletText}>
                          • {line}
                        </Text>
                      ))}
                    </View>
                  ) : null}

                  {item?.type === 'inputs' ? (
                    <View style={styles.inputsBlock}>
                      {item?.helper ? <Text style={styles.helperText}>{item.helper}</Text> : null}
                      {(item?.fields || []).map(renderField)}
                    </View>
                  ) : null}

                  {item?.type === 'cta' && inputFields.length ? (
                    <View style={styles.summaryList}>
                      {inputFields.map((field) => {
                        const value = coerceValue(values[field.key], field.type);
                        if (value === undefined) return null;
                        return (
                          <Text key={field.key} style={styles.summaryLine}>
                            • {field.label}: {formatValue(value)}
                          </Text>
                        );
                      })}
                    </View>
                  ) : null}

                  {item?.linkLabel && typeof item?.onLinkPress === 'function' ? (
                    <Pressable
                      onPress={item.onLinkPress}
                      style={styles.quickLinkButton}
                      hitSlop={10}
                    >
                      <Text style={styles.quickLinkText}>{item.linkLabel}</Text>
                    </Pressable>
                  ) : null}
                </ScrollView>

                <View style={styles.footerRow}>
                  <Pressable onPress={handleBack} hitSlop={10} style={styles.footerBack}>
                    <Text style={styles.footerBackText}>Back</Text>
                  </Pressable>

                  {item?.type === 'cta' ? (
                    <View style={styles.ctaStack}>
                      <CTAButton
                        label={primaryLoading ? 'Saving…' : item?.primaryLabel || 'Save & mark complete'}
                        onPress={handleComplete}
                        style={[styles.footerButton, primaryLoading && styles.buttonDisabled]}
                      />
                      {item?.secondaryLabel && typeof onSavePartial === 'function' ? (
                        <Pressable onPress={handleSavePartial} hitSlop={10} style={styles.secondaryLink}>
                          <Text style={styles.secondaryLinkText}>{item.secondaryLabel}</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : (
                    <CTAButton
                      label={nextLabel}
                      variant="secondary"
                      onPress={handleNext}
                      style={styles.footerButton}
                    />
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: roadmapColors.background,
  },
  header: {
    paddingHorizontal: roadmapSpacing.pageGutter,
    paddingTop: 12,
    paddingBottom: 10,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 4,
    color: '#6F5B55',
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontSize: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  carouselArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: roadmapRadius,
    shadowColor: roadmapColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 1,
    overflow: 'hidden',
  },
  cardScroll: {
    flex: 1,
  },
  cardContent: {
    padding: roadmapSpacing.cardPadding,
    gap: 12,
    flexGrow: 1,
    justifyContent: 'center',
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
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'center',
  },
  bullets: {
    gap: 8,
    marginTop: 4,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'left',
  },
  inputsBlock: {
    marginTop: 6,
  },
  helperText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
    marginBottom: 6,
    textAlign: 'center',
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
    marginTop: roadmapSpacing.sectionGap,
    gap: 8,
  },
  summaryLine: {
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'left',
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: roadmapSpacing.cardPadding,
    paddingTop: 0,
  },
  footerBack: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  footerBackText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: '#6F5B55',
  },
  footerButton: {
    flex: 1,
    marginBottom: 0,
  },
  ctaStack: {
    flex: 1,
    alignItems: 'stretch',
  },
  secondaryLink: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  secondaryLinkText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.78,
  },
});
