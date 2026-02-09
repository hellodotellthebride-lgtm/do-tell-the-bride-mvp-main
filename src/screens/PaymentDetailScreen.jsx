import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../theme';
import { PAYMENT_TYPES, deletePayment, loadBudgetState, updatePayment } from '../budget/budgetStorage';

const paymentTypeLabels = {
  deposit: 'Deposit',
  instalment: 'Instalment',
  final: 'Final Balance',
  other: 'Other',
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '£0';
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  } catch (error) {
    return `£${Number(value || 0).toLocaleString('en-GB')}`;
  }
};

const parseCurrencyInput = (value) => {
  if (!value) return 0;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) return 0;
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

export default function PaymentDetailScreen({ navigation, route }) {
  const paymentId = route?.params?.paymentId;
  const [state, setState] = useState({ payments: [] });
  const [form, setForm] = useState({
    vendorName: '',
    amount: '',
    dueDate: '',
    paymentType: '',
    status: 'pending',
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('idle');
  const [readyToExit, setReadyToExit] = useState(false);
  const [typePickerVisible, setTypePickerVisible] = useState(false);

  const hydrate = useCallback(() => {
    loadBudgetState().then((stored) => {
      setState({ payments: stored.payments || [] });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate]),
  );

  const payment = useMemo(
    () => (state.payments || []).find((item) => item.id === paymentId),
    [state.payments, paymentId],
  );

  useEffect(() => {
    if (payment) {
      setForm({
        vendorName: payment.vendorName || '',
        amount: String(payment.amount || ''),
        dueDate: payment.dueDate ? formatDateForInput(payment.dueDate) : '',
        paymentType: payment.paymentType || '',
        status: payment.status || 'pending',
      });
      setStatus('idle');
      setReadyToExit(false);
    }
  }, [payment]);

  useEffect(() => {
    if (status === 'saved') {
      setReadyToExit(false);
      const timeout = setTimeout(() => {
        setReadyToExit(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
    setReadyToExit(false);
    return undefined;
  }, [status]);

  if (!paymentId) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Text style={styles.centeredText}>No payment selected.</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Back to Payments</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (!payment) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Text style={styles.centeredText}>We couldn’t find that payment.</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Back to Payments</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const amountValue = parseCurrencyInput(form.amount);
  const parsedDueDate = parseDateString(form.dueDate);
  const isValid = amountValue > 0 && parsedDueDate;

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Missing details', 'Add a valid amount and due date to continue.');
      return;
    }
    setSaving(true);
    updatePayment(paymentId, {
      vendorName: form.vendorName?.trim() || '',
      amount: amountValue,
      dueDate: parsedDueDate.toISOString(),
      paymentType: form.paymentType || 'other',
      status: form.status,
    })
      .then(() => {
        setStatus('saved');
      })
      .finally(() => setSaving(false));
  };

  const handlePrimaryAction = () => {
    if (status === 'saved' && readyToExit) {
      navigation.navigate('PaymentSchedule', { flash: 'Payment updated' });
      return;
    }
    handleSave();
  };

  const handleDelete = () => {
    Alert.alert('Delete this payment?', 'This will permanently remove this payment.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePayment(paymentId).then(() => {
            navigation.navigate('PaymentSchedule', { flash: 'Payment removed' });
          });
        },
      },
    ]);
  };

  const selectedTypeLabel =
    paymentTypeLabels[form.paymentType] || (form.paymentType ? form.paymentType : 'Choose type');

  return (
    <Screen scroll>
      <View style={styles.page}>
        <Pressable onPress={() => navigation.navigate('PaymentSchedule')} style={styles.backRow} hitSlop={8}>
          <Text style={styles.backText}>← Back to Payments</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>{form.vendorName || 'Payment details'}</Text>
          <Text style={styles.amountBig}>{formatCurrency(amountValue)}</Text>
        </View>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusPill,
              form.status === 'paid' ? styles.statusPillPaid : styles.statusPillPending,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                form.status === 'paid' ? styles.statusPillTextPaid : styles.statusPillTextPending,
              ]}
            >
              {form.status === 'paid' ? 'PAID' : 'PENDING'}
            </Text>
          </View>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Payment details</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Vendor name</Text>
            <TextInput
              style={styles.input}
              value={form.vendorName}
              onChangeText={(text) => setForm((prev) => ({ ...prev, vendorName: text }))}
              placeholder="Add vendor"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
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
              value={form.dueDate}
              onChangeText={(text) => setForm((prev) => ({ ...prev, dueDate: text }))}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Payment type</Text>
            <Pressable style={styles.dropdownRow} onPress={() => setTypePickerVisible(true)}>
              <Text style={styles.dropdownValue}>{selectedTypeLabel}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
          <View style={styles.checkboxRow}>
            <Pressable
              style={[
                styles.checkbox,
                form.status === 'paid' ? styles.checkboxChecked : undefined,
              ]}
              onPress={() =>
                setForm((prev) => ({ ...prev, status: prev.status === 'paid' ? 'pending' : 'paid' }))
              }
            >
              {form.status === 'paid' ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
            </Pressable>
            <Text style={styles.checkboxLabel}>Mark as paid</Text>
          </View>
          <Pressable
            style={[
              styles.saveButton,
              status === 'saved' && !saving && readyToExit && styles.saveButtonNeutral,
              status === 'saved' && !readyToExit && styles.saveButtonSuccess,
              (!isValid || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handlePrimaryAction}
            disabled={!isValid || saving}
          >
            {status === 'saved' ? (
              readyToExit ? (
                <Text style={styles.saveButtonTextNeutral}>Go back</Text>
              ) : (
                <View style={styles.saveButtonContent}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.saveButtonText}>Changes saved</Text>
                </View>
              )
            ) : (
              <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save changes'}</Text>
            )}
          </Pressable>
        </View>
        <View style={[styles.formCard, styles.deleteCard]}>
          <Text style={styles.sectionLabel}>Delete payment</Text>
          <Text style={styles.deleteCopy}>This will permanently remove this payment.</Text>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Payment</Text>
          </Pressable>
        </View>
      </View>
      <OptionSheet
        title="Choose payment type"
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
    </Screen>
  );
}

const formatDateForInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

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
    gap: spacing.lg,
  },
  backRow: {
    marginBottom: spacing.xs,
  },
  backText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  amountBig: {
    fontSize: 22,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusPillPending: {
    backgroundColor: '#FFF4F2',
  },
  statusPillPaid: {
    backgroundColor: '#E8F2ED',
  },
  statusPillText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  statusPillTextPending: {
    color: '#B64C40',
  },
  statusPillTextPaid: {
    color: colors.success,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  sectionLabel: {
    fontSize: 16,
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
  dropdownRow: {
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E4DCD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxLabel: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  saveButton: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  saveButtonSuccess: {
    backgroundColor: colors.success,
  },
  saveButtonNeutral: {
    backgroundColor: '#F3EFEB',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Outfit_600SemiBold',
  },
  saveButtonTextNeutral: {
    color: colors.text,
    fontFamily: 'Outfit_600SemiBold',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deleteCard: {
    backgroundColor: '#FFF9F6',
  },
  deleteCopy: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  deleteButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E4C7BF',
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#B64C40',
    fontFamily: 'Outfit_600SemiBold',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  centeredText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  linkText: {
    color: colors.accent,
    fontFamily: 'Outfit_500Medium',
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
