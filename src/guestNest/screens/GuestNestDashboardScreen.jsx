import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const SummaryTile = ({ label, value }) => (
  <View style={styles.summaryTile}>
    <AppText variant="caption" color="textMuted" style={styles.summaryLabel}>
      {label}
    </AppText>
    <AppText variant="h2" style={styles.summaryValue}>
      {value}
    </AppText>
  </View>
);

const LinkCard = ({ icon, title, description, onPress }) => (
  <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}>
    <View style={styles.linkIcon}>
      <Ionicons name={icon} size={18} color={colors.accent} />
    </View>
    <View style={{ flex: 1 }}>
      <AppText variant="h3" style={{ marginBottom: 2 }}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="bodySmall" color="textMuted">
          {description}
        </AppText>
      ) : null}
    </View>
    <Ionicons name="chevron-forward" size={18} color="rgba(43,43,43,0.45)" />
  </Pressable>
);

export default function GuestNestDashboardScreen({ navigation }) {
  const { state } = useGuestNest();
  const guests = state.guests || [];

  const summary = useMemo(() => {
    const total = guests.length;
    const pending = guests.filter((g) => g.rsvpStatus === 'Pending').length;
    const declined = guests.filter((g) => g.rsvpStatus === 'No').length;
    const yes = guests.filter((g) => g.rsvpStatus === 'Yes').length;
    const received = yes + declined;
    return { total, pending, declined, yes, received };
  }, [guests]);

  const isEmpty = summary.total === 0;

  return (
    <Screen>
      <GuestNestHeader title="Guest Nest" subtitle="Everyone you’re welcoming." onBack={null} />

      {isEmpty ? (
        <Card style={styles.heroCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="people-outline" size={22} color={colors.accent} />
          </View>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            Ready to start adding guests?
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            Add one guest at a time, or paste a list and we’ll do the rest. Everything stays saved on
            this device.
          </AppText>
          <Button
            label="Add Guest"
            icon="person-add-outline"
            onPress={() => navigation.navigate('AddGuest')}
            size="sm"
            style={{ marginBottom: spacing.md }}
          />
          <Button
            label="Bulk Add Guests"
            variant="ghost"
            icon="clipboard-outline"
            onPress={() => navigation.navigate('BulkAddGuests')}
            size="sm"
          />
        </Card>
      ) : (
        <Card style={styles.heroCard}>
          <View style={styles.ctaRow}>
            <Button
              label="Add Guest"
              icon="person-add-outline"
              onPress={() => navigation.navigate('AddGuest')}
              size="sm"
              style={{ flex: 1 }}
            />
            <Button
              label="Bulk Add"
              variant="ghost"
              icon="clipboard-outline"
              onPress={() => navigation.navigate('BulkAddGuests')}
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      )}

      <Card style={{ marginBottom: spacing.lg }}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          At a glance
        </AppText>
        <View style={styles.summaryGroup}>
          <View style={styles.summaryGrid}>
            <SummaryTile label="Total guests" value={summary.total} />
            <SummaryTile label="RSVP received" value={summary.received} />
            <SummaryTile label="Still waiting" value={summary.pending} />
            <SummaryTile label="Declined" value={summary.declined} />
          </View>
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.lg }}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          Guest tools
        </AppText>
        <LinkCard
          icon="list-outline"
          title="View all guests"
          description="Search, filter, RSVP and edit details."
          onPress={() => navigation.navigate('GuestList')}
        />
        <LinkCard
          icon="grid-outline"
          title="Seating plan"
          description="Add tables and assign guests calmly."
          onPress={() => navigation.navigate('SeatingPlan')}
        />
        <LinkCard
          icon="restaurant-outline"
          title="Meal tracking"
          description="Keep meal choices and dietary notes in one place."
          onPress={() => navigation.navigate('MealTracking')}
        />
        <LinkCard
          icon="settings-outline"
          title="Settings"
          description="Manage meal options and guest groups."
          onPress={() => navigation.navigate('GuestNestSettings')}
        />
      </Card>

      <Card>
        <AppText variant="h3" style={{ marginBottom: 6 }}>
          Export (coming soon)
        </AppText>
        <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
          For v1, these buttons are placeholders — your data is safely stored locally.
        </AppText>
        <Button label="Export CSV" disabled onPress={() => {}} style={{ marginBottom: spacing.md }} />
        <Button label="Export PDF" variant="secondary" disabled onPress={() => {}} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.86,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryGroup: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
  },
  summaryTile: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minWidth: 140,
  },
  summaryLabel: {
    marginBottom: 4,
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.82,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
