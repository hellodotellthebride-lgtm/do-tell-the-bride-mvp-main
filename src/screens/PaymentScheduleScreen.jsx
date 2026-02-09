import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../theme';
import { PAYMENT_TYPES, loadBudgetState } from '../budget/budgetStorage';

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

const formatDateDisplay = (value) => {
  if (!value) return 'No due date yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date yet';
  try {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (error) {
    return 'No due date yet';
  }
};

const paymentTypeLabels = {
  deposit: 'Deposit',
  instalment: 'Instalment',
  final: 'Final Balance',
  other: 'Other',
};

const sortOptions = [
  { id: 'asc', label: 'Date (Soonest First)' },
  { id: 'desc', label: 'Date (Latest First)' },
];

const statusOptions = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'paid', label: 'Paid' },
];

const typeOptions = [{ id: 'all', label: 'All Types' }, ...PAYMENT_TYPES];

export default function PaymentScheduleScreen({ navigation, route }) {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    sort: 'asc',
    status: 'all',
    type: 'all',
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [banner, setBanner] = useState('');

  const loadPayments = useCallback(() => {
    loadBudgetState().then((stored) => {
      setPayments(stored.payments || []);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [loadPayments]),
  );

  useEffect(() => {
    if (route?.params?.flash) {
      setBanner(route.params.flash);
      navigation.setParams({ flash: null });
    }
  }, [route?.params?.flash, navigation]);

  const filteredPayments = useMemo(() => {
    let next = [...payments];
    if (filters.status !== 'all') {
      next = next.filter((payment) => payment.status === filters.status);
    }
    if (filters.type !== 'all') {
      next = next.filter((payment) => payment.paymentType === filters.type);
    }
    next.sort((a, b) => {
      const first = new Date(a.dueDate || 0).getTime();
      const second = new Date(b.dueDate || 0).getTime();
      if (filters.sort === 'asc') {
        return first - second;
      }
      return second - first;
    });
    return next;
  }, [payments, filters]);

  const handleAddPayment = () => {
    navigation.navigate('AddPayment');
  };

  const handleOpenPayment = (paymentId) => {
    navigation.navigate('PaymentDetail', { paymentId });
  };

  const clearBanner = () => setBanner('');

  const goBackToBudgetBuddy = () => {
    if (navigation?.popToTop) {
      const state = navigation.getState?.();
      if (state?.routes?.length > 1) {
        navigation.popToTop();
        return;
      }
    }
    navigation?.navigate?.('BudgetBuddyHome');
  };

  return (
    <Screen scroll>
      <View style={styles.page}>
        <Pressable onPress={goBackToBudgetBuddy} style={styles.backRow} hitSlop={8}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Payment Schedule</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.filterButton} onPress={() => setFilterVisible(true)}>
              <Ionicons name="options-outline" size={16} color={colors.text} />
              <Text style={styles.filterButtonText}>Filter</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={handleAddPayment}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
        {banner ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{banner}</Text>
            <Pressable onPress={clearBanner} hitSlop={8}>
              <Ionicons name="close" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : null}
        {filteredPayments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-clear-outline" size={28} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No payments scheduled yet</Text>
            <Text style={styles.emptyCopy}>Add payment schedules to stay on track.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredPayments.map((payment) => (
              <Pressable
                key={payment.id}
                style={styles.paymentCard}
                onPress={() => handleOpenPayment(payment.id)}
              >
                <View style={styles.paymentCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentVendor}>{payment.vendorName || 'Untitled payment'}</Text>
                    <Text style={styles.paymentType}>
                      {paymentTypeLabels[payment.paymentType] || 'Payment'}
                    </Text>
                  </View>
                  <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                </View>
                <View style={styles.paymentMetaRow}>
                  <Text style={styles.paymentDue}>Due: {formatDateDisplay(payment.dueDate)}</Text>
                  <Text
                    style={[
                      styles.paymentStatus,
                      payment.status === 'paid' && styles.paymentStatusPaid,
                    ]}
                  >
                    {payment.status === 'paid' ? 'PAID' : 'PENDING'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <FilterSheet
        visible={filterVisible}
        filters={filters}
        onClose={() => setFilterVisible(false)}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setFilterVisible(false);
        }}
      />
    </Screen>
  );
}

const FilterSheet = ({ visible, filters, onClose, onApply }) => {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const applyChanges = () => {
    onApply(draft);
  };

  const reset = () => {
    setDraft({
      sort: 'asc',
      status: 'all',
      type: 'all',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Sort & Filter Payments</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={18} color={colors.text} />
            </Pressable>
          </View>
          <Text style={styles.sheetSectionLabel}>Sort By</Text>
          <View style={styles.optionList}>
            {sortOptions.map((option) => {
              const active = draft.sort === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionRow, active && styles.optionRowActive]}
                  onPress={() => setDraft((prev) => ({ ...prev, sort: option.id }))}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {option.label}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={16} color={colors.accent} /> : null}
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.sheetSectionLabel}>Filter by Status</Text>
          <View style={styles.optionList}>
            {statusOptions.map((option) => {
              const active = draft.status === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionRow, active && styles.optionRowActive]}
                  onPress={() => setDraft((prev) => ({ ...prev, status: option.id }))}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {option.label}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={16} color={colors.accent} /> : null}
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.sheetSectionLabel}>Filter by Payment Type</Text>
          <View style={styles.optionList}>
            {typeOptions.map((option) => {
              const active = draft.type === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionRow, active && styles.optionRowActive]}
                  onPress={() => setDraft((prev) => ({ ...prev, type: option.id }))}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {paymentTypeLabels[option.id] || option.label}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={16} color={colors.accent} /> : null}
                </Pressable>
              );
            })}
          </View>
          <View style={styles.sheetActions}>
            <Pressable onPress={reset} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable onPress={applyChanges} style={styles.applyButton}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  filterButtonText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'Outfit_600SemiBold',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F8F5',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  bannerText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
    flex: 1,
    marginRight: spacing.sm,
  },
  emptyCard: {
    marginTop: spacing.lg,
    backgroundColor: '#FFF9F5',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: colors.text,
  },
  emptyCopy: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
  },
  list: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  paymentCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#F0E7E1',
    padding: spacing.md,
    gap: spacing.xs,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  paymentVendor: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
    fontSize: 15,
  },
  paymentType: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  paymentAmount: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
    fontSize: 15,
  },
  paymentMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDue: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  paymentStatus: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.accent,
  },
  paymentStatusPaid: {
    color: colors.success,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    gap: spacing.md,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#E4DCD6',
    borderRadius: radius.pill,
    alignSelf: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: colors.text,
  },
  sheetSectionLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
    fontFamily: 'Outfit_600SemiBold',
    textTransform: 'uppercase',
  },
  optionList: {
    gap: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E4DCD6',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  optionRowActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  optionText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  optionTextActive: {
    color: colors.accent,
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  resetText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  applyButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  applyText: {
    color: '#fff',
    fontFamily: 'Outfit_600SemiBold',
  },
});
