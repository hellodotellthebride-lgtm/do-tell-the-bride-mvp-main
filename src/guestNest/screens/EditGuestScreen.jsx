import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ToastBanner } from '../components/GuestNestUi';
import GuestFormFields from '../components/GuestFormFields';
import { useGuestNest } from '../GuestNestProvider';

const toForm = (guest) => ({
  fullName: guest?.fullName || '',
  groupId: guest?.groupId,
  rsvpStatus: guest?.rsvpStatus || 'Pending',
  guestCategory: guest?.guestCategory ?? null,
  plusOneAllowed: Boolean(guest?.plusOneAllowed),
  mealChoiceId: guest?.mealChoiceId,
  dietaryNotes: guest?.dietaryNotes || '',
  email: guest?.email || '',
  phone: guest?.phone || '',
  address: guest?.address || '',
  notes: guest?.notes || '',
});

export default function EditGuestScreen({ navigation, route }) {
  const guestId = route?.params?.guestId;
  const { state, groupById, mealOptionById, actions } = useGuestNest();
  const guest = useMemo(
    () => (state.guests || []).find((g) => g.id === guestId),
    [guestId, state.guests],
  );
  const [form, setForm] = useState(() => toForm(guest));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const timeoutRef = useRef(null);

  useEffect(() => {
    setForm(toForm(guest));
  }, [guestId, guest]);

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

  const save = async () => {
    if (!guestId || !canSave || saving) return;
    setSaving(true);
    try {
      await actions.updateGuest(guestId, {
        fullName: form.fullName,
        groupId: form.groupId ?? null,
        rsvpStatus: form.rsvpStatus,
        guestCategory: form.guestCategory,
        plusOneAllowed: form.plusOneAllowed,
        mealChoiceId: form.mealChoiceId ?? null,
        dietaryNotes: form.dietaryNotes,
        email: form.email,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
      });
      showToast('Saved');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!guestId) return;
    Alert.alert(
      'Remove this guest?',
      'This will remove them from your Guest Nest list. You can always add them again later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            actions.deleteGuest(guestId).then(() => navigation.goBack());
          },
        },
      ],
    );
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

  if (!guestId || !guest) {
    return (
      <Screen>
        <GuestNestHeader title="Edit Guest" onBack={() => navigation.goBack()} />
        <Card>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            Guest not found
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            We couldn’t find that guest. It may have been removed on another screen.
          </AppText>
          <Button label="Back to Guest List" onPress={() => navigation.navigate('GuestList')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <GuestNestHeader title="Edit Guest" onBack={() => navigation.goBack()} />
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
          label={saving ? 'Saving…' : 'Save Changes'}
          onPress={save}
          disabled={!canSave || saving}
          style={{ marginBottom: spacing.md }}
        />
        <Button label="Remove Guest" variant="secondary" onPress={confirmDelete} disabled={saving} />
        <View style={{ height: spacing.jumbo }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
