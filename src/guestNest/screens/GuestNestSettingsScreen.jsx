import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Card } from '../components/GuestNestUi';

const SettingsCard = ({ icon, title, body, onPress }) => (
  <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.cardRow, pressed && styles.pressed]}>
    <View style={styles.iconBubble}>
      <Ionicons name={icon} size={18} color={colors.accent} />
    </View>
    <View style={{ flex: 1 }}>
      <AppText variant="h3" style={{ marginBottom: 2 }}>
        {title}
      </AppText>
      <AppText variant="bodySmall" color="textMuted">
        {body}
      </AppText>
    </View>
    <Ionicons name="chevron-forward" size={18} color="rgba(43,43,43,0.45)" />
  </Pressable>
);

export default function GuestNestSettingsScreen({ navigation }) {
  return (
    <Screen>
      <GuestNestHeader title="Settings" onBack={() => navigation.goBack()} />

      <Card>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          Manage
        </AppText>
        <SettingsCard
          icon="restaurant-outline"
          title="Meal Options"
          body="Add starters, mains, desserts, and anything else you’re tracking."
          onPress={() => navigation.navigate('MealOptions')}
        />
        <SettingsCard
          icon="people-outline"
          title="Guest Groups"
          body="Create helpful group labels (family, friends, work, etc.)."
          onPress={() => navigation.navigate('GuestGroups')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.86,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
});

