import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../theme';
import {
  PAYMENT_TYPES,
  addBudgetCategories,
  addPayment,
  loadBudgetState,
} from '../budget/budgetStorage';
import { subscribeToCategoryChanges } from '../budget/budgetEvents';
import CategoryPickerModal from './budget/CategoryPickerModal';

const paymentTypeLabels = {
  deposit: 'Deposit',
  instalment: 'Instalment',
  final: 'Final Balance',
  other: 'Other',
};

const ADD_CATEGORY_OPTION = '__add-category';

const parseCurrencyInput = (value) => {
  if (!value) return 0;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) {
    return 0;
  }
  return numeric;
};

const parseDateString = (value) => {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4)) - 1;
  const year = Number(digits.slice(4));
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day ||
    Number.isNaN(date.getTime())
  ) {
    return null;
  }
  return date;
};

const formatDateInput = (value) => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4);
  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
};

export default function AddPaymentScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [categoryCreatorVisible, setCategoryCreatorVisible] = useState(false);
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [form, setForm] = useState({
    categoryId: null,
    vendorName: '',
    amount: '',
    dueDate: '',
    paymentType: '',
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const unsubscribe = subscribeToCategoryChanges((nextCategories, meta) => {
      setCategories(nextCategories || []);
      if (meta?.added?.length === 1) {
        setForm((prev) => ({ ...prev, categoryId: meta.added[0] }));
      }
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBudgetState().then((stored) => {
        setCategories(stored.categories || []);
      });
    }, []),
  );

  const categoryOptions = useMemo(() => {
    const base = [{ id: null, label: 'No category' }, ...(categories || [])];
    return [...base, { id: ADD_CATEGORY_OPTION, label: '+ Add a new category' }];
  }, [categories]);

  const selectedCategoryLabel =
    categoryOptions.find((option) => option.id === form.categoryId)?.label || 'Choose category';

  const selectedTypeLabel =
    paymentTypeLabels[form.paymentType] || (form.paymentType ? form.paymentType : 'Choose type');

  const amountValue = parseCurrencyInput(form.amount);
  const parsedDueDate = parseDateString(form.dueDate);
  const isValid = amountValue > 0 && parsedDueDate && form.paymentType;

  const handleSave = async () => {
    if (!isValid) {
      Alert.alert('Missing details', 'Add an amount, due date, and payment type to continue.');
      return;
    }
    setSaving(true);
    try {
      const categoryName =
        categoryOptions.find((option) => option.id === form.categoryId)?.label || '';
      await addPayment({
        categoryId: form.categoryId,
        categoryName: form.categoryId ? categoryName : '',
        vendorName: form.vendorName?.trim() || '',
        amount: amountValue,
        dueDate: parsedDueDate.toISOString(),
        paymentType: form.paymentType,
        status: 'pending',
      });
      navigation.navigate('PaymentSchedule', { flash: 'Payment saved' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategories = async (labels = []) => {
    if (!labels.length) {
      setCategoryCreatorVisible(false);
      return;
    }
    try {
      const { state: nextState, addedCategories } = await addBudgetCategories(labels);
      setCategories(nextState.categories || []);
      if (addedCategories.length === 1) {
        setForm((prev) => ({ ...prev, categoryId: addedCategories[0].id }));
      }
    } finally {
      setCategoryCreatorVisible(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.page}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow} hitSlop={8}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.pageTitle}>Payment Schedule</Text>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Payment</Text>
          <ScrollView contentContainerStyle={{ gap: spacing.md }}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category (optional)</Text>
              <Pressable
                style={styles.dropdownRow}
                onPress={() => setCategoryPickerVisible(true)}
              >
                <Text style={styles.dropdownValue}>{selectedCategoryLabel}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Vendor name (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Hair & Makeup by Kelly"
                value={form.vendorName}
                onChangeText={(text) => setForm((prev) => ({ ...prev, vendorName: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="£0.00"
                value={form.amount}
                onChangeText={(text) => setForm((prev) => ({ ...prev, amount: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Due date</Text>
              <TextInput
                style={styles.input}
                placeholder="dd/mm/yyyy"
                keyboardType="numbers-and-punctuation"
                value={formatDateInput(form.dueDate)}
                onChangeText={(text) => {
                  const digits = text.replace(/\D/g, '').slice(0, 8);
                  setForm((prev) => ({ ...prev, dueDate: digits }));
                }}
              />
              <Text style={styles.helper}>Use day/month/year format.</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Payment type</Text>
              <Pressable style={styles.dropdownRow} onPress={() => setTypePickerVisible(true)}>
                <Text style={styles.dropdownValue}>{selectedTypeLabel}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          </ScrollView>
          <View style={styles.formActions}>
            <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.primaryButton, (!isValid || saving) && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={!isValid || saving}
            >
              <Text style={styles.primaryText}>{saving ? 'Saving…' : 'Save Payment'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <OptionSheet
        title="Choose category"
        options={categoryOptions}
        visible={categoryPickerVisible}
        selectedId={form.categoryId}
        onSelect={(id) => {
          if (id === ADD_CATEGORY_OPTION) {
            setCategoryPickerVisible(false);
            setTimeout(() => setCategoryCreatorVisible(true), 150);
            return;
          }
          setForm((prev) => ({ ...prev, categoryId: id }));
          setCategoryPickerVisible(false);
        }}
        onClose={() => setCategoryPickerVisible(false)}
      />
      <OptionSheet
        title="Choose type"
        options={PAYMENT_TYPES}
        visible={typePickerVisible}
        selectedId={form.paymentType}
        labelMap={paymentTypeLabels}
        onSelect={(id) => {
          setForm((prev) => ({ ...prev, paymentType: id }));
          setTypePickerVisible(false);
        }}
        onClose={() => setTypePickerVisible(false)}
      />
      <CategoryPickerModal
        visible={categoryCreatorVisible}
        onClose={() => setCategoryCreatorVisible(false)}
        onSubmit={handleAddCategories}
      />
    </Screen>
  );
}

const OptionSheet = ({ title, options, visible, selectedId, labelMap = {}, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.sheetBackdrop} onPress={onClose}>
      <View style={styles.optionSheet}>
        <Text style={styles.optionTitle}>{title}</Text>
        <ScrollView style={{ maxHeight: 280 }}>
          {options.map((option) => {
            const active = option.id === selectedId;
            return (
              <Pressable
                key={option.id ?? 'none'}
                style={[styles.optionRow, active && styles.optionRowActive]}
                onPress={() => onSelect(option.id ?? null)}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {labelMap[option.id] || option.label}
                </Text>
                {active ? <Ionicons name="checkmark" size={16} color={colors.accent} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  page: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  backRow: {
    marginBottom: spacing.xs,
  },
  backText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: colors.text,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
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
  helper: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  dropdownRow: {
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValue: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  formActions: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
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
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  optionSheet: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  optionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  optionRowActive: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  optionText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  optionTextActive: {
    color: colors.accent,
  },
});
