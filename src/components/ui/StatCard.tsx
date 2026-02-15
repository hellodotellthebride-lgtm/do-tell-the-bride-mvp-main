import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Card from './Card';
import { colors, gapMd, gapSm } from '../../theme';

type StatCardTone = 'neutral' | 'highlight' | 'over';

type StatCardProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  message?: string;
  tone?: StatCardTone;
  style?: StyleProp<ViewStyle>;
};

export default function StatCard({
  icon,
  label,
  value,
  message,
  tone = 'neutral',
  style,
}: StatCardProps) {
  const isHighlight = tone === 'highlight';
  const isOver = tone === 'over';

  return (
    <Card
      padding={gapMd}
      elevated={false}
      style={[
        styles.base,
        isHighlight && styles.highlight,
        isOver && styles.over,
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name={icon} size={16} color={colors.accent} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>

      <Text
        style={[styles.value, isHighlight && styles.valueHighlight, isOver && styles.valueOver]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {value}
      </Text>

      {message ? (
        <Text style={[styles.message, isOver && styles.messageOver]} numberOfLines={2}>
          {message}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  highlight: {
    backgroundColor: '#FFF8F5',
  },
  over: {
    backgroundColor: '#FFF1EE',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
    marginBottom: gapSm,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.textMuted,
    fontFamily: 'Outfit_600SemiBold',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  valueHighlight: {
    fontSize: 20,
    color: colors.accent,
  },
  valueOver: {
    color: '#B64C40',
  },
  message: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: colors.textMuted,
  },
  messageOver: {
    color: '#B64C40',
  },
});
