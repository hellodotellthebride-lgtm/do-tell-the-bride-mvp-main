import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, TextField, ToastBanner } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

export default function AddGuestGroupScreen({ navigation }) {
  const { actions } = useGuestNest();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const canSave = useMemo(() => Boolean(name.trim()), [name]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2000);
  };

  const save = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await actions.addGroup(name);
      showToast('Saved');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <GuestNestHeader title="Add Group" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ToastBanner visible={toast.visible} message={toast.message} />
        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>
            Group name
          </AppText>
          <TextField
            label="Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Family, Friends, Work"
          />
        </Card>
        <Button
          label={saving ? 'Saving…' : 'Save'}
          onPress={save}
          disabled={!canSave || saving}
          style={{ marginBottom: spacing.md }}
        />
        <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} disabled={saving} />
        <View style={{ height: spacing.jumbo }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

