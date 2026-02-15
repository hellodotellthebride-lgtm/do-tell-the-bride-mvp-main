import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import Card from '../../components/ui/Card';
import AppText from '../../components/AppText';
import { colors, gapLg, gapMd, gapSm, sectionGap } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const SummaryTile = ({ label, value }) => (
  <Card elevated={false} backgroundColor={colors.surface} padding={gapMd} style={styles.summaryTile}>
    <View style={styles.summaryTileStack}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <AppText variant="h2" style={styles.summaryValue}>
        {value}
      </AppText>
    </View>
  </Card>
);

const LinkCard = ({ icon, title, description, onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={gapSm}
    style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
  >
    <View style={styles.linkIcon}>
      <Ionicons name={icon} size={18} color={colors.accent} />
    </View>
    <View style={{ flex: 1 }}>
      <AppText variant="h3">
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

const GUEST_NEST_LAST_OPEN_AT_KEY = 'GUEST_NEST_LAST_OPEN_AT';

export default function GuestNestDashboardScreen({ navigation }) {
  const { state } = useGuestNest();
  const guests = state.guests || [];

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.setItem(GUEST_NEST_LAST_OPEN_AT_KEY, String(Date.now())).catch((error) => {
        console.warn('[GuestNest] unable to store last open timestamp', error);
      });
    }, []),
  );

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
    <Screen scroll>
      <GuestNestHeader title="Guest Nest" subtitle="Everyone you’re welcoming." onBack={null} />

      {isEmpty ? (
        <Card style={styles.sectionCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="people-outline" size={22} color={colors.accent} />
          </View>
          <AppText variant="h3" style={styles.cardTitle}>
            Ready to start adding guests?
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={styles.cardBody}>
            Add one guest at a time, or paste a list and we’ll do the rest. Everything stays saved on
            this device.
          </AppText>
          <Button
            label="Add Guest"
            icon="person-add-outline"
            onPress={() => navigation.navigate('AddGuest')}
            size="sm"
            style={{ marginBottom: gapMd }}
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
        <Card style={styles.sectionCard}>
          <View style={styles.buttonRow}>
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

      <Card style={styles.sectionCard}>
        <AppText variant="h3" style={styles.sectionTitle}>
          At a glance
        </AppText>
        <View style={styles.summaryGrid}>
          <SummaryTile label="Total guests" value={summary.total} />
          <SummaryTile label="RSVP received" value={summary.received} />
          <SummaryTile label="Still waiting" value={summary.pending} />
          <SummaryTile label="Declined" value={summary.declined} />
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <AppText variant="h3" style={styles.sectionTitle}>
          Guest tools
        </AppText>
        <View style={styles.linkList}>
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
        </View>
      </Card>

      <Card>
        <AppText variant="h3" style={styles.cardTitle}>
          Export (coming soon)
        </AppText>
        <AppText variant="bodySmall" color="textMuted" style={styles.cardBody}>
          For v1, these buttons are placeholders — your data is safely stored locally.
        </AppText>
        <Button label="Export CSV" disabled onPress={() => {}} style={{ marginBottom: gapMd }} />
        <Button label="Export PDF" variant="secondary" disabled onPress={() => {}} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: sectionGap,
  },
  sectionTitle: {
    marginBottom: gapMd,
  },
  cardTitle: {
    marginBottom: gapSm,
  },
  cardBody: {
    marginBottom: gapLg,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: gapMd,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: gapMd,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSm,
  },
  summaryTile: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 140,
  },
  summaryTileStack: {
    gap: gapSm,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
  },
  linkList: {
    gap: gapSm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapLg,
    paddingVertical: gapMd,
    borderRadius: 16,
  },
  linkRowPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
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
