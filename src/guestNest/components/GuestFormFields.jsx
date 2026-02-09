import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import { Button, ChoiceChip, ModalCard, SelectField, TextField } from './GuestNestUi';

const DEFAULT_GROUP_SUGGESTIONS = [
  'Friend',
  'Immediate Family',
  'Extended Family',
  'Plus One',
  'Grandparents',
  'Bridal Party',
];

const sortByName = (items = []) =>
  [...(items || [])].sort((a, b) =>
    String(a?.name || '')
      .trim()
      .localeCompare(String(b?.name || '').trim(), undefined, { sensitivity: 'base' }),
  );

const groupMealOptions = (options = []) => {
  const grouped = { Starter: [], Main: [], Dessert: [], Other: [] };
  (options || []).forEach((opt) => {
    const course = opt?.course || 'Other';
    if (!grouped[course]) grouped[course] = [];
    grouped[course].push(opt);
  });
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) =>
      String(a?.dishName || '')
        .trim()
        .localeCompare(String(b?.dishName || '').trim(), undefined, { sensitivity: 'base' }),
    );
  });
  return grouped;
};

export default function GuestFormFields({
  form,
  onChange,
  groups = [],
  groupById = {},
  onCreateGroup,
  mealOptions = [],
  mealOptionById = {},
}) {
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creatingGroupName, setCreatingGroupName] = useState(null);
  const [savingCustomGroup, setSavingCustomGroup] = useState(false);

  const selectedGroupName = form.groupId ? groupById?.[form.groupId]?.name : '';
  const selectedMealOption = form.mealChoiceId ? mealOptionById?.[form.mealChoiceId] : null;
  const mealValueLabel = selectedMealOption
    ? `${selectedMealOption.dishName}${selectedMealOption.course ? ` · ${selectedMealOption.course}` : ''}`
    : '';

  const groupIdByLowerName = useMemo(() => {
    const map = {};
    (groups || []).forEach((group) => {
      const name = String(group?.name || '').trim();
      if (!name) return;
      map[name.toLowerCase()] = group.id;
    });
    return map;
  }, [groups]);

  const defaultSuggestionSet = useMemo(
    () => new Set(DEFAULT_GROUP_SUGGESTIONS.map((name) => name.toLowerCase())),
    [],
  );

  const sortedGroups = useMemo(() => sortByName(groups), [groups]);
  const customGroups = useMemo(
    () =>
      sortedGroups.filter((group) => {
        const lower = String(group?.name || '').trim().toLowerCase();
        return lower && !defaultSuggestionSet.has(lower);
      }),
    [defaultSuggestionSet, sortedGroups],
  );
  const groupedMeals = useMemo(() => groupMealOptions(mealOptions), [mealOptions]);

  const handleSelectGroup = (groupId) => {
    onChange({ groupId: groupId || undefined });
    setGroupModalOpen(false);
  };

  const handleSelectSuggestedGroup = async (name) => {
    if (creatingGroupName) return;
    const trimmed = String(name || '').trim();
    if (!trimmed) return;
    const existingId = groupIdByLowerName[trimmed.toLowerCase()];
    if (existingId) {
      handleSelectGroup(existingId);
      return;
    }
    if (typeof onCreateGroup !== 'function') return;
    setCreatingGroupName(trimmed);
    try {
      const createdId = await onCreateGroup(trimmed);
      if (createdId) {
        handleSelectGroup(createdId);
      }
    } finally {
      setCreatingGroupName(null);
    }
  };

  const handleSaveCustomGroup = async () => {
    if (savingCustomGroup || creatingGroupName) return;
    const trimmed = String(newGroupName || '').trim();
    if (!trimmed) return;
    if (typeof onCreateGroup !== 'function') return;
    setSavingCustomGroup(true);
    try {
      const createdId = await onCreateGroup(trimmed);
      if (createdId) {
        onChange({ groupId: createdId });
        setAddGroupModalOpen(false);
        setNewGroupName('');
      }
    } finally {
      setSavingCustomGroup(false);
    }
  };

  return (
    <View>
      <TextField
        label="Full name *"
        value={form.fullName}
        onChangeText={(value) => onChange({ fullName: value })}
        placeholder="e.g. Alex Johnson"
        style={{ marginBottom: spacing.lg }}
      />

      <SelectField
        label="Group"
        valueLabel={selectedGroupName || (form.groupId ? 'Unknown group' : '')}
        placeholder="No group"
        onPress={() => setGroupModalOpen(true)}
        style={{ marginBottom: spacing.lg }}
      />

      <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
        RSVP status
      </AppText>
      <View style={styles.chipRow}>
        {['Pending', 'Yes', 'No'].map((status) => {
          const tone = status === 'Yes' ? 'success' : status === 'No' ? 'danger' : 'accent';
          return (
            <ChoiceChip
              key={status}
              label={status}
              selected={form.rsvpStatus === status}
              tone={tone}
              onPress={() => onChange({ rsvpStatus: status })}
            />
          );
        })}
      </View>

      <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6, marginTop: 6 }}>
        Guest category
      </AppText>
      <View style={styles.chipRow}>
        <ChoiceChip
          label="Not set"
          selected={form.guestCategory === null}
          onPress={() => onChange({ guestCategory: null })}
        />
        {['Day', 'Evening', 'Both'].map((cat) => (
          <ChoiceChip
            key={cat}
            label={cat}
            selected={form.guestCategory === cat}
            tone="accent"
            onPress={() => onChange({ guestCategory: cat })}
          />
        ))}
      </View>

      <SelectField
        label="Meal choice"
        valueLabel={mealValueLabel}
        placeholder="No meal chosen"
        onPress={() => setMealModalOpen(true)}
        style={{ marginBottom: spacing.lg }}
      />

      <TextField
        label="Dietary notes"
        value={form.dietaryNotes}
        onChangeText={(value) => onChange({ dietaryNotes: value })}
        placeholder="Allergies, preferences, anything to note…"
        multiline
        style={{ marginBottom: spacing.lg }}
      />

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 4 }}>
            Plus-one allowed
          </AppText>
          <AppText variant="caption">Keep it flexible — you can adjust anytime.</AppText>
        </View>
        <Switch
          value={Boolean(form.plusOneAllowed)}
          onValueChange={(value) => onChange({ plusOneAllowed: value })}
          trackColor={{ false: 'rgba(0,0,0,0.12)', true: 'rgba(255,155,133,0.55)' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <TextField
        label="Email"
        value={form.email}
        onChangeText={(value) => onChange({ email: value })}
        placeholder="Optional"
        keyboardType="email-address"
        style={{ marginBottom: spacing.lg }}
      />
      <TextField
        label="Phone"
        value={form.phone}
        onChangeText={(value) => onChange({ phone: value })}
        placeholder="Optional"
        keyboardType="phone-pad"
        style={{ marginBottom: spacing.lg }}
      />
      <TextField
        label="Address"
        value={form.address}
        onChangeText={(value) => onChange({ address: value })}
        placeholder="Optional"
        multiline
        style={{ marginBottom: spacing.lg }}
      />
      <TextField
        label="Notes"
        value={form.notes}
        onChangeText={(value) => onChange({ notes: value })}
        placeholder="Anything else you’d like to remember…"
        multiline
        style={{ marginBottom: spacing.md }}
      />

      <ModalCard
        visible={groupModalOpen}
        title="Choose a group"
        onClose={() => setGroupModalOpen(false)}
      >
        <Pressable
          style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
          onPress={() => handleSelectGroup(undefined)}
        >
          <AppText variant="body">No group</AppText>
          {!form.groupId ? (
            <Ionicons name="checkmark" size={18} color={colors.accent} />
          ) : null}
        </Pressable>

        <View style={{ marginTop: spacing.md }}>
          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
            Suggested
          </AppText>
          {DEFAULT_GROUP_SUGGESTIONS.map((name) => {
            const existingId = groupIdByLowerName[name.toLowerCase()];
            const isSelected = Boolean(existingId && form.groupId === existingId);
            const isCreating = creatingGroupName === name;
            return (
              <Pressable
                key={name}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                onPress={() => handleSelectSuggestedGroup(name)}
              >
                <AppText variant="body">{name}</AppText>
                {isCreating ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : isSelected ? (
                  <Ionicons name="checkmark" size={18} color={colors.accent} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {customGroups.length ? (
          <View style={{ marginTop: spacing.md }}>
            <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
              Custom
            </AppText>
            {customGroups.map((group) => (
              <Pressable
                key={group.id}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                onPress={() => handleSelectGroup(group.id)}
              >
                <AppText variant="body">{group.name || 'Untitled group'}</AppText>
                {form.groupId === group.id ? (
                  <Ionicons name="checkmark" size={18} color={colors.accent} />
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
          onPress={() => {
            setGroupModalOpen(false);
            setAddGroupModalOpen(true);
          }}
        >
          <View style={styles.addRowLeft}>
            <View style={styles.addIconBubble}>
              <Ionicons name="add" size={16} color={colors.accent} />
            </View>
            <AppText variant="body">Add custom group</AppText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      </ModalCard>

      <ModalCard
        visible={addGroupModalOpen}
        title="Add a group"
        onClose={() => {
          setAddGroupModalOpen(false);
          setNewGroupName('');
        }}
      >
        <TextField
          label="Group name *"
          value={newGroupName}
          onChangeText={setNewGroupName}
          placeholder="e.g. School friends"
          style={{ marginBottom: spacing.lg }}
        />
        <Button
          label={savingCustomGroup ? 'Saving…' : 'Save group'}
          onPress={handleSaveCustomGroup}
          disabled={savingCustomGroup || !newGroupName.trim()}
          style={{ marginBottom: spacing.md }}
        />
        <Button
          label="Cancel"
          variant="secondary"
          onPress={() => {
            setAddGroupModalOpen(false);
            setNewGroupName('');
          }}
          disabled={savingCustomGroup}
        />
      </ModalCard>

      <ModalCard visible={mealModalOpen} title="Choose a meal" onClose={() => setMealModalOpen(false)}>
        <Pressable
          style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
          onPress={() => {
            onChange({ mealChoiceId: undefined });
            setMealModalOpen(false);
          }}
        >
          <AppText variant="body">No meal chosen</AppText>
          {!form.mealChoiceId ? (
            <Ionicons name="checkmark" size={18} color={colors.accent} />
          ) : null}
        </Pressable>

        {mealOptions.length ? (
          Object.entries(groupedMeals).map(([course, options]) => {
            if (!options.length) return null;
            return (
              <View key={course} style={{ marginTop: spacing.md }}>
                <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
                  {course}
                </AppText>
                {options.map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                    onPress={() => {
                      onChange({ mealChoiceId: opt.id });
                      setMealModalOpen(false);
                    }}
                  >
                    <AppText variant="body">{opt.dishName || 'Untitled dish'}</AppText>
                    {form.mealChoiceId === opt.id ? (
                      <Ionicons name="checkmark" size={18} color={colors.accent} />
                    ) : null}
                  </Pressable>
                ))}
              </View>
            );
          })
        ) : (
          <View style={styles.helperRow}>
            <AppText variant="bodySmall" color="textMuted">
              No meal options yet — add them in Settings when you’re ready.
            </AppText>
          </View>
        )}
      </ModalCard>
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
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
  helperRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  addRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
