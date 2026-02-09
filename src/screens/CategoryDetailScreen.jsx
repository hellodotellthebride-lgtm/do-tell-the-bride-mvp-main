import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../theme';
import { deleteBudgetCategory, loadBudgetState, updateBudgetCategory } from '../budget/budgetStorage';

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

const parseCurrency = (value) => {
  if (value === null || value === undefined) return 0;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) {
    return 0;
  }
  return numeric;
};

const SummaryTile = ({ label, value }) => (
  <View style={styles.summaryTile}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

export default function CategoryDetailScreen({ navigation, route }) {
  const categoryId = route?.params?.categoryId;
  const [state, setState] = useState({ totalBudget: 0, categories: [], allocations: {}, quotes: [] });
  const [form, setForm] = useState({ label: '', vendorName: '', allocation: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | saved | deleted
  const [deletedLabel, setDeletedLabel] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [showFreshHint, setShowFreshHint] = useState(Boolean(route?.params?.justAdded));
  const [savedReadyToExit, setSavedReadyToExit] = useState(false);

  const hydrate = useCallback(() => {
    if (!categoryId) return;
    setLoading(true);
    loadBudgetState()
      .then((stored) => {
        setState({
          totalBudget: stored.totalBudget || 0,
          categories: stored.categories || [],
          allocations: stored.allocations || {},
          quotes: stored.quotes || [],
        });
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate]),
  );

  const category = useMemo(
    () => state.categories.find((cat) => cat.id === categoryId),
    [state.categories, categoryId],
  );

  const allocationValue = state.allocations?.[categoryId] ?? 0;

  useEffect(() => {
    if (!category) return;
    setForm({
      label: category.label || '',
      vendorName: category.vendorName || '',
      allocation: allocationValue ? String(allocationValue) : '',
      notes: category.notes || '',
    });
  }, [category, allocationValue]);

  useEffect(() => {
    setStatus('idle');
    setDeleted(false);
    setDeletedLabel('');
  }, [categoryId]);

  useEffect(() => {
    if (route?.params?.justAdded) {
      setShowFreshHint(true);
    }
  }, [route?.params?.justAdded]);

  const totalAllocated = useMemo(() => {
    return Object.values(state.allocations || {}).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0,
    );
  }, [state.allocations]);

  const remainingBudget = Math.max(0, (state.totalBudget || 0) - totalAllocated);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'saved') {
      setStatus('idle');
    }
  };

  const handleSave = () => {
    if (!categoryId) return;
    setSaving(true);
    const allocation = form.allocation ? parseCurrency(form.allocation) : 0;
    updateBudgetCategory(categoryId, {
      label: form.label?.trim() || category?.label || '',
      vendorName: form.vendorName?.trim() || '',
      notes: form.notes || '',
      allocation,
    })
      .then((next) => {
        setState({
          totalBudget: next.totalBudget || 0,
          categories: next.categories || [],
          allocations: next.allocations || {},
          quotes: next.quotes || state.quotes || [],
        });
        setStatus('saved');
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    if (!categoryId) return;
    Alert.alert(
      'Remove this category?',
      'This simply clears it from Budget Buddy. You can always add it again later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            deleteBudgetCategory(categoryId).then((next) => {
              setState({
                totalBudget: next.totalBudget || 0,
                categories: next.categories || [],
                allocations: next.allocations || {},
                quotes: next.quotes || [],
              });
              setDeleted(true);
              setDeletedLabel(form.label || category?.label || 'This category');
              setStatus('deleted');
            });
          },
        },
      ],
    );
  };


  const goBackToPrevious = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
  }, [navigation]);

  useEffect(() => {
    if (status === 'saved') {
      setSavedReadyToExit(false);
      const timeout = setTimeout(() => {
        setSavedReadyToExit(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
    setSavedReadyToExit(false);
    return undefined;
  }, [status]);

  const isGoBackState = status === 'saved' && savedReadyToExit;

  const handlePrimaryAction = () => {
    if (status === 'saved' && savedReadyToExit) {
      goBackToPrevious();
      return;
    }
    if (!saving) {
      handleSave();
    }
  };

  const isPrimaryDisabled = saving || (status === 'saved' && !savedReadyToExit);
  const buttonStyles = [styles.primaryButton];
  if (status === 'saved') {
    if (isGoBackState) {
      buttonStyles.push(styles.primaryButtonNeutral);
    } else {
      buttonStyles.push(styles.primaryButtonSuccess);
    }
  } else {
    buttonStyles.push(styles.primaryButtonDefault);
  }
  if (isPrimaryDisabled) {
    buttonStyles.push(styles.primaryButtonDisabled);
  }

  if (!categoryId) {
    return (
      <Screen>
        <View style={styles.centeredState}>
          <Text style={styles.centeredText}>No category selected.</Text>
          <Pressable onPress={goBackToPrevious}>
            <Text style={styles.linkText}>Back to Categories</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (!deleted && !category && !loading) {
    return (
      <Screen>
        <View style={styles.centeredState}>
          <Text style={styles.centeredText}>We couldn’t find that category.</Text>
          <Pressable onPress={goBackToPrevious}>
            <Text style={styles.linkText}>Back to Categories</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (deleted) {
    return (
      <Screen>
        <View style={styles.page}>
          <Pressable onPress={goBackToPrevious} style={styles.backRow} hitSlop={8}>
            <Text style={styles.backText}>← Back to Categories</Text>
          </Pressable>
          <View style={styles.deletedCard}>
            <Ionicons name="checkmark-circle" size={36} color={colors.success} />
            <Text style={styles.deletedTitle}>{deletedLabel} was removed</Text>
            <Text style={styles.deletedCopy}>
              This category is gone from Budget Buddy. You can add it again whenever you want to.
            </Text>
            <Pressable style={styles.primaryButton} onPress={goBackToPrevious}>
              <Text style={styles.primaryButtonText}>Back to Categories</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
        <View style={styles.page}>
        <Pressable onPress={goBackToPrevious} style={styles.backRow} hitSlop={8}>
          <Text style={styles.backText}>← Back to Categories</Text>
        </Pressable>
        <Text style={styles.pageTitle}>{form.label || 'Category'}</Text>
        {showFreshHint ? (
          <View style={styles.hintBanner}>
            <Text style={styles.hintText}>
              Add a vendor name or budget when you feel ready — or leave it blank for now.
            </Text>
            <Pressable onPress={() => setShowFreshHint(false)} hitSlop={8}>
              <Ionicons name="close" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : null}
        <View style={styles.summaryRow}>
          <SummaryTile label="Allocated" value={formatCurrency(allocationValue)} />
          <SummaryTile label="Spent" value="£0" />
          <SummaryTile label="Remaining" value={formatCurrency(remainingBudget)} />
        </View>

        {status === 'saved' && (
          <View style={styles.statusBanner}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.statusBannerText}>Saved</Text>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Edit category</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Category name</Text>
            <TextInput
              value={form.label}
              onChangeText={(text) => handleChange('label', text)}
              placeholder="e.g. Venue"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Vendor name (optional)</Text>
            <TextInput
              value={form.vendorName}
              onChangeText={(text) => handleChange('vendorName', text)}
              placeholder="Add vendor"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Allocated amount</Text>
            <TextInput
              value={form.allocation}
              onChangeText={(text) => handleChange('allocation', text)}
              placeholder="£0"
              keyboardType="numeric"
              style={styles.input}
            />
            <Text style={styles.helper}>You can leave this at £0 and come back later.</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              value={form.notes}
              onChangeText={(text) => handleChange('notes', text)}
              placeholder="Add notes about this category…"
              style={[styles.input, styles.notesInput]}
              multiline
              textAlignVertical="top"
            />
          </View>
          <Pressable style={buttonStyles} onPress={handlePrimaryAction} disabled={isPrimaryDisabled}>
            {status === 'saved' ? (
              savedReadyToExit ? (
                <Text style={styles.primaryButtonTextNeutral}>Go back</Text>
              ) : (
                <View style={styles.primaryButtonSavedContent}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Changes saved</Text>
                </View>
              )
            ) : (
              <Text style={styles.primaryButtonText}>
                {saving ? 'Saving…' : 'Save changes'}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={[styles.sectionCard, styles.deleteCard]}>
          <Text style={styles.sectionLabel}>Delete category</Text>
          <Text style={styles.deleteCopy}>
            This removes the category from your budget. You can always add it again later.
          </Text>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Remove this category</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  backRow: {
    marginBottom: spacing.sm,
  },
  backText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#F5F0EC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryTile: {
    flex: 1,
    backgroundColor: '#FFF6F1',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Outfit_500Medium',
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: '#E8F2ED',
    borderRadius: radius.pill,
  },
  statusBannerText: {
    fontSize: 13,
    color: colors.success,
    fontFamily: 'Outfit_600SemiBold',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
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
  notesInput: {
    minHeight: 120,
  },
  helper: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  primaryButton: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonDefault: {
    backgroundColor: colors.accent,
  },
  primaryButtonSuccess: {
    backgroundColor: colors.success,
  },
  primaryButtonNeutral: {
    backgroundColor: '#F3EFEB',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
  primaryButtonTextNeutral: {
    color: colors.text,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
  primaryButtonSavedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deleteCard: {
    backgroundColor: '#FDF8F6',
  },
  deleteCopy: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  deleteButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E0CFC5',
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#B97462',
    fontFamily: 'Outfit_600SemiBold',
  },
  deletedCard: {
    marginTop: spacing.xl,
    backgroundColor: '#FFF6F1',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  deletedTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  deletedCopy: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  centeredText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  linkText: {
    color: colors.accent,
    fontFamily: 'Outfit_500Medium',
  },
});
