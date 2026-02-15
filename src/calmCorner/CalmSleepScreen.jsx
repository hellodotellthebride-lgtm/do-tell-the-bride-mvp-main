import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import Card from '../components/ui/Card';
import AppText from '../components/AppText';
import { colors, gapLg, gapSm } from '../theme';

export default function CalmSleepScreen({ navigation }) {
  return (
    <Screen scroll>
      <Pressable
        onPress={() => navigation?.goBack?.()}
        hitSlop={{ top: gapSm, bottom: gapSm, left: gapSm, right: gapSm }}
        style={({ pressed }) => [styles.backRow, pressed && styles.backRowPressed]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={20} color={colors.text} />
        <AppText variant="bodySmall" color="textMuted">
          Back
        </AppText>
      </Pressable>

      <Card backgroundColor={colors.surface} style={styles.header}>
        <AppText variant="h1">Sleep</AppText>
        <AppText variant="bodySmall" color="textMuted" style={styles.subtitle}>
          Coming soon.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
    marginBottom: gapLg,
    alignSelf: 'flex-start',
  },
  backRowPressed: {
    opacity: 0.85,
  },
  header: {},
  subtitle: {
    marginTop: gapSm,
  },
});
