import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing } from '../../theme';

const QuoteModal = ({
  visible,
  initialValue,
  categories,
  onClose,
  onSave,
  onCreateCategory,
  onRemoveCategory,
  onDelete,
}) => {
  const [vendorName, setVendorName] = useState(initialValue?.vendorName || '');
  const [categoryId, setCategoryId] = useState(initialValue?.categoryId || null);
  const [amountText, setAmountText] = useState(
    initialValue ? String(initialValue.amount || 0) : '0',
  );
  const [status, setStatus] = useState(initialValue?.status || 'considering');
  const [phone, setPhone] = useState(initialValue?.phone || '');
  const [email, setEmail] = useState(initialValue?.email || '');
  const [notes, setNotes] = useState(initialValue?.notes || '');
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [customCategoryVisible, setCustomCategoryVisible] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    setVendorName(initialValue?.vendorName || '');
    setCategoryId(initialValue?.categoryId || null);
    setAmountText(initialValue ? String(initialValue.amount || 0) : '0');
    setStatus(initialValue?.status || 'considering');
    setPhone(initialValue?.phone || '');
    setEmail(initialValue?.email || '');
    setNotes(initialValue?.notes || '');
  }, [initialValue, visible]);

  useEffect(() => {
    setLocalCategories(categories || []);
  }, [categories]);

  useEffect(() => {
    if (!visible) {
      setCategoryPickerVisible(false);
      setCustomCategoryVisible(false);
      setCustomCategoryName('');
    }
  }, [visible]);

  const amountValue = Number(amountText.replace(/[^0-9.]/g, ''));
  const isValid = vendorName.trim() && amountValue > 0;

  const categoryOptions = useMemo(
    () => [{ id: null, label: 'No category' }, ...(localCategories || []).map((cat) => ({ id: cat.id, label: cat.label }))],
    [localCategories],
  );

  const handleSubmit = () => {
    if (!isValid) return;
    onSave({
      vendorName: vendorName.trim(),
      amount: amountValue,
      categoryId,
      status,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    });
  };

  const handleCreateCustomCategory = async () => {
    const trimmed = customCategoryName.trim();
    if (!trimmed || creatingCategory || !onCreateCategory) return;
    setCreatingCategory(true);
    try {
      const created = await onCreateCategory(trimmed);
      if (created?.id) {
        setCategoryId(created.id);
        setLocalCategories((prev) => {
          const exists = prev.find((cat) => cat.id === created.id);
          return exists ? prev : [...prev, created];
        });
        setCustomCategoryVisible(false);
        setCustomCategoryName('');
        setCategoryPickerVisible(false);
      }
    } finally {
      setCreatingCategory(false);
    }
  };

  const selectedCategoryLabel =
    categoryOptions.find((option) => option.id === categoryId)?.label || 'No category';

  const selectedCategory = useMemo(
    () => (categories || []).find((cat) => cat.id === categoryId),
    [categories, categoryId],
  );

  const canRemoveSelected =
    !!selectedCategory?.createdManually && typeof onRemoveCategory === 'function';

  const canDeleteQuote = Boolean(initialValue && typeof onDelete === 'function');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheet}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sheetTitle}>{initialValue ? 'Edit Quote' : 'Add Quote'}</Text>
          <TextInput
            value={vendorName}
            onChangeText={setVendorName}
            placeholder="Vendor name"
            style={styles.input}
          />
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>£</Text>
            <TextInput
              value={amountText}
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9.]/g, '');
                setAmountText(numeric ? numeric : '');
              }}
              keyboardType="numeric"
              placeholder="0"
              style={[styles.input, styles.amountInput]}
            />
          </View>
          <View style={[styles.fieldGroup, styles.spacedGroup]}>
            <Text style={styles.label}>Category</Text>
            <Pressable
              style={styles.dropdownRow}
              onPress={() => setCategoryPickerVisible(true)}
            >
              <Text style={styles.dropdownValue}>{selectedCategoryLabel}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
            </Pressable>
            <View style={styles.customCategoryWrapper}>
              <View style={styles.chipRow}>
                <Pressable
                  style={[styles.chip, customCategoryVisible && styles.chipActive]}
                  onPress={() => setCustomCategoryVisible((prev) => !prev)}
                >
                  <Ionicons
                    name="add"
                    size={14}
                    color={customCategoryVisible ? colors.accent : colors.textMuted}
                  />
                  <Text
                    style={[styles.chipText, customCategoryVisible && styles.chipTextActive]}
                  >
                    Custom
                  </Text>
                </Pressable>
                {canRemoveSelected ? (
                  <Pressable
                    style={[styles.chip, styles.deleteChip]}
                    onPress={() => onRemoveCategory?.(selectedCategory.id)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#B64C40" />
                    <Text style={[styles.chipText, styles.deleteChipText]}>Remove</Text>
                  </Pressable>
                ) : null}
              </View>
              {customCategoryVisible ? (
                <View style={styles.customInputRow}>
                  <TextInput
                    value={customCategoryName}
                    onChangeText={setCustomCategoryName}
                    placeholder="Category name"
                    style={[styles.input, { flex: 1 }]}
                  />
                  <Pressable
                    style={[
                      styles.inlineButton,
                      (!customCategoryName.trim() || creatingCategory) && styles.inlineButtonDisabled,
                    ]}
                    onPress={handleCreateCustomCategory}
                    disabled={!customCategoryName.trim() || creatingCategory}
                  >
                    <Text style={styles.inlineButtonText}>{creatingCategory ? 'Adding…' : 'Add'}</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>
          <View style={[styles.fieldGroup, styles.spacedGroup]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.chipRow}>
              {['considering', 'booked', 'declined'].map((option) => {
                const active = option === status;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setStatus(option)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option === 'considering'
                        ? 'Considering'
                        : option === 'booked'
                        ? 'Booked'
                        : 'Declined'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone (optional)"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email (optional)"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="What’s included"
            style={[styles.input, styles.notesInput]}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.actions}>
            <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={onClose}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                styles.primaryButton,
                !isValid && styles.primaryButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.primaryText}>{initialValue ? 'Save Quote' : 'Add Quote'}</Text>
            </Pressable>
            {canDeleteQuote ? (
              <Pressable
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete?.(initialValue?.id)}
              >
                <Text style={styles.deleteText}>Delete quote</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
        <Modal visible={categoryPickerVisible} transparent animationType="fade">
          <View style={styles.selectBackdrop}>
            <View style={styles.selectCard}>
              <Text style={styles.selectTitle}>Choose category</Text>
              <ScrollView style={{ maxHeight: 280 }}>
                {categoryOptions.map((option) => {
                  const active = option.id === categoryId;
                  return (
                    <Pressable
                      key={option.id ?? 'none'}
                      style={styles.selectRow}
                      onPress={() => {
                        setCategoryId(option.id);
                        setCategoryPickerVisible(false);
                      }}
                    >
                      <Text style={styles.selectLabel}>{option.label}</Text>
                      {active ? (
                        <Ionicons name="checkmark" size={16} color={colors.accent} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Pressable
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => setCategoryPickerVisible(false)}
              >
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheetScroll: {
    marginTop: spacing.xl,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currencySymbol: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    color: colors.textMuted,
  },
  amountInput: {
    flex: 1,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  spacedGroup: {
    marginTop: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dropdownValue: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  customCategoryWrapper: {
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.accent,
  },
  deleteChip: {
    borderColor: '#F3D3CF',
    backgroundColor: '#FFF4F2',
  },
  deleteChipText: {
    color: '#B64C40',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inlineButton: {
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inlineButtonDisabled: {
    opacity: 0.5,
  },
  inlineButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_600SemiBold',
  },
  notesInput: {
    minHeight: 120,
  },
  actions: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'stretch',
  },
  actionButton: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    width: '100%',
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
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_600SemiBold',
  },
  deleteButton: {
    backgroundColor: '#FFF4F2',
    borderWidth: 1,
    borderColor: '#F3D3CF',
  },
  deleteText: {
    color: '#B64C40',
    fontFamily: 'Outfit_600SemiBold',
  },
  selectBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  selectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  selectTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  selectLabel: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
});

export default QuoteModal;
