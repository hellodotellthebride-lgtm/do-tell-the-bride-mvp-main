import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Card from '../../components/ui/Card';
import AppText from '../../components/AppText';
import { cardPadding, colors, gapLg, gapMd, gapSm, radius } from '../../theme';

const COLLAPSED_LINES = 6;

const ROADMAP_STAGE_TOKEN_REGEX = /\[\[ROADMAP_STAGE:([a-z0-9-]+)(?:\|([^\]]+))?\]\]/gi;
const SUGGEST_TOKEN_REGEX = /\[\[SUGGEST:([^\]]+)\]\]/gi;

const formatMessageTime = (createdAt) => {
  if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) return '';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

const extractIvyTokens = (rawText) => {
  const roadmapActions = [];
  const suggestions = [];
  ROADMAP_STAGE_TOKEN_REGEX.lastIndex = 0;
  SUGGEST_TOKEN_REGEX.lastIndex = 0;

  let cleaned = String(rawText || '');

  cleaned = cleaned.replace(ROADMAP_STAGE_TOKEN_REGEX, (_, stageIdRaw, labelRaw) => {
    const stageId = String(stageIdRaw || '').trim();
    if (stageId) {
      roadmapActions.push({
        stageId,
        label: String(labelRaw || '').trim(),
      });
    }
    return '';
  });

  cleaned = cleaned.replace(SUGGEST_TOKEN_REGEX, (_, labelRaw) => {
    const label = String(labelRaw || '').trim();
    if (label) {
      suggestions.push(label);
    }
    return '';
  });

  return {
    text: cleaned.replace(/\n{3,}/g, '\n\n').trim(),
    roadmapActions,
    suggestions,
  };
};

export default function Bubble({
  role = 'ivy',
  text = '',
  createdAt,
  onRoadmapStagePress,
  showSuggestions = false,
  onSuggestionPress,
}) {
  const isUser = role === 'user';
  const isIvy = !isUser;
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  const parsed = useMemo(
    () =>
      isIvy
        ? extractIvyTokens(text)
        : { text, roadmapActions: [], suggestions: [] },
    [isIvy, text],
  );
  const hasRoadmapActions =
    isIvy && parsed.roadmapActions.length > 0 && typeof onRoadmapStagePress === 'function';
  const hasSuggestions =
    showSuggestions &&
    isIvy &&
    parsed.suggestions.length > 0 &&
    typeof onSuggestionPress === 'function';

  const toggleTimestamp = useCallback(() => {
    setShowTimestamp((value) => !value);
  }, []);

  const timeLabel = useMemo(() => formatMessageTime(createdAt), [createdAt]);

  const onTextLayout = useCallback(
    (event) => {
      if (!isIvy) return;
      const lineCount = event?.nativeEvent?.lines?.length ?? 0;
      if (lineCount > COLLAPSED_LINES) {
        setCanExpand(true);
      }
    },
    [isIvy],
  );

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowIvy]}>
      <View style={styles.stack}>
        <Pressable
          onLongPress={toggleTimestamp}
          delayLongPress={250}
          style={styles.bubblePressable}
          accessibilityRole="text"
        >
          <Card
            padding={isUser ? gapMd : cardPadding}
            elevated={isIvy}
            backgroundColor={isUser ? colors.accentSoft : '#FFFFFF'}
            borderColor={isUser ? 'rgba(255,155,133,0.25)' : colors.borderSoft}
            style={styles.bubbleCard}
          >
            <AppText
              variant="body"
              style={styles.text}
              numberOfLines={isIvy && !isExpanded ? COLLAPSED_LINES : undefined}
              onTextLayout={onTextLayout}
            >
              {parsed.text}
            </AppText>
          </Card>
        </Pressable>

        {isIvy && canExpand ? (
          <Pressable
            onPress={() => setIsExpanded((value) => !value)}
            style={styles.expandButton}
            accessibilityRole="button"
            accessibilityLabel={isExpanded ? 'Show less' : 'Show more'}
          >
            <AppText variant="bodySmall" style={styles.expandLabel}>
              {isExpanded ? 'Show less' : 'Show more'}
            </AppText>
          </Pressable>
        ) : null}

        {hasRoadmapActions ? (
          <View style={styles.roadmapActions}>
            {parsed.roadmapActions.map((action) => (
              <Pressable
                key={`${action.stageId}-${action.label || 'roadmap'}`}
                onPress={() => onRoadmapStagePress(action.stageId)}
                style={styles.roadmapButton}
                accessibilityRole="button"
                accessibilityLabel={action.label || 'Open your Roadmap'}
              >
                <AppText variant="bodySmall" style={styles.roadmapLabel}>
                  {action.label || 'Open your Roadmap'}
                </AppText>
              </Pressable>
            ))}
          </View>
        ) : null}

        {hasSuggestions ? (
          <View style={styles.suggestionRow}>
            {parsed.suggestions.slice(0, 3).map((label) => (
              <Pressable
                key={label}
                onPress={() => onSuggestionPress(label)}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  pressed && styles.suggestionChipPressed,
                ]}
              >
                <AppText variant="bodySmall" style={styles.suggestionLabel}>
                  {label}
                </AppText>
              </Pressable>
            ))}
          </View>
        ) : null}

        {showTimestamp && timeLabel ? (
          <AppText
            variant="caption"
            color="textMuted"
            align={isUser ? 'right' : 'left'}
            style={styles.timestamp}
          >
            {timeLabel}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: gapSm,
  },
  rowIvy: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  stack: {
    maxWidth: '84%',
  },
  bubblePressable: {
    borderRadius: radius.card,
  },
  bubbleCard: {},
  text: {
    color: colors.text,
  },
  timestamp: {
    marginTop: gapSm,
  },
  expandButton: {
    alignSelf: 'flex-start',
    marginTop: gapSm,
  },
  expandLabel: {
    color: colors.accent,
    fontFamily: 'Outfit_500Medium',
  },
  roadmapActions: {
    marginTop: gapSm,
    gap: gapSm,
  },
  roadmapButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: gapLg,
    paddingVertical: gapSm,
  },
  roadmapLabel: {
    color: colors.accent,
    fontFamily: 'Outfit_500Medium',
  },
  suggestionRow: {
    marginTop: gapSm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSm,
  },
  suggestionChip: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingHorizontal: gapLg,
    paddingVertical: gapSm,
  },
  suggestionChipPressed: {
    backgroundColor: colors.surface,
  },
  suggestionLabel: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
});
