import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card, ModalCard, SelectField, TextField, ToastBanner } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const COURSES = ['Starter', 'Main', 'Dessert', 'Other'];

export default function AddMealOptionScreen({ navigation }) {
  const { actions } = useGuestNest();
  const [form, setForm] = useState({ course: 'Main', dishName: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const canSave = useMemo(() => Boolean(form.dishName?.trim()), [form.dishName]);

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
      await actions.addMealOption({ course: form.course, dishName: form.dishName });
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
      <GuestNestHeader title="Add Meal Option" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ToastBanner visible={toast.visible} message={toast.message} />

        <Card style={{ marginBottom: spacing.lg }}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>
            Details
          </AppText>
          <SelectField
            label="Course"
            valueLabel={form.course}
            onPress={() => setCourseModalOpen(true)}
            style={{ marginBottom: spacing.lg }}
          />
          <TextField
            label="Dish name *"
            value={form.dishName}
            onChangeText={(value) => setForm((prev) => ({ ...prev, dishName: value }))}
            placeholder="e.g. Herb roasted chicken"
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

        <ModalCard visible={courseModalOpen} title="Choose a course" onClose={() => setCourseModalOpen(false)}>
          {COURSES.map((course) => (
            <Pressable
              key={course}
              style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
              onPress={() => {
                setForm((prev) => ({ ...prev, course }));
                setCourseModalOpen(false);
              }}
            >
              <AppText variant="body">{course}</AppText>
              {form.course === course ? (
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

