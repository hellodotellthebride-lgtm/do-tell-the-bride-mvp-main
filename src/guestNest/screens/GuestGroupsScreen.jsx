import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, Pill } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

export default function GuestGroupsScreen({ navigation }) {
  const { state, actions } = useGuestNest();
  const groups = state.groups || [];
  const guests = state.guests || [];

  const countByGroupId = useMemo(() => {
    const counts = {};
    guests.forEach((g) => {
      if (!g.groupId) return;
      counts[g.groupId] = (counts[g.groupId] || 0) + 1;
    });
    return counts;
  }, [guests]);

  const right = (
    <Pressable
      hitSlop={spacing.sm}
      onPress={() => navigation.navigate('AddGuestGroup')}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={22} color={colors.text} />
    </Pressable>
  );

  const confirmDelete = (group) => {
    const count = countByGroupId[group.id] || 0;
    const helper = count
      ? `Guests in this group (${count}) will simply be set to “no group”.`
      : 'This will remove the group from your list.';
    Alert.alert('Delete this group?', helper, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => actions.deleteGroup(group.id),
      },
    ]);
  };

  return (
    <Screen>
      <GuestNestHeader title="Guest Groups" onBack={() => navigation.goBack()} right={right} />

      {groups.length === 0 ? (
        <Card>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            No groups yet
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            Groups are optional — they just make filtering easier.
          </AppText>
          <Button label="Add Group" onPress={() => navigation.navigate('AddGuestGroup')} />
        </Card>
      ) : null}

      {groups
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' }))
        .map((group) => {
          const count = countByGroupId[group.id] || 0;
          return (
            <Card key={group.id} style={{ marginBottom: spacing.md, padding: spacing.lg }}>
              <View style={styles.groupRow}>
                <View style={{ flex: 1 }}>
                  <AppText variant="h3" numberOfLines={1} style={{ marginBottom: 4 }}>
                    {group.name || 'Untitled group'}
                  </AppText>
                  <AppText variant="bodySmall" color="textMuted">
                    {count} {count === 1 ? 'guest' : 'guests'}
                  </AppText>
                </View>
                <Pill label="Group" tone="neutral" />
                <Pressable
                  hitSlop={spacing.sm}
                  onPress={() => confirmDelete(group)}
                  style={({ pressed }) => [styles.trashButton, pressed && styles.pressed]}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
            </Card>
          );
        })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trashButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
});

