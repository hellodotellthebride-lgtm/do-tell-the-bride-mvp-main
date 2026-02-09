import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ToastBanner } from '../components/GuestNestUi';
import GuestFormFields from '../components/GuestFormFields';
import { useGuestNest } from '../GuestNestProvider';

const buildEmptyForm = () => ({
  fullName: '',
  groupId: undefined,
  rsvpStatus: 'Pending',
  guestCategory: null,
  plusOneAllowed: false,
  mealChoiceId: undefined,
  dietaryNotes: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
});

export default function AddGuestScreen({ navigation }) {
  const { state, groupById, mealOptionById, actions } = useGuestNest();
  const [form, setForm] = useState(buildEmptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const canSave = useMemo(() => Boolean(form.fullName?.trim()), [form.fullName]);

  const handleChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const showToast = (message) => {
    setToast({ visible: true, message });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2000);
  };

  const save = async ({ addAnother } = {}) => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await actions.addGuest({
        fullName: form.fullName,
        groupId: form.groupId,
        rsvpStatus: form.rsvpStatus,
        guestCategory: form.guestCategory,
        plusOneAllowed: form.plusOneAllowed,
        mealChoiceId: form.mealChoiceId,
        dietaryNotes: form.dietaryNotes,
        email: form.email,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
      });
      showToast('Saved');
      if (addAnother) {
        setForm(buildEmptyForm());
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const createGroup = async (name) => {
    const trimmed = String(name || '').trim();
    if (!trimmed) return undefined;
    try {
      const next = await actions.addGroup(trimmed);
      const match = (next.groups || []).find(
        (group) => String(group?.name || '').trim().toLowerCase() === trimmed.toLowerCase(),
      );
      return match?.id;
    } catch (error) {
      console.warn('[guestNest] unable to add group', error);
      return undefined;
    }
  };

  return (
    <Screen>
      <GuestNestHeader title="Add Guest" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ToastBanner visible={toast.visible} message={toast.message} />

        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>
            Guest details
          </AppText>
          <GuestFormFields
            form={form}
            onChange={handleChange}
            groups={state.groups || []}
            groupById={groupById}
            onCreateGroup={createGroup}
            mealOptions={state.mealOptions || []}
            mealOptionById={mealOptionById}
          />
        </Card>

        <Button
          label={saving ? 'Saving…' : 'Save Guest'}
          onPress={() => save({ addAnother: false })}
          disabled={!canSave || saving}
          style={{ marginBottom: spacing.md }}
        />
        <Button
          label={saving ? 'Saving…' : 'Save & Add Another'}
          variant="secondary"
          onPress={() => save({ addAnother: true })}
          disabled={!canSave || saving}
        />
        <View style={{ height: spacing.jumbo }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({});
