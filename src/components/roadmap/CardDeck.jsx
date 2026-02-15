import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import CTAButton from './CTAButton';
import DotsIndicator from './DotsIndicator';
import { roadmapColors } from './tokens';
import { setAtPath } from '../../roadmap/outputsStorage';
import { colors } from '../../theme';

const BACK_ICON_COLOR = roadmapColors.mutedText;
const DECK_BACKGROUND = roadmapColors.background;
const CARD_RADIUS = 24;

const coerceValue = (raw, keyboardType) => {
  const text = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
  if (!text) return undefined;
  if (keyboardType === 'numeric') {
    const numeric = Number(text.replace(/,/g, ''));
    return Number.isFinite(numeric) ? numeric : undefined;
  }
  return text;
};

const getAtPath = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = String(path || '')
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const normalizeMeta = (meta, index, total) => {
  const trimmed = typeof meta === 'string' ? meta.trim() : '';
  if (trimmed) return trimmed;
  return `CARD ${index + 1} OF ${total}`;
};

export default function CardDeck({
  title,
  subtitle,
  cards = [],
  initialValues,
  onBack,
  onSavePatch,
  onConfirmComplete,
  onOpenRoute,
}) {
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const safeCards = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const totalCards = safeCards.length;

  const cardWidth = useMemo(() => Math.round(screenWidth * 0.84), [screenWidth]);
  const gap = 16;
  const snapInterval = cardWidth + gap;
  const sidePadding = useMemo(
    () => Math.max(0, Math.round((screenWidth - cardWidth) / 2)),
    [screenWidth, cardWidth],
  );

  const [containerHeight, setContainerHeight] = useState(0);
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0);
  const [measuredDotsHeight, setMeasuredDotsHeight] = useState(0);

  const cardHeight = useMemo(() => {
    const HEADER_FALLBACK = 190;
    const DOTS_FALLBACK = 24;
    const SPACING = 16;

    const viewportHeight =
      containerHeight ||
      Math.max(0, screenHeight - tabBarHeight - insets.top - insets.bottom);

    const headerHeight = measuredHeaderHeight || HEADER_FALLBACK;
    const dotsHeight = measuredDotsHeight || DOTS_FALLBACK;

    const availableForDeck = Math.max(0, viewportHeight - headerHeight);
    const availableForCard = Math.max(0, availableForDeck - dotsHeight - SPACING);

    const ideal = Math.min(640, Math.max(360, Math.round(screenHeight * 0.62)));
    return Math.max(0, Math.min(ideal, availableForCard));
  }, [
    containerHeight,
    insets.bottom,
    insets.top,
    measuredDotsHeight,
    measuredHeaderHeight,
    screenHeight,
    tabBarHeight,
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [inlineError, setInlineError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setInlineError('');
    setBusy(false);
    setInputValues((prev) => ({ ...(prev || {}), ...(initialValues || {}) }));
  }, [title, subtitle, initialValues]);

  const scrollToIndex = useCallback(
    (index, animated = true) => {
      const next = Math.max(0, Math.min(totalCards - 1, index));
      listRef.current?.scrollToOffset?.({ offset: next * snapInterval, animated });
      setActiveIndex(next);
      setInlineError('');
    },
    [snapInterval, totalCards],
  );

  const goNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);
  const goPrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);

  const handleHeaderBack = useCallback(() => {
    if (activeIndex > 0) {
      goPrev();
      return;
    }
    onBack?.();
  }, [activeIndex, goPrev, onBack]);

  const allWriteKeys = useMemo(() => {
    const keys = [];
    safeCards.forEach((card) => {
      if (card?.kind !== 'inputs') return;
      (card?.inputs || []).forEach((field) => {
        if (field?.writeKey) keys.push(field.writeKey);
      });
    });
    return keys;
  }, [safeCards]);

  const buildPatchFromKeys = useCallback(
    (keys) => {
      const patch = {};
      const safeKeys = Array.isArray(keys) ? keys : [];
      safeKeys.forEach((key) => {
        const fieldValue = inputValues?.[key];
        const keyboardType =
          safeCards
            .flatMap((card) => (card?.kind === 'inputs' ? card.inputs : []))
            .find((f) => f?.writeKey === key)?.keyboardType ?? 'default';
        const coerced = coerceValue(fieldValue, keyboardType);
        if (coerced === undefined) return;
        setAtPath(patch, key, coerced);
      });
      return patch;
    },
    [inputValues, safeCards],
  );

  const handleSaveAndContinue = useCallback(
    async (card) => {
      if (busy) return;
      setInlineError('');
      const writeKeys = (card?.inputs || [])
        .map((i) => i?.writeKey)
        .filter(Boolean);
      const patch = buildPatchFromKeys(writeKeys);
      setBusy(true);
      try {
        if (patch && Object.keys(patch).length > 0) {
          await onSavePatch?.(patch);
        }
        goNext();
      } catch (error) {
        console.warn('[CardDeck] save failed', error);
        setInlineError('Something went wrong while saving. Please try again.');
      } finally {
        setBusy(false);
      }
    },
    [busy, buildPatchFromKeys, goNext, onSavePatch],
  );

  const handleConfirm = useCallback(async () => {
    if (busy) return;
    setInlineError('');
    const patch = buildPatchFromKeys(allWriteKeys);
    setBusy(true);
    try {
      const result = await onConfirmComplete?.(patch);
      if (result?.ok === false) {
        setInlineError(result?.message || 'Missing required information.');
      }
    } catch (error) {
      console.warn('[CardDeck] confirm failed', error);
      setInlineError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [allWriteKeys, buildPatchFromKeys, busy, onConfirmComplete]);

  const handleOpenRoute = useCallback(
    (routeName) => {
      if (!routeName) return;
      onOpenRoute?.(routeName);
    },
    [onOpenRoute],
  );

  const renderCardInner = (card, index) => {
    const metaText = normalizeMeta(card?.meta, index, totalCards);

    if (card?.kind === 'inputs') {
      return (
        <View style={styles.cardInner}>
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.meta}>{metaText}</Text>
            <Text style={styles.cardTitle}>{card?.title}</Text>
            {card?.body ? <Text style={styles.cardBody}>{card.body}</Text> : null}

            <View style={styles.inputsWrap}>
              {(card?.inputs || []).map((field) => {
                const key = field?.writeKey || field?.id;
                const value = field?.writeKey ? inputValues?.[field.writeKey] : undefined;
                return (
                  <View key={String(key)} style={styles.fieldBlock}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <TextInput
                      value={
                        typeof value === 'string'
                          ? value
                          : value === undefined
                            ? ''
                            : String(value)
                      }
                      onChangeText={(text) => {
                        if (!field?.writeKey) return;
                        setInputValues((prev) => ({ ...(prev || {}), [field.writeKey]: text }));
                      }}
                      placeholder={field.placeholder}
                      placeholderTextColor="rgba(43,43,43,0.35)"
                      keyboardType={field.keyboardType || 'default'}
                      style={styles.input}
                    />
                  </View>
                );
              })}
            </View>

            {inlineError ? <Text style={styles.inlineError}>{inlineError}</Text> : null}
          </ScrollView>

          <View style={styles.buttonRow}>
            {card?.secondaryCta?.action === 'skipForNow' ? (
              <CTAButton
                label={card.secondaryCta.label}
                variant="secondary"
                onPress={goNext}
                style={styles.button}
              />
            ) : null}
            <CTAButton
              label={busy ? 'Saving…' : card?.primaryCta?.label || 'Save & continue'}
              onPress={() => handleSaveAndContinue(card)}
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    if (card?.kind === 'action') {
      const primary = card?.primaryCta;
      const secondary = card?.secondaryCta;

      const onPrimary = () => {
        if (!primary) return;
        if (primary.action === 'goBackCard') {
          goPrev();
          return;
        }
        if (primary.action === 'openRoute') {
          handleOpenRoute(card?.route);
          return;
        }
        if (primary.action === 'confirmAndComplete') {
          handleConfirm();
        }
      };

      const onSecondary = () => {
        if (!secondary) return;
        if (secondary.action === 'goBackCard') {
          goPrev();
          return;
        }
        if (secondary.action === 'openRoute') {
          handleOpenRoute(card?.route);
        }
      };

      return (
        <View style={styles.cardInner}>
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.meta}>{metaText}</Text>
            <Text style={styles.cardTitle}>{card?.title}</Text>
            {card?.body ? <Text style={styles.cardBody}>{card.body}</Text> : null}

            {inlineError ? <Text style={styles.inlineError}>{inlineError}</Text> : null}
          </ScrollView>

          <View style={styles.buttonRow}>
            {secondary ? (
              <CTAButton
                label={secondary.label}
                variant="secondary"
                onPress={onSecondary}
                style={styles.button}
              />
            ) : null}
            <CTAButton
              label={busy ? 'Working…' : primary?.label || 'Continue'}
              onPress={onPrimary}
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    // info
    return (
      <View style={styles.cardInner}>
        <ScrollView
          style={styles.cardScroll}
          contentContainerStyle={styles.cardScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.meta}>{metaText}</Text>
          <Text style={styles.cardTitle}>{card?.title}</Text>
          {card?.body ? <Text style={styles.cardBody}>{card.body}</Text> : null}
          {Array.isArray(card?.bullets) && card.bullets.length ? (
            <View style={styles.bullets}>
              {card.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.buttonRow}>
          {index > 0 ? (
            <CTAButton
              label="Back"
              variant="secondary"
              onPress={goPrev}
              style={styles.button}
            />
          ) : null}
          <CTAButton
            label={index === totalCards - 1 ? 'Done' : 'Next'}
            onPress={() => {
              if (index === totalCards - 1) {
                onBack?.();
                return;
              }
              goNext();
            }}
            style={styles.button}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={styles.screen}
      onLayout={(event) => {
        const next = event?.nativeEvent?.layout?.height ?? 0;
        if (!next || next === containerHeight) return;
        setContainerHeight(next);
      }}
    >
      <View
        style={styles.header}
        onLayout={(event) => {
          const next = event?.nativeEvent?.layout?.height ?? 0;
          if (!next || next === measuredHeaderHeight) return;
          setMeasuredHeaderHeight(next);
        }}
      >
        <Pressable onPress={handleHeaderBack} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={BACK_ICON_COLOR} />
        </Pressable>
        <Text style={styles.headerTitle}>{title || 'Checklist'}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}

        <View style={styles.headerDivider}>
          <View style={styles.headerDividerLine} />
          <View style={styles.headerDividerDot} />
        </View>
      </View>

      <View style={styles.deckArea}>
        <Animated.FlatList
          ref={listRef}
          horizontal
          data={safeCards}
          keyExtractor={(item, idx) => String(item?.id ?? idx)}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={snapInterval}
          snapToAlignment="start"
          contentContainerStyle={[styles.deckContent, { paddingHorizontal: sidePadding }]}
          ItemSeparatorComponent={() => <View style={{ width: gap }} />}
          onMomentumScrollEnd={(event) => {
            const offsetX = event?.nativeEvent?.contentOffset?.x ?? 0;
            const idx = Math.round(offsetX / snapInterval);
            setActiveIndex(Math.max(0, Math.min(totalCards - 1, idx)));
            setInlineError('');
          }}
          getItemLayout={(_, index) => ({
            length: snapInterval,
            offset: snapInterval * index,
            index,
          })}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * snapInterval,
              index * snapInterval,
              (index + 1) * snapInterval,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.94, 1, 0.94],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.86, 1, 0.86],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                style={[
                  styles.cardWrap,
                  {
                    width: cardWidth,
                    height: cardHeight,
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <View style={styles.card}>
                  {renderCardInner(item, index)}
                </View>
              </Animated.View>
            );
          }}
        />

        <View
          onLayout={(event) => {
            const next = event?.nativeEvent?.layout?.height ?? 0;
            if (!next || next === measuredDotsHeight) return;
            setMeasuredDotsHeight(next);
          }}
        >
          <DotsIndicator count={totalCards} index={activeIndex} style={styles.dots} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DECK_BACKGROUND,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  headerDivider: {
    marginTop: 16,
    height: 16,
    justifyContent: 'center',
  },
  headerDividerLine: {
    height: 1,
    backgroundColor: 'rgba(43,43,43,0.12)',
  },
  headerDividerDot: {
    position: 'absolute',
    alignSelf: 'center',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: roadmapColors.accent,
  },
  deckArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 12,
  },
  deckContent: {
    alignItems: 'center',
  },
  cardWrap: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: roadmapColors.surface,
    borderRadius: CARD_RADIUS,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    paddingBottom: 14,
  },
  meta: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: 'Outfit_500Medium',
    color: 'rgba(43,43,43,0.45)',
    textAlign: 'center',
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    textAlign: 'center',
  },
  cardBody: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
  bullets: {
    marginTop: 14,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: roadmapColors.accent,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  inputsWrap: {
    marginTop: 14,
    gap: 14,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.12)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.textDark,
    backgroundColor: roadmapColors.surface,
  },
  inlineError: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Outfit_400Regular',
    color: colors.danger,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  button: {
    flex: 1,
    marginBottom: 0,
  },
  dots: {
    marginTop: 10,
  },
});
