import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ChoiceChip, ModalCard, SelectField, ToastBanner } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const parseLines = (text) =>
  String(text || '')
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

export default function BulkAddGuestsScreen({ navigation }) {
  const { state, groupById, actions } = useGuestNest();
  const groups = state.groups || [];

  const [text, setText] = useState('');
  const [defaults, setDefaults] = useState({
    rsvpStatus: 'Pending',
    guestCategory: null,
    groupId: undefined,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const count = useMemo(() => parseLines(text).length, [text]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2000);
  };

  const groupLabel = defaults.groupId ? groupById?.[defaults.groupId]?.name : '';

  const addAll = async () => {
    const names = parseLines(text);
    if (names.length === 0 || saving) return;
    setSaving(true);
    try {
      await actions.bulkAddGuests(names, {
        rsvpStatus: defaults.rsvpStatus,
        guestCategory: defaults.guestCategory,
        groupId: defaults.groupId,
      });
      showToast('Guests added');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigation.replace('GuestList');
      }, 1400);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <GuestNestHeader title="Bulk Add" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ToastBanner visible={toast.visible} message={toast.message} />

        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            Paste guest names
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.md }}>
            One name per line. We’ll trim blanks and skip empty rows.
          </AppText>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={'Alex Johnson\nSam Patel\nTaylor Smith'}
            placeholderTextColor="rgba(43,43,43,0.28)"
            multiline
            style={styles.textarea}
          />
          <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.sm }}>
            {count} {count === 1 ? 'guest' : 'guests'} ready
          </AppText>
        </Card>

        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>
            Optional defaults
          </AppText>

          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
            RSVP default
          </AppText>
          <View style={styles.chipRow}>
            {['Pending', 'Yes', 'No'].map((status) => (
              <ChoiceChip
                key={status}
                label={status}
                selected={defaults.rsvpStatus === status}
                tone={status === 'Yes' ? 'success' : status === 'No' ? 'danger' : 'accent'}
                onPress={() => setDefaults((prev) => ({ ...prev, rsvpStatus: status }))}
              />
            ))}
          </View>

          <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
            Guest category default
          </AppText>
          <View style={styles.chipRow}>
            <ChoiceChip
              label="Not set"
              selected={defaults.guestCategory === null}
              onPress={() => setDefaults((prev) => ({ ...prev, guestCategory: null }))}
            />
            {['Day', 'Evening', 'Both'].map((cat) => (
              <ChoiceChip
                key={cat}
                label={cat}
                selected={defaults.guestCategory === cat}
                tone="accent"
                onPress={() => setDefaults((prev) => ({ ...prev, guestCategory: cat }))}
              />
            ))}
          </View>

          <SelectField
            label="Group default"
            valueLabel={groupLabel}
            placeholder="No group"
            onPress={() => setGroupModalOpen(true)}
          />
        </Card>

        <Button
          label={saving ? 'Adding…' : `Add All Guests${count ? ` (${count})` : ''}`}
          onPress={addAll}
          disabled={saving || count === 0}
          style={{ marginBottom: spacing.md }}
        />
        <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} disabled={saving} />
        <View style={{ height: spacing.jumbo }} />

        <ModalCard visible={groupModalOpen} title="Choose a group default" onClose={() => setGroupModalOpen(false)}>
          <Pressable
            style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
            onPress={() => {
              setDefaults((prev) => ({ ...prev, groupId: undefined }));
              setGroupModalOpen(false);
            }}
          >
            <AppText variant="body">No group</AppText>
            {!defaults.groupId ? <Ionicons name="checkmark" size={18} color={colors.accent} /> : null}
          </Pressable>
          {groups
            .slice()
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' }))
            .map((group) => (
              <Pressable
                key={group.id}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                onPress={() => {
                  setDefaults((prev) => ({ ...prev, groupId: group.id }));
                  setGroupModalOpen(false);
                }}
              >
                <AppText variant="body">{group.name || 'Untitled group'}</AppText>
                {defaults.groupId === group.id ? (
                  <Ionicons name="checkmark" size={18} color={colors.accent} />
                ) : null}
              </Pressable>
            ))}
        </ModalCard>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  textarea: {
    backgroundColor: '#FFFDFB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: colors.text,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
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
