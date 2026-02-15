import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import DotsIndicator from './DotsIndicator';

export default function CardCarousel({
  data = [],
  initialIndex = 0,
  renderCard,
  cardWidthPct = 0.86,
  gap = 16,
  style,
  onIndexChange,
  showDots = true,
  controllerRef,
}) {
  const listRef = useRef(null);
  const { width: screenWidth } = useWindowDimensions();
  const safeData = Array.isArray(data) ? data : [];

  const cardWidth = useMemo(() => {
    const pct = Math.min(0.92, Math.max(0.75, Number(cardWidthPct) || 0.86));
    return Math.round(screenWidth * pct);
  }, [screenWidth, cardWidthPct]);

  const snapInterval = useMemo(() => cardWidth + gap, [cardWidth, gap]);
  const sidePadding = useMemo(() => Math.max(0, Math.round((screenWidth - cardWidth) / 2)), [screenWidth, cardWidth]);

  const [activeIndex, setActiveIndex] = useState(Math.max(0, Math.min(safeData.length - 1, initialIndex)));

  useEffect(() => {
    setActiveIndex(Math.max(0, Math.min(safeData.length - 1, initialIndex)));
  }, [safeData.length, initialIndex]);

  const scrollToIndex = useCallback(
    (index, animated = true) => {
      const next = Math.max(0, Math.min(safeData.length - 1, index));
      listRef.current?.scrollToOffset?.({ offset: next * snapInterval, animated });
      setActiveIndex(next);
      onIndexChange?.(next);
    },
    [onIndexChange, safeData.length, snapInterval],
  );

  useEffect(() => {
    if (!controllerRef) return undefined;
    controllerRef.current = {
      goTo: (index, animated = true) => scrollToIndex(index, animated),
      goNext: () => scrollToIndex(activeIndex + 1),
      goPrev: () => scrollToIndex(activeIndex - 1),
      getIndex: () => activeIndex,
      getCount: () => safeData.length,
    };
    return () => {
      controllerRef.current = null;
    };
  }, [controllerRef, scrollToIndex, activeIndex, safeData.length]);

  useEffect(() => {
    if (!safeData.length) return;
    if (initialIndex > 0) {
      requestAnimationFrame(() => scrollToIndex(initialIndex, false));
    }
  }, [initialIndex, safeData.length, scrollToIndex]);

  const handleMomentumEnd = useCallback(
    (event) => {
      const offsetX = event?.nativeEvent?.contentOffset?.x ?? 0;
      const idx = Math.round(offsetX / snapInterval);
      const next = Math.max(0, Math.min(safeData.length - 1, idx));
      setActiveIndex(next);
      onIndexChange?.(next);
    },
    [onIndexChange, safeData.length, snapInterval],
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={listRef}
        horizontal
        data={safeData}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        contentContainerStyle={[styles.content, { paddingHorizontal: sidePadding }]}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        onMomentumScrollEnd={handleMomentumEnd}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View style={{ width: cardWidth }}>
            {typeof renderCard === 'function'
              ? renderCard({
                  item,
                  index,
                  activeIndex,
                  cardWidth,
                  goNext: () => scrollToIndex(index + 1),
                  goPrev: () => scrollToIndex(index - 1),
                  goTo: (nextIndex) => scrollToIndex(nextIndex),
                })
              : null}
          </View>
        )}
      />

      {showDots ? <DotsIndicator count={safeData.length} index={activeIndex} style={styles.dots} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  dots: {
    marginTop: 2,
  },
});
