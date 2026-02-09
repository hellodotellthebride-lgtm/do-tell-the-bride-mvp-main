import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing } from '../../theme';
import { COMMON_CATEGORY_OPTIONS } from '../../budget/budgetStorage';

const normalize = (label = '') => label.trim().toLowerCase();

const CategoryPickerModal = ({ visible, onClose, onSubmit }) => {
  const [selectedCommonCategories, setSelectedCommonCategories] = useState([]);
  const [customName, setCustomName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedCommonCategories([]);
      setCustomName('');
      setSubmitting(false);
    }
  }, [visible]);

  const toggleOption = (optionLabel) => {
    const trimmed = optionLabel.trim();
    setSelectedCommonCategories((prev) => {
      const exists = prev.some((item) => normalize(item) === normalize(trimmed));
      if (exists) {
        return prev.filter((item) => normalize(item) !== normalize(trimmed));
      }
      return [...prev, trimmed];
    });
  };

  const trimmedCustom = customName.trim();
  const totalSelected = selectedCommonCategories.length + (trimmedCustom ? 1 : 0);
  const primaryLabel = totalSelected <= 1 ? 'Add category' : 'Add selected categories';
  const primaryDisabled = totalSelected === 0 || submitting;

  const handleAdd = async () => {
    if (primaryDisabled || typeof onSubmit !== 'function') return;
    const combined = [...selectedCommonCategories];
    if (trimmedCustom) {
      combined.push(trimmedCustom);
    }
    const seen = new Set();
    const categoriesToAdd = [];
    combined.forEach((label) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const key = normalize(trimmed);
      if (seen.has(key)) return;
      seen.add(key);
      categoriesToAdd.push(trimmed);
    });
    if (categoriesToAdd.length === 0) {
      return;
    }
    try {
      setSubmitting(true);
      await Promise.resolve(onSubmit(categoriesToAdd));
      setSelectedCommonCategories([]);
      setCustomName('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.title}>Add a Category</Text>
          <Text style={styles.sectionLabel}>Common categories</Text>
          <ScrollView style={styles.optionsList}>
            {COMMON_CATEGORY_OPTIONS.map((option) => {
              const checked = selectedCommonCategories.some(
                (label) => normalize(label) === normalize(option.label),
              );
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionRow, checked && styles.optionRowChecked]}
                  onPress={() => toggleOption(option.label)}
                >
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={styles.dividerLabel}>Or add your own</Text>
          <TextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="Custom category name"
            style={styles.input}
          />
          <Text style={styles.helper}>Name it whatever makes sense to you.</Text>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.secondaryButton]} onPress={onClose}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.primaryButton,
                (primaryDisabled || submitting) && styles.buttonDisabled,
              ]}
              onPress={handleAdd}
              disabled={primaryDisabled || submitting}
            >
              <Text style={styles.primaryText}>
                {submitting ? 'Adding…' : primaryLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#E4DCD6',
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 1,
    color: colors.textMuted,
    fontFamily: 'Outfit_600SemiBold',
  },
  optionsList: {
    maxHeight: 240,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0E7E1',
  },
  optionRowChecked: {
    backgroundColor: colors.accentSoft,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#D7CCC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dividerLabel: {
    fontSize: 13,
    letterSpacing: 1,
    color: colors.textMuted,
    fontFamily: 'Outfit_600SemiBold',
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  helper: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#F3EFEB',
  },
  secondaryText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  primaryText: {
    color: '#fff',
    fontFamily: 'Outfit_600SemiBold',
  },
});

export default CategoryPickerModal;
