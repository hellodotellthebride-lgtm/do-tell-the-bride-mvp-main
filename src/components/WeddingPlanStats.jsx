import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Card from './ui/Card';
import { colors, gapLg, gapMd, gapSm, spacing } from '../theme';

const StatCell = ({ label, value }) => (
  <View style={styles.cell}>
    <AppText variant="caption" color="textMuted">
      {label}
    </AppText>
    <AppText variant="h3" style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
      {value}
    </AppText>
  </View>
);

export default function WeddingPlanStats({
  budgetValue,
  guestsValue,
  vendorsValue,
  timelineValue,
  style,
}) {
  const rows = [
    [
      { id: 'budget', label: 'Budget', value: budgetValue },
      { id: 'guests', label: 'Guests', value: guestsValue },
    ],
    [
      { id: 'vendors', label: 'Vendors', value: vendorsValue },
      { id: 'timeline', label: 'Timeline', value: timelineValue },
    ],
  ];

  return (
    <View style={[styles.wrap, style]}>
      <AppText variant="labelSmall" color="textMuted" style={styles.heading}>
        WEDDING PLAN STATS
      </AppText>
      <Card backgroundColor="#FFFFFF" borderColor="rgba(0,0,0,0.06)" elevated={false}>
        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((stat) => (
                <View key={stat.id} style={styles.cellWrap}>
                  <StatCell label={stat.label} value={stat.value} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: gapSm,
  },
  heading: {
    marginLeft: spacing.xs,
  },
  grid: {
    gap: gapSm,
  },
  row: {
    flexDirection: 'row',
    gap: gapSm,
  },
  cellWrap: {
    flex: 1,
  },
  cell: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    paddingVertical: gapMd,
    paddingHorizontal: gapLg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    gap: spacing.xs,
  },
  value: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
});
