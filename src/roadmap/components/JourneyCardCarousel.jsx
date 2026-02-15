import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DotsIndicator from '../../components/roadmap/DotsIndicator';
import { roadmapColors } from '../../components/roadmap/tokens';

const WARM_BACKGROUND = roadmapColors.background;

export default function JourneyCardCarousel({
  title,
  subtitle,
  cards = [],
  initialIndex = 0,
  onClose,
  onComplete,
  onSavePartial,
  renderCard,
}) {
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const safeCards = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const total = safeCards.length;

  const cardWidth = useMemo(() => Math.round(screenWidth * 0.88), [screenWidth]);
  const gap = 16;
  const snapInterval = useMemo(() => cardWidth + gap, [cardWidth]);
  const sidePadding = useMemo(
    () => Math.max(0, Math.round((screenWidth - cardWidth) / 2)),
    [screenWidth, cardWidth],
  );

  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, Math.min(total - 1, Number(initialIndex) || 0)),
  );
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setActiveIndex(Math.max(0, Math.min(total - 1, Number(initialIndex) || 0)));
  }, [initialIndex, total]);

  useEffect(() => {
    if (!total) return;
    const next = Math.max(0, Math.min(total - 1, Number(initialIndex) || 0));
    // Keep the visual position in sync with `initialIndex` changes.
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset?.({ offset: next * snapInterval, animated: false });
    });
  }, [initialIndex, snapInterval, total]);

  const cardHeight = useMemo(() => {
    const estimatedHeader = headerHeight || 190;
    const available = screenHeight - estimatedHeader - insets.top - insets.bottom;
    const reservedBelow = 56; // dots + breathing room
    const max = available - reservedBelow;
    return Math.min(640, Math.max(360, Math.round(max)));
  }, [screenHeight, headerHeight, insets.top, insets.bottom]);

  const scrollToIndex = useCallback(
    (index, animated = true) => {
      const next = Math.max(0, Math.min(total - 1, index));
      listRef.current?.scrollToOffset?.({ offset: next * snapInterval, animated });
      setActiveIndex(next);
    },
    [snapInterval, total],
  );

  const goNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);
  const goPrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);
  const goTo = useCallback((index) => scrollToIndex(index), [scrollToIndex]);

  const helpers = useMemo(
    () => ({
      activeIndex,
      total,
      cardHeight,
      cardWidth,
      goNext,
      goPrev,
      goTo,
      onComplete,
      onSavePartial,
      onClose,
    }),
    [
      activeIndex,
      total,
      cardHeight,
      cardWidth,
      goNext,
      goPrev,
      goTo,
      onComplete,
      onSavePartial,
      onClose,
    ],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[styles.header, { paddingTop: 12 }]}
        onLayout={(event) => setHeaderHeight(event?.nativeEvent?.layout?.height ?? 0)}
      >
        <Pressable
          onPress={() => {
            if (activeIndex > 0) {
              goPrev();
              return;
            }
            onClose?.();
          }}
          hitSlop={10}
          style={styles.backRow}
        >
          <Ionicons name="chevron-back" size={20} color={roadmapColors.mutedText} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>{title || 'Journey'}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>
      </View>

      <View style={styles.deckArea}>
        <View style={{ height: cardHeight, justifyContent: 'center' }}>
          <FlatList
            ref={listRef}
            horizontal
            data={safeCards}
            keyExtractor={(item, index) => String(item?.id ?? index)}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={snapInterval}
            snapToAlignment="start"
            contentContainerStyle={[styles.deckContent, { paddingHorizontal: sidePadding }]}
            ItemSeparatorComponent={() => <View style={{ width: gap }} />}
            onMomentumScrollEnd={(event) => {
              const offsetX = event?.nativeEvent?.contentOffset?.x ?? 0;
              const idx = Math.round(offsetX / snapInterval);
              setActiveIndex(Math.max(0, Math.min(total - 1, idx)));
            }}
            getItemLayout={(_, index) => ({
              length: snapInterval,
              offset: snapInterval * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <View style={{ width: cardWidth }}>
                <View style={[styles.card, { height: cardHeight }]}>
                  {typeof renderCard === 'function' ? renderCard(item, helpers, index) : null}
                </View>
              </View>
            )}
          />
        </View>

        <DotsIndicator count={total} index={activeIndex} style={styles.dots} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WARM_BACKGROUND,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 4,
    color: roadmapColors.mutedText,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  divider: {
    marginTop: 16,
    height: 16,
    justifyContent: 'center',
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(43,43,43,0.12)',
  },
  dividerDot: {
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
    paddingBottom: 18,
  },
  deckContent: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: roadmapColors.surface,
    borderRadius: 24,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
    overflow: 'hidden',
  },
  dots: {
    marginTop: 6,
  },
});
