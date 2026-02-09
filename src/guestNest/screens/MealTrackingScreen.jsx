import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ModalCard, Pill, SelectField, TextField } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const countMealChoices = (guests = []) => guests.filter((g) => Boolean(g.mealChoiceId)).length;
const countDietaryNotes = (guests = []) => guests.filter((g) => Boolean(String(g.dietaryNotes || '').trim())).length;

export default function MealTrackingScreen({ navigation }) {
  const { state, mealOptionById, actions } = useGuestNest();
  const guests = state.guests || [];
  const mealOptions = state.mealOptions || [];

  const [editModal, setEditModal] = useState({ open: false, guestId: null });
  const [editForm, setEditForm] = useState({ mealChoiceId: undefined, dietaryNotes: '' });
  const [mealModalOpen, setMealModalOpen] = useState(false);

  const summary = useMemo(() => {
    const totalGuests = guests.length;
    const chosen = countMealChoices(guests);
    const dietary = countDietaryNotes(guests);
    return { totalGuests, chosen, dietary };
  }, [guests]);

  const counts = useMemo(() => {
    const map = {};
    mealOptions.forEach((opt) => {
      map[opt.id] = 0;
    });
    guests.forEach((g) => {
      if (!g.mealChoiceId) return;
      if (map[g.mealChoiceId] === undefined) map[g.mealChoiceId] = 0;
      map[g.mealChoiceId] += 1;
    });
    return map;
  }, [guests, mealOptions]);

  const guestsSorted = useMemo(
    () =>
      guests
        .slice()
        .sort((a, b) =>
          String(a.fullName || '').localeCompare(String(b.fullName || ''), undefined, { sensitivity: 'base' }),
        ),
    [guests],
  );

  const openEdit = (guest) => {
    setEditForm({
      mealChoiceId: guest.mealChoiceId,
      dietaryNotes: guest.dietaryNotes || '',
    });
    setEditModal({ open: true, guestId: guest.id });
  };

  const closeEdit = () => {
    setEditModal({ open: false, guestId: null });
    setMealModalOpen(false);
  };

  const saveEdit = async () => {
    if (!editModal.guestId) return;
    await actions.setGuestMealChoice(editModal.guestId, editForm.mealChoiceId ?? null, editForm.dietaryNotes);
    closeEdit();
  };

  const selectedGuest = editModal.guestId ? guests.find((g) => g.id === editModal.guestId) : null;
  const mealLabel = editForm.mealChoiceId ? mealOptionById?.[editForm.mealChoiceId]?.dishName : '';

  const right = (
    <Pressable
      hitSlop={spacing.sm}
      onPress={() => navigation.navigate('AddMealOption')}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={22} color={colors.text} />
    </Pressable>
  );

  return (
    <Screen>
      <GuestNestHeader title="Meal Tracking" onBack={() => navigation.goBack()} right={right} />

      {mealOptions.length === 0 ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            No meal options yet
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            Add a few meal options first, then assign guests as RSVPs come in.
          </AppText>
          <Button label="Add Meal Option" onPress={() => navigation.navigate('AddMealOption')} />
        </Card>
      ) : null}

      <Card style={{ marginBottom: spacing.lg }}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          Summary
        </AppText>
        <View style={styles.summaryRow}>
          <View style={styles.summaryTile}>
            <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
              Total guests
            </AppText>
            <AppText variant="h2">{summary.totalGuests}</AppText>
          </View>
          <View style={styles.summaryTile}>
            <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
              Meal chosen
            </AppText>
            <AppText variant="h2">{summary.chosen}</AppText>
          </View>
          <View style={styles.summaryTile}>
            <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
              Dietary notes
            </AppText>
            <AppText variant="h2">{summary.dietary}</AppText>
          </View>
        </View>
      </Card>

      {mealOptions.length ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>
            Meal option counts
          </AppText>
          {mealOptions
            .slice()
            .sort((a, b) => String(a.course || '').localeCompare(String(b.course || ''), undefined, { sensitivity: 'base' }) || String(a.dishName || '').localeCompare(String(b.dishName || ''), undefined, { sensitivity: 'base' }))
            .map((opt) => (
              <Pressable
                key={opt.id}
                hitSlop={6}
                onPress={() => navigation.navigate('EditMealOption', { mealOptionId: opt.id })}
                style={({ pressed }) => [styles.countRow, pressed && styles.pressed]}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="body">{opt.dishName || 'Untitled dish'}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {opt.course || 'Other'}
                  </AppText>
                </View>
                <View style={styles.countRight}>
                  <Pill label={`${counts[opt.id] || 0}`} tone="neutral" />
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
              </Pressable>
            ))}
        </Card>
      ) : null}

      <Card>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          Guests
        </AppText>
        {guestsSorted.length === 0 ? (
          <AppText variant="bodySmall" color="textMuted">
            Add a few guests first, then come back here to set meal choices.
          </AppText>
        ) : null}
        {guestsSorted.map((guest) => {
          const opt = guest.mealChoiceId ? mealOptionById?.[guest.mealChoiceId] : null;
          const hasNotes = Boolean(String(guest.dietaryNotes || '').trim());
          return (
            <Pressable
              key={guest.id}
              onPress={() => openEdit(guest)}
              hitSlop={6}
              style={({ pressed }) => [styles.guestRow, pressed && styles.pressed]}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="body" numberOfLines={1} style={{ marginBottom: 2 }}>
                  {guest.fullName || 'Unnamed guest'}
                </AppText>
                <AppText variant="caption" color="textMuted" numberOfLines={1}>
                  {opt ? opt.dishName : 'No meal chosen'}
                  {hasNotes ? ' · dietary notes' : ''}
                </AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          );
        })}
      </Card>

      <ModalCard
        visible={editModal.open}
        title={selectedGuest?.fullName ? `Meal for ${selectedGuest.fullName}` : 'Set meal choice'}
        onClose={closeEdit}
      >
        <SelectField
          label="Meal choice"
          valueLabel={mealLabel}
          placeholder="No meal chosen"
          onPress={() => setMealModalOpen(true)}
          style={{ marginBottom: spacing.lg }}
        />
        <TextField
          label="Dietary notes"
          value={editForm.dietaryNotes}
          onChangeText={(value) => setEditForm((prev) => ({ ...prev, dietaryNotes: value }))}
          placeholder="Allergies, preferences…"
          multiline
        />
        <Button label="Save" onPress={saveEdit} style={{ marginTop: spacing.lg }} />

        <ModalCard visible={mealModalOpen} title="Choose a meal" onClose={() => setMealModalOpen(false)}>
          <Pressable
            style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
            onPress={() => {
              setEditForm((prev) => ({ ...prev, mealChoiceId: undefined }));
              setMealModalOpen(false);
            }}
          >
            <AppText variant="body">No meal chosen</AppText>
            {!editForm.mealChoiceId ? <Ionicons name="checkmark" size={18} color={colors.accent} /> : null}
          </Pressable>
          {mealOptions
            .slice()
            .sort((a, b) => String(a.course || '').localeCompare(String(b.course || ''), undefined, { sensitivity: 'base' }) || String(a.dishName || '').localeCompare(String(b.dishName || ''), undefined, { sensitivity: 'base' }))
            .map((opt) => (
              <Pressable
                key={opt.id}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                onPress={() => {
                  setEditForm((prev) => ({ ...prev, mealChoiceId: opt.id }));
                  setMealModalOpen(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="body">{opt.dishName || 'Untitled dish'}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {opt.course || 'Other'}
                  </AppText>
                </View>
                {editForm.mealChoiceId === opt.id ? <Ionicons name="checkmark" size={18} color={colors.accent} /> : null}
              </Pressable>
            ))}
        </ModalCard>
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryTile: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 18,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minWidth: 120,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: spacing.sm,
  },
  countRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: spacing.sm,
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
