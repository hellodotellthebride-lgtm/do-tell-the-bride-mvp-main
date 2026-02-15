import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ModalCard, Pill, TextField } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const sortByName = (items = [], field = 'fullName') =>
  [...(items || [])].sort((a, b) =>
    String(a?.[field] || '').localeCompare(String(b?.[field] || ''), undefined, { sensitivity: 'base' }),
  );

export default function SeatingPlanScreen({ navigation }) {
  const { state, tableById, actions } = useGuestNest();
  const tables = state.tables || [];
  const guests = state.guests || [];

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState({ open: false, tableId: null, query: '' });
  const [tableForm, setTableForm] = useState({
    name: '',
    numberOfSeats: '10',
    type: '',
    isTopTable: false,
  });

  const guestsByTableId = useMemo(() => {
    const map = {};
    guests.forEach((g) => {
      if (!g.tableId) return;
      if (!map[g.tableId]) map[g.tableId] = [];
      map[g.tableId].push(g);
    });
    Object.keys(map).forEach((tableId) => {
      map[tableId] = sortByName(map[tableId], 'fullName');
    });
    return map;
  }, [guests]);

  const openAssign = (tableId) => setAssignModal({ open: true, tableId, query: '' });
  const closeAssign = () => setAssignModal({ open: false, tableId: null, query: '' });

  const assignableGuests = useMemo(() => {
    if (!assignModal.open) return [];
    const q = assignModal.query.trim().toLowerCase();
    const list = guests
      .filter((g) => {
        if (q && !String(g.fullName || '').toLowerCase().includes(q)) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        const aUnassigned = a.tableId ? 1 : 0;
        const bUnassigned = b.tableId ? 1 : 0;
        if (aUnassigned !== bUnassigned) return aUnassigned - bUnassigned;
        return String(a.fullName || '').localeCompare(String(b.fullName || ''), undefined, { sensitivity: 'base' });
      });
    return list;
  }, [assignModal.open, assignModal.query, guests]);

  const canSaveTable = Boolean(tableForm.name.trim()) && Number(tableForm.numberOfSeats) > 0;

  const saveTable = async () => {
    if (!canSaveTable) return;
    await actions.addTable({
      name: tableForm.name,
      numberOfSeats: Number(tableForm.numberOfSeats) || 0,
      type: tableForm.type,
      isTopTable: tableForm.isTopTable,
    });
    setTableForm({ name: '', numberOfSeats: '10', type: '', isTopTable: false });
    setAddModalOpen(false);
  };

  const confirmDeleteTable = (table) => {
    Alert.alert(
      'Delete this table?',
      'Guests assigned to it will simply become unassigned.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => actions.deleteTable(table.id) },
      ],
    );
  };

  return (
    <Screen>
      <GuestNestHeader
        title="Seating Plan"
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            hitSlop={spacing.sm}
            onPress={() => setAddModalOpen(true)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="add" size={22} color={colors.text} />
          </Pressable>
        }
      />

      {tables.length === 0 ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            No tables yet
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            Add a few tables, then assign guests with a simple picker — no dragging required.
          </AppText>
          <Button label="Add Table" onPress={() => setAddModalOpen(true)} />
        </Card>
      ) : null}

      {tables
        .slice()
        .sort((a, b) => {
          const aTop = a.isTopTable ? 1 : 0;
          const bTop = b.isTopTable ? 1 : 0;
          if (aTop !== bTop) return bTop - aTop;
          return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
        })
        .map((table) => {
          const assigned = guestsByTableId[table.id] || [];
          const filled = assigned.length;
          const total = Number(table.numberOfSeats) || 0;
          const indicator = total ? `${filled}/${total} seats filled` : `${filled} guests assigned`;
          return (
            <Card key={table.id} style={{ marginBottom: spacing.lg }}>
              <View style={styles.tableHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.tableTitleRow}>
                    <AppText variant="h3" style={{ marginBottom: 4 }}>
                      {table.name || 'Table'}
                    </AppText>
                    {table.isTopTable ? (
                      <Ionicons name="star" size={16} color={colors.accent} style={styles.topStar} />
                    ) : null}
                  </View>
                  <AppText variant="bodySmall" color="textMuted">
                    {indicator}
                    {table.type ? ` · ${table.type}` : ''}
                  </AppText>
                </View>
                <Pressable
                  hitSlop={spacing.sm}
                  onPress={() => confirmDeleteTable(table)}
                  style={({ pressed }) => [styles.trashButton, pressed && styles.pressed]}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>

              {assigned.length ? (
                <View style={{ marginTop: spacing.md }}>
                  {assigned.map((guest) => (
                    <View key={guest.id} style={styles.assignedRow}>
                      <View style={{ flex: 1 }}>
                        <AppText variant="body">{guest.fullName || 'Unnamed guest'}</AppText>
                        {guest.seatLabel ? (
                          <AppText variant="caption" color="textMuted">
                            {guest.seatLabel}
                          </AppText>
                        ) : null}
                      </View>
                      <Pressable
                        hitSlop={spacing.sm}
                        onPress={() => actions.unassignGuestFromTable(guest.id)}
                        style={({ pressed }) => [styles.smallIconButton, pressed && styles.pressed]}
                      >
                        <Ionicons name="close" size={16} color={colors.textMuted} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ marginTop: spacing.md }}>
                  <Pill label="No guests assigned yet" tone="neutral" />
                </View>
              )}

              <Button
                label="Assign Guest"
                variant="secondary"
                icon="person-add-outline"
                onPress={() => openAssign(table.id)}
                style={{ marginTop: spacing.lg }}
              />
            </Card>
          );
        })}

      <ModalCard visible={addModalOpen} title="Add Table" onClose={() => setAddModalOpen(false)}>
        <TextField
          label="Table name *"
          value={tableForm.name}
          onChangeText={(value) => setTableForm((prev) => ({ ...prev, name: value }))}
          placeholder="e.g. Top Table, Table 1"
          style={{ marginBottom: spacing.lg }}
        />
        <View style={styles.twoColRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
              Number of seats *
            </AppText>
            <TextInput
              value={tableForm.numberOfSeats}
              onChangeText={(value) => setTableForm((prev) => ({ ...prev, numberOfSeats: value }))}
              keyboardType="numeric"
              placeholder="10"
              placeholderTextColor="rgba(43,43,43,0.35)"
              style={styles.numberInput}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Type"
              value={tableForm.type}
              onChangeText={(value) => setTableForm((prev) => ({ ...prev, type: value }))}
              placeholder="Round / Long (optional)"
            />
          </View>
        </View>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.switchTitleRow}>
              <Ionicons name="star" size={16} color={colors.accent} />
              <AppText variant="labelSmall" color="textMuted">
                Top table
              </AppText>
            </View>
            <AppText variant="caption" color="textMuted">
              Pinned to the top with a star.
            </AppText>
          </View>
          <Switch
            value={Boolean(tableForm.isTopTable)}
            onValueChange={(value) =>
              setTableForm((prev) => ({
                ...prev,
                isTopTable: value,
                name: value && !prev.name.trim() ? 'Top Table' : prev.name,
              }))
            }
            trackColor={{ false: 'rgba(0,0,0,0.12)', true: 'rgba(255,155,133,0.55)' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <Button label="Save Table" onPress={saveTable} disabled={!canSaveTable} style={{ marginTop: spacing.lg }} />
      </ModalCard>

      <ModalCard
        visible={assignModal.open}
        title={
          assignModal.tableId
            ? `Assign to ${tableById?.[assignModal.tableId]?.name || 'table'}${
                tableById?.[assignModal.tableId]?.isTopTable ? ' ★' : ''
              }`
            : 'Assign Guest'
        }
        onClose={closeAssign}
      >
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={assignModal.query}
            onChangeText={(value) => setAssignModal((prev) => ({ ...prev, query: value }))}
            placeholder="Search guests"
            placeholderTextColor="rgba(43,43,43,0.35)"
            style={styles.searchInput}
          />
        </View>
        <View style={{ marginTop: spacing.md }}>
          {assignableGuests.length === 0 ? (
            <AppText variant="bodySmall" color="textMuted">
              No guests match that search.
            </AppText>
          ) : null}
          {assignableGuests.map((guest) => {
            const isAssignedHere = guest.tableId === assignModal.tableId;
            const tableName = guest.tableId ? tableById?.[guest.tableId]?.name : '';
            return (
              <Pressable
                key={guest.id}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                onPress={() => {
                  if (!assignModal.tableId) return;
                  actions.assignGuestToTable(guest.id, assignModal.tableId);
                  closeAssign();
                }}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="body">{guest.fullName || 'Unnamed guest'}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {guest.tableId ? (isAssignedHere ? 'Already at this table' : `Currently: ${tableName || 'another table'}`) : 'Unassigned'}
                  </AppText>
                </View>
                <Ionicons name="arrow-forward" size={18} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </ModalCard>
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
  trashButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topStar: {
    marginTop: 1,
  },
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  smallIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
  },
  switchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  numberInput: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
  },
  optionPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
});
