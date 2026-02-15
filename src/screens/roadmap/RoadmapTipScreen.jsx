import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CardCarousel from '../../components/roadmap/CardCarousel';
import CTAButton from '../../components/roadmap/CTAButton';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../components/roadmap/tokens';
import {
  getChecklistItemCopy,
  getQuickDestinationForItem,
  getStageHubRoute,
  getTipContent,
} from '../../roadmap/roadmapData';
import { loadChecklistState, persistStageChecklist } from '../../roadmap/progressStorage';

export default function RoadmapTipScreen({ navigation, route }) {
  const stageId = route?.params?.stageId;
  const itemId = route?.params?.itemId;
  const [saving, setSaving] = useState(false);
  const { height: screenHeight } = useWindowDimensions();

  const stageHubRoute = useMemo(
    () => (stageId ? getStageHubRoute(stageId) : 'WeddingRoadmap'),
    [stageId],
  );

  const checklistCopy = useMemo(
    () => (stageId && itemId ? getChecklistItemCopy(stageId, itemId) : { label: '', description: '' }),
    [stageId, itemId],
  );

  const tip = useMemo(() => {
    if (!stageId || !itemId) return null;
    return getTipContent(stageId, itemId);
  }, [stageId, itemId]);

  const handleBackToHub = useCallback(() => {
    navigation?.navigate?.(stageHubRoute);
  }, [navigation, stageHubRoute]);

  const title = tip?.title || checklistCopy?.label || 'Tip';
  const subtitle = tip?.subtitle || checklistCopy?.description || 'A small bit of guidance.';

  const cards = useMemo(() => {
    const contentCard = {
      id: 'tip',
      kind: 'content',
      title: 'Quick tip',
      body:
        tip?.body ||
        'This tip is coming soon. For now, you can keep moving with the checklist — one small step at a time.',
      bullets: Array.isArray(tip?.bullets) ? tip.bullets : [],
      ctaLabel: 'Next',
    };

    const confirmCard = {
      id: 'confirm',
      kind: 'confirm',
      title: 'Mark complete',
      body: 'When this feels clear enough, mark it complete.',
      ctaLabel: 'Mark complete',
    };

    return [contentCard, confirmCard];
  }, [tip]);

  const hasQuickDestination = !!(stageId && itemId && getQuickDestinationForItem(stageId, itemId));
  const cardHeight = Math.min(560, Math.max(420, Math.round(screenHeight * 0.6)));

  const openQuickDestination = useCallback(() => {
    if (!stageId || !itemId) return;
    const routeName = getQuickDestinationForItem(stageId, itemId);
    if (!routeName) return;
    navigation?.navigate?.(routeName);
  }, [navigation, stageId, itemId]);

  const handleConfirm = useCallback(async () => {
    if (saving) return;
    if (!stageId || !itemId) return;

    setSaving(true);
    try {
      const checklistState = await loadChecklistState();
      const stageMap = checklistState?.[stageId] ?? {};
      const nextStageMap = { ...stageMap, [itemId]: true };
      await persistStageChecklist(stageId, nextStageMap);
      navigation?.navigate?.(stageHubRoute);
    } catch (error) {
      console.warn('[RoadmapTip] unable to mark complete', error);
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [saving, stageId, itemId, navigation, stageHubRoute]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleBackToHub} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color="#6F5B55" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.carouselArea}>
        <CardCarousel
          data={cards}
          renderCard={({ item, index, goNext, goPrev }) => {
            const isFirst = index === 0;
            const isLast = index === cards.length - 1;
            const primaryLabel = item?.ctaLabel || (item?.kind === 'confirm' ? 'Mark complete' : 'Next');
            const showQuickLink = hasQuickDestination && index === 0;

            return (
              <View style={[styles.card, { height: cardHeight }]}>
                <ScrollView
                  style={styles.cardScroll}
                  contentContainerStyle={styles.cardContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.cardTitle}>{item?.title}</Text>
                  {item?.body ? <Text style={styles.cardBody}>{item.body}</Text> : null}

                  {Array.isArray(item?.bullets) && item.bullets.length ? (
                    <View style={styles.bullets}>
                      {item.bullets.map((line) => (
                        <Text key={line} style={styles.bulletText}>
                          • {line}
                        </Text>
                      ))}
                    </View>
                  ) : null}

                  {showQuickLink ? (
                    <Pressable onPress={openQuickDestination} style={styles.quickLinkButton} hitSlop={10}>
                      <Text style={styles.quickLinkText}>Open the related tool</Text>
                    </Pressable>
                  ) : null}
                </ScrollView>

                <View style={styles.footerRow}>
                  <CTAButton
                    label="Back"
                    variant="secondary"
                    onPress={() => {
                      if (isFirst) {
                        handleBackToHub();
                        return;
                      }
                      goPrev();
                    }}
                    style={styles.footerButton}
                  />
                  <CTAButton
                    label={saving && item?.kind === 'confirm' ? 'Saving…' : primaryLabel}
                    onPress={() => {
                      if (item?.kind === 'confirm') {
                        handleConfirm();
                        return;
                      }
                      if (isLast) return;
                      goNext();
                    }}
                    style={[styles.footerButton, saving && item?.kind === 'confirm' && styles.buttonDisabled]}
                  />
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
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  bullets: {
    gap: 8,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  quickLinkButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
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
    gap: 12,
    padding: roadmapSpacing.cardPadding,
    paddingTop: 0,
  },
  footerButton: {
    flex: 1,
    marginBottom: 0,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
});
