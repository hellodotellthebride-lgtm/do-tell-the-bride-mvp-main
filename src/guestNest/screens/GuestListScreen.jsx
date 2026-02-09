import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ChoiceChip, Pill } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const sortGuests = (guests, sortKey, groupById) => {
  const copy = [...guests];
  if (sortKey === 'RSVP') {
    const order = { Pending: 0, Yes: 1, No: 2 };
    copy.sort((a, b) => {
      const primary = (order[a.rsvpStatus] ?? 9) - (order[b.rsvpStatus] ?? 9);
      if (primary !== 0) return primary;
      return String(a.fullName || '').localeCompare(String(b.fullName || ''), undefined, {
        sensitivity: 'base',
      });
    });
    return copy;
  }
  if (sortKey === 'GROUP') {
    copy.sort((a, b) => {
      const groupA = a.groupId ? groupById?.[a.groupId]?.name || '' : 'zzzz';
      const groupB = b.groupId ? groupById?.[b.groupId]?.name || '' : 'zzzz';
      const primary = String(groupA).localeCompare(String(groupB), undefined, { sensitivity: 'base' });
      if (primary !== 0) return primary;
      return String(a.fullName || '').localeCompare(String(b.fullName || ''), undefined, {
        sensitivity: 'base',
      });
    });
    return copy;
  }
  copy.sort((a, b) =>
    String(a.fullName || '').localeCompare(String(b.fullName || ''), undefined, {
      sensitivity: 'base',
    }),
  );
  return copy;
};

const rsvpTone = (status) => {
  if (status === 'Yes') return 'success';
  if (status === 'No') return 'danger';
  return 'neutral';
};

export default function GuestListScreen({ navigation }) {
  const { state, groupById } = useGuestNest();
  const [query, setQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  const [sortKey, setSortKey] = useState('NAME');

  const guests = state.guests || [];
  const groups = state.groups || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((g) => {
      if (q && !String(g.fullName || '').toLowerCase().includes(q)) return false;
      if (rsvpFilter !== 'All' && g.rsvpStatus !== rsvpFilter) return false;
      if (groupFilter !== 'All' && (g.groupId || '') !== groupFilter) return false;
      return true;
    });
  }, [guests, groupFilter, query, rsvpFilter]);

  const sorted = useMemo(() => sortGuests(filtered, sortKey, groupById), [filtered, groupById, sortKey]);

  const right = (
    <Pressable
      hitSlop={spacing.sm}
      onPress={() => navigation.navigate('AddGuest')}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={22} color={colors.text} />
    </Pressable>
  );

  const showEmptyState = guests.length === 0;
  const showNoMatches = !showEmptyState && sorted.length === 0;

  return (
    <Screen>
      <GuestNestHeader title="Guest List" onBack={() => navigation.goBack()} right={right} />

      <Card style={{ marginBottom: spacing.lg }}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name"
            placeholderTextColor="rgba(43,43,43,0.35)"
            style={styles.searchInput}
          />
          {query ? (
            <Pressable hitSlop={spacing.sm} onPress={() => setQuery('')} style={styles.clearButton}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <View style={{ marginTop: spacing.md }}>
          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
            RSVP
          </AppText>
          <View style={styles.chipRow}>
            {['All', 'Pending', 'Yes', 'No'].map((value) => (
              <ChoiceChip
                key={value}
                label={value}
                selected={rsvpFilter === value}
                tone={value === 'Yes' ? 'success' : value === 'No' ? 'danger' : value === 'Pending' ? 'accent' : 'neutral'}
                onPress={() => setRsvpFilter(value)}
              />
            ))}
          </View>

          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
            Group
          </AppText>
          <View style={styles.chipRow}>
            <ChoiceChip label="All" selected={groupFilter === 'All'} onPress={() => setGroupFilter('All')} />
            {groups
              .slice()
              .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' }))
              .map((group) => (
                <ChoiceChip
                  key={group.id}
                  label={group.name || 'Group'}
                  selected={groupFilter === group.id}
                  tone="accent"
                  onPress={() => setGroupFilter(group.id)}
                />
              ))}
          </View>

          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
            Sort
          </AppText>
          <View style={styles.chipRow}>
            {[
              { key: 'NAME', label: 'Name A–Z' },
              { key: 'RSVP', label: 'RSVP status' },
              { key: 'GROUP', label: 'Group' },
            ].map((opt) => (
              <ChoiceChip
                key={opt.key}
                label={opt.label}
                selected={sortKey === opt.key}
                tone="neutral"
                onPress={() => setSortKey(opt.key)}
              />
            ))}
          </View>
        </View>
      </Card>

      {showEmptyState ? (
        <Card>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            No guests yet
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            Start with a few key people, then bulk add the rest whenever you like.
          </AppText>
          <Button label="Add Guest" onPress={() => navigation.navigate('AddGuest')} style={{ marginBottom: spacing.md }} />
          <Button label="Bulk Add Guests" variant="secondary" onPress={() => navigation.navigate('BulkAddGuests')} />
        </Card>
      ) : null}

      {showNoMatches ? (
        <Card>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            No matches
          </AppText>
          <AppText variant="bodySmall" color="textMuted">
            Try a different search or loosen the filters.
          </AppText>
        </Card>
      ) : null}

      {sorted.map((guest) => {
        const groupName = guest.groupId ? groupById?.[guest.groupId]?.name : '';
        return (
          <Pressable
            key={guest.id}
            onPress={() => navigation.navigate('EditGuest', { guestId: guest.id })}
            hitSlop={6}
            style={({ pressed }) => [styles.guestCard, pressed && styles.pressed]}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="h3" numberOfLines={1} style={{ marginBottom: 4 }}>
                {guest.fullName || 'Unnamed guest'}
              </AppText>
              <AppText variant="bodySmall" color="textMuted" numberOfLines={1}>
                {groupName ? groupName : 'No group'}
              </AppText>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Pill label={guest.rsvpStatus || 'Pending'} tone={rsvpTone(guest.rsvpStatus)} />
              <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.86,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFFDFB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
});

