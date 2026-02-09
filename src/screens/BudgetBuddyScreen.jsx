import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../theme';
import {
  QUOTE_STATUSES,
  addBudgetCategories,
  addQuote,
  deleteBudgetCategory,
  deleteQuote,
  loadBudgetState,
  saveBudgetState,
  updateQuote,
} from '../budget/budgetStorage';
import CategoryPickerModal from './budget/CategoryPickerModal';
import QuoteModal from './budget/QuoteModal';

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
  if (!value) return null;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) {
    return null;
  }
  return numeric;
};

const BudgetInputModal = ({ visible, title, helper, initialValue, onClose, onSave }) => {
  const [text, setText] = useState(initialValue ? String(initialValue) : '');

  useEffect(() => {
    setText(initialValue !== null && initialValue !== undefined ? String(initialValue) : '');
  }, [initialValue, visible]);

  const handleSave = () => {
    const parsed = parseCurrency(text);
    onSave(parsed ?? 0);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            autoFocus
            keyboardType="numeric"
            placeholder="£20,000"
            value={text}
            onChangeText={setText}
            style={styles.modalInput}
          />
          {helper ? <Text style={styles.modalHelper}>{helper}</Text> : null}
          <View style={styles.modalButtons}>
            <Pressable style={[styles.modalButton, styles.modalButtonSecondary]} onPress={onClose}>
              <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleSave}>
              <Text style={styles.modalButtonPrimaryText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const StatusPill = ({ status }) => {
  const statusConfig = {
    ok: { label: 'OK', dot: colors.success, bg: '#E8F2ED', text: colors.success },
    new: { label: 'New', dot: '#B1A399', bg: '#F2EEEB', text: '#9B9085' },
    over: { label: 'Over', dot: '#B64C40', bg: '#FFF4F2', text: '#B64C40' },
  };
  const config = statusConfig[status] || statusConfig.ok;
  return (
    <View style={[styles.statusPill, { backgroundColor: config.bg }]}>
      <View style={[styles.statusDotSmall, { backgroundColor: config.dot }]} />
      <Text style={[styles.statusPillText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const inlineStatusMap = QUOTE_STATUSES.reduce((acc, status) => {
  acc[status.id] = status.label;
  return acc;
}, {});

const statusColorMap = {
  considering: colors.accent,
  booked: colors.success,
  declined: '#B64C40',
};

const QuoteInlineCard = ({ vendorName, amount, categoryLabel, status, onPress }) => {
  const statusColor = statusColorMap[status] || colors.accent;
  return (
    <Pressable style={styles.quoteInlineCard} onPress={onPress} hitSlop={6}>
      <View style={styles.quoteInlineHeader}>
        <Text style={styles.quoteVendor}>{vendorName || 'Vendor'}</Text>
        <Text style={styles.quoteAmount}>{formatCurrency(amount)}</Text>
      </View>
      <Text style={styles.quoteCategory}>{categoryLabel || 'No category yet'}</Text>
      <Text style={[styles.quoteStatusTextInline, { color: statusColor }]}>
        {inlineStatusMap[status] || 'Considering'}
      </Text>
    </Pressable>
  );
};

const CategoryCard = ({ category, allocation, overBudget, onPress }) => {
  const vendorName = category.vendorName?.trim();
  const allocationValue = Number(allocation) || 0;
  const hasDetails = Boolean(vendorName || allocationValue > 0);
  const status = overBudget ? 'over' : hasDetails ? 'ok' : 'new';
  return (
    <Pressable style={styles.categoryCard} onPress={onPress} hitSlop={6}>
      <View style={styles.cardHeaderRow}>
        <View>
          <Text style={styles.categoryName}>{category.label}</Text>
          <Text style={styles.categorySubtext}>{vendorName ? vendorName : 'Add vendor'}</Text>
        </View>
        <StatusPill status={status} />
      </View>
      <View style={styles.breakdownRow}>
        {['Allocated', 'Spent', 'Remaining'].map((label, index) => (
          <View key={label} style={styles.breakdownColumn}>
            <Text style={styles.breakdownLabel}>{label}</Text>
            <Text style={styles.breakdownValue}>
              {index === 0 ? formatCurrency(allocation) : '£0'}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.editHint}>Tap to add details when you’re ready.</Text>
    </Pressable>
  );
};

const BudgetContextBar = ({ allocated, remaining }) => {
  const cards = [
    { label: 'Allocated', icon: 'layers-outline', value: allocated },
    { label: 'Spent', icon: 'wallet-outline', value: 0 },
    { label: 'Remaining', icon: 'sparkles-outline', value: remaining },
  ];
  return (
    <View style={styles.contextBar}>
      {cards.map((card) => (
        <View key={card.label} style={styles.contextCard}>
          <View style={styles.contextIcon}>
            <Ionicons name={card.icon} size={16} color={colors.accent} />
          </View>
          <Text style={styles.contextLabel}>{card.label}</Text>
          <Text style={styles.contextValue}>{formatCurrency(card.value)}</Text>
        </View>
      ))}
    </View>
  );
};

export default function BudgetBuddyScreen({ navigation }) {
  const [state, setState] = useState({ totalBudget: null, categories: [], allocations: {}, quotes: [] });
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [sectionVisibility, setSectionVisibility] = useState({
    categories: false,
    quotes: false,
    payments: false,
  });
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);

  const hydrate = useCallback((showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }
    loadBudgetState().then((stored) => {
      setState({
        totalBudget: stored.totalBudget ?? null,
        categories: stored.categories ?? [],
        allocations: stored.allocations ?? {},
        quotes: stored.quotes ?? [],
      });
      if (showLoader) {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    hydrate(true);
  }, [hydrate]);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate]),
  );

  const allocations = useMemo(() => state.allocations || {}, [state.allocations]);
  const visibleCategories = useMemo(
    () => (state.categories || []).filter((category) => category.createdManually),
    [state.categories],
  );
  const quotes = useMemo(() => state.quotes || [], [state.quotes]);
  const categoryLookup = useMemo(() => {
    const lookup = {};
    (state.categories || []).forEach((cat) => {
      lookup[cat.id] = cat.label;
    });
    return lookup;
  }, [state.categories]);
  const allocatedTotal = useMemo(() => {
    return visibleCategories.reduce((sum, category) => {
      const amount = allocations[category.id] || 0;
      return sum + (Number(amount) || 0);
    }, 0);
  }, [visibleCategories, allocations]);
  const remainingTotal = (state.totalBudget || 0) - allocatedTotal;

  const handleSaveBudget = (amount) => {
    const next = { ...state, totalBudget: amount };
    setState(next);
    saveBudgetState(next);
    setShowBudgetModal(false);
  };

  const handleAddCategories = (labels) => {
    if (!labels || labels.length === 0) {
      return Promise.resolve();
    }
    const singleRequestLabel =
      labels.length === 1 && typeof labels[0] === 'string'
        ? labels[0].trim().toLowerCase()
        : null;
    return addBudgetCategories(labels).then(({ state: nextState, addedCategories }) => {
      setState(nextState);
      setPickerVisible(false);
      if (addedCategories && addedCategories.length === 1) {
        setFeedbackMessage('');
        navigation?.navigate?.('BudgetCategoryDetail', {
          categoryId: addedCategories[0].id,
          fallbackRoute: 'Budget Buddy',
          justAdded: true,
        });
        return;
      }
      if ((!addedCategories || addedCategories.length === 0) && singleRequestLabel) {
        const existing = (nextState.categories || []).find(
          (cat) => cat.label?.trim?.().toLowerCase() === singleRequestLabel,
        );
        if (existing) {
          setFeedbackMessage('');
          navigation?.navigate?.('BudgetCategoryDetail', {
            categoryId: existing.id,
            fallbackRoute: 'Budget Buddy',
          });
          return;
        }
      }
      setSectionVisibility((prev) => ({ ...prev, categories: true }));
      const multiAdd = labels.length > 1 || (addedCategories && addedCategories.length > 1);
      setFeedbackMessage(
        multiAdd ? 'Added. Tap a category to add details when you’re ready.' : '',
      );
    });
  };

  const handleOpenCategory = (categoryId) => {
    if (!categoryId) return;
    navigation?.navigate?.('BudgetCategoryDetail', {
      categoryId,
      fallbackRoute: 'Budget Buddy',
    });
  };

  const handlePlaceholder = (label) => {
    Alert.alert('Coming soon', `${label} will live here soon.`);
  };

  const handleOpenQuotes = () => {
    setEditingQuote(null);
    setQuoteModalVisible(true);
  };

  const handleEditQuoteInline = (quoteId) => {
    const existing = (state.quotes || []).find((quote) => quote.id === quoteId);
    if (existing) {
      setEditingQuote(existing);
      setQuoteModalVisible(true);
    }
  };

  const handleCreateQuoteCategory = async (label) => {
    const trimmed = label?.trim();
    if (!trimmed) return null;
    const { state: nextState, addedCategories } = await addBudgetCategories([trimmed]);
    setState(nextState);
    if (addedCategories && addedCategories.length > 0) {
      return addedCategories[0];
    }
    return (nextState.categories || []).find(
      (cat) => cat.label?.trim()?.toLowerCase() === trimmed.toLowerCase(),
    );
  };

  const handleRemoveCustomCategory = async (categoryId) => {
    await deleteBudgetCategory(categoryId);
    const next = await loadBudgetState();
    setState({
      totalBudget: next.totalBudget ?? null,
      categories: next.categories ?? [],
      allocations: next.allocations ?? {},
      quotes: next.quotes ?? [],
    });
  };

  const prevCategoryCount = useRef(visibleCategories.length);
  const autoOpenedCategories = useRef(visibleCategories.length > 0);

  useEffect(() => {
    if (visibleCategories.length === 0) {
      autoOpenedCategories.current = false;
      prevCategoryCount.current = 0;
      return;
    }
    if (!autoOpenedCategories.current) {
      setSectionVisibility((prev) => ({ ...prev, categories: true }));
      autoOpenedCategories.current = true;
    }
    prevCategoryCount.current = visibleCategories.length;
  }, [visibleCategories.length]);

  const handleSaveQuote = (payload) => {
    const action = editingQuote ? updateQuote(editingQuote.id, payload) : addQuote(payload);
    action.then((nextState) => {
      setState((prev) => ({
        ...prev,
        totalBudget: nextState.totalBudget ?? prev.totalBudget,
        categories: nextState.categories ?? prev.categories,
        allocations: nextState.allocations ?? prev.allocations,
        quotes: nextState.quotes ?? prev.quotes,
      }));
      setQuoteModalVisible(false);
      setEditingQuote(null);
      setSectionVisibility((prev) => ({ ...prev, quotes: true }));
    });
  };

  const handleDeleteQuote = (quoteId) => {
    if (!quoteId) return;
    Alert.alert('Delete this quote?', 'This removes the quote from your list. You can add it again anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteQuote(quoteId).then((nextState) => {
            setState((prev) => ({
              ...prev,
              totalBudget: nextState.totalBudget ?? prev.totalBudget,
              categories: nextState.categories ?? prev.categories,
              allocations: nextState.allocations ?? prev.allocations,
              quotes: nextState.quotes ?? prev.quotes,
            }));
            setQuoteModalVisible(false);
            setEditingQuote(null);
          });
        },
      },
    ]);
  };

  const toggleSection = (key) => {
    setSectionVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading Budget Buddy…</Text>
        </View>
      </Screen>
    );
  }

  if (!state.totalBudget) {
    return (
      <Screen scroll>
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Your Wedding Budget Starts Here</Text>
            <Text style={styles.heroSubtitle}>
              Add your total budget and we’ll help you organise it calmly.
            </Text>
            <Pressable style={styles.primaryButton} onPress={() => setShowBudgetModal(true)}>
              <Text style={styles.primaryButtonText}>Add Total Budget</Text>
            </Pressable>
          </View>

          <DisabledSection title="Categories" copy="Your categories will appear here once you set a budget." />
          <DisabledSection title="Quotes & Estimates" copy="No quotes yet." />
          <DisabledSection title="Payment Schedule" copy="No payments scheduled yet." />
        </View>
        <BudgetInputModal
          visible={showBudgetModal}
          title="Add Wedding Budget"
          helper="This doesn’t have to be exact. You can change it later."
          onClose={() => setShowBudgetModal(false)}
          onSave={handleSaveBudget}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.container}>
        <View style={styles.totalCard}>
          <View style={styles.totalHeaderRow}>
            <View>
              <Text style={styles.sectionLabel}>TOTAL WEDDING BUDGET</Text>
              <Text style={styles.totalValue}>{formatCurrency(state.totalBudget)}</Text>
            </View>
            <Pressable
              onPress={() => setShowBudgetModal(true)}
              style={styles.iconButton}
              accessibilityLabel="Edit total budget"
            >
              <Ionicons name="pencil" size={18} color={colors.text} />
            </Pressable>
          </View>
          <Text style={styles.totalHelper}>Budgets change. That’s normal.</Text>
        </View>
        <BudgetContextBar allocated={allocatedTotal} remaining={remainingTotal} />
        <Text style={[styles.contextHelper, { marginTop: spacing.sm }]}>
          This is just an overview — you can change things anytime.
        </Text>

        <View style={styles.sectionCard}>
          <Pressable style={styles.sectionHeaderRow} onPress={() => toggleSection('categories')}>
            <View style={styles.headerLeft}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Ionicons
                name={sectionVisibility.categories ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textMuted}
              />
            </View>
            <View style={styles.sectionActions}>
              <Pressable style={styles.addInlineButton} onPress={() => setPickerVisible(true)}>
                <Ionicons name="add" size={16} color={colors.accent} />
                <Text style={styles.addInlineText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
          {feedbackMessage ? (
            <View style={styles.feedbackBanner}>
              <View style={styles.feedbackBannerLeft}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </View>
              <Pressable onPress={() => setFeedbackMessage('')} hitSlop={8}>
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          ) : null}
          {sectionVisibility.categories ? (
            visibleCategories.length === 0 ? (
              <Text style={styles.noCategoriesCopy}>
                You haven’t added any categories yet. Tap + Add to create one when you’re ready.
              </Text>
            ) : (
              <View style={styles.categoryCardList}>
                {visibleCategories.map((category) => {
                  const allocationValue = allocations[category.id] || 0;
                  const overBudget =
                    state.totalBudget !== null &&
                    Number(allocationValue) > Number(state.totalBudget || 0);
                  return (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      allocation={allocationValue}
                      overBudget={overBudget}
                      onPress={() => handleOpenCategory(category.id)}
                    />
                  );
                })}
              </View>
            )
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Pressable style={styles.sectionHeaderRow} onPress={() => toggleSection('quotes')}>
            <View style={styles.headerLeft}>
              <Text style={styles.sectionTitle}>Quotes & Estimates</Text>
              <Ionicons
                name={sectionVisibility.quotes ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textMuted}
              />
            </View>
            <Pressable style={styles.addInlineButton} onPress={handleOpenQuotes}>
              <Ionicons name="add" size={16} color={colors.accent} />
              <Text style={styles.addInlineText}>Add</Text>
            </Pressable>
          </Pressable>
          {sectionVisibility.quotes ? (
            <>
              <Text style={styles.sectionBody}>
                Save quotes without pressure, compare calmly, and come back when you’re ready.
              </Text>
              {quotes.length === 0 ? (
                <Text style={styles.noCategoriesCopy}>No quotes yet.</Text>
              ) : (
                <View style={styles.quotePreviewList}>
                  {quotes.map((quote) => (
                    <QuoteInlineCard
                      key={quote.id}
                      vendorName={quote.vendorName}
                      amount={quote.amount}
                      categoryLabel={categoryLookup[quote.categoryId]}
                      status={quote.status}
                      onPress={() => handleEditQuoteInline(quote.id)}
                    />
                  ))}
                </View>
              )}
            </>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Pressable style={styles.sectionHeaderRow} onPress={() => toggleSection('payments')}>
            <View style={styles.headerLeft}>
              <Text style={styles.sectionTitle}>Payment Schedule</Text>
              <Ionicons
                name={sectionVisibility.payments ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textMuted}
              />
            </View>
            <Pressable onPress={() => handlePlaceholder('Payment Schedule')}>
              <Text style={styles.linkText}>Add Payment</Text>
            </Pressable>
          </Pressable>
          {sectionVisibility.payments ? <EmptyLine copy="No upcoming payments." /> : null}
        </View>
      </View>

      <BudgetInputModal
        visible={showBudgetModal}
        title="Update Your Wedding Budget"
        initialValue={state.totalBudget}
        helper="Budgets change. That’s normal."
        onClose={() => setShowBudgetModal(false)}
        onSave={handleSaveBudget}
      />
      <CategoryPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSubmit={handleAddCategories}
      />
      <QuoteModal
        visible={quoteModalVisible}
        initialValue={editingQuote}
        categories={state.categories}
        onClose={() => {
          setQuoteModalVisible(false);
          setEditingQuote(null);
        }}
        onSave={handleSaveQuote}
        onCreateCategory={handleCreateQuoteCategory}
        onRemoveCategory={handleRemoveCustomCategory}
        onDelete={handleDeleteQuote}
      />
    </Screen>
  );
}

const DisabledSection = ({ title, copy }) => (
  <View style={[styles.sectionCard, styles.disabledCard]}>
    <Text style={[styles.sectionTitle, styles.disabledTitle]}>{title}</Text>
    <Text style={styles.disabledCopy}>{copy}</Text>
  </View>
);

const EmptyLine = ({ copy }) => (
  <View style={styles.emptyLine}>
    <Text style={styles.emptyText}>{copy}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: '#FFF6F1',
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: colors.textMuted,
  },
  primaryButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
  disabledCard: {
    backgroundColor: '#F3EFEB',
    opacity: 0.9,
  },
  disabledTitle: {
    color: '#9A8F88',
  },
  disabledCopy: {
    marginTop: spacing.xs,
    color: '#B2A8A2',
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.textMuted,
    fontFamily: 'Outfit_500Medium',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionBody: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  linkText: {
    color: colors.accent,
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
  },
  addInlineText: {
    color: colors.accent,
    fontFamily: 'Outfit_600SemiBold',
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F8F5',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  feedbackBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.sm,
  },
  feedbackText: {
    fontSize: 13,
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
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
  dropdownValueText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
    fontSize: 15,
  },
  customCategoryRow: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  customCategoryActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customCategoryInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quoteModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  quoteModalScroll: {
    marginTop: spacing.xxl,
  },
  quoteModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: colors.text,
  },
  quoteInput: {
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#E4DCD6',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  categoryChipText: {
    fontFamily: 'Outfit_500Medium',
    color: colors.textMuted,
  },
  categoryChipTextActive: {
    color: colors.accent,
  },
  deleteChip: {
    borderColor: '#F3D3CF',
    backgroundColor: '#FFF4F2',
  },
  deleteChipText: {
    color: '#B64C40',
  },
  quoteFieldGroup: {
    gap: spacing.sm,
  },
  formActions: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  modalButton: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  modalSecondaryButton: {
    backgroundColor: '#F3EFEB',
  },
  modalSecondaryButtonText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  modalPrimaryButton: {
    backgroundColor: colors.accent,
  },
  modalPrimaryButtonDisabled: {
    opacity: 0.5,
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_600SemiBold',
  },
  quotePreviewList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  quoteInlineCard: {
    backgroundColor: '#FFF8F4',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  quoteInlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteVendor: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
    fontSize: 15,
  },
  quoteAmount: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
    fontSize: 15,
  },
  quoteCategory: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  quoteStatusTextInline: {
    fontSize: 12,
    color: colors.accent,
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
  contextBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#FFF6F1',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  contextCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.xs,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  contextIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.textMuted,
    fontFamily: 'Outfit_600SemiBold',
    textTransform: 'uppercase',
  },
  contextValue: {
    fontSize: 20,
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  contextHelper: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  noCategoriesCopy: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
    marginTop: spacing.sm,
  },
  categoryCardList: {
    gap: spacing.lg,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryName: {
    fontSize: 17,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
  },
  categorySubtext: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  breakdownColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  breakdownLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
    fontFamily: 'Outfit_500Medium',
  },
  breakdownValue: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.text,
  },
  editHint: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  totalCard: {
    backgroundColor: '#FFF6F1',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  totalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  totalHelper: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyLine: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#F8F6F4',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textMuted,
    fontFamily: 'Outfit_500Medium',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: colors.text,
  },
  modalInput: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E7DED7',
    padding: spacing.md,
    fontSize: 18,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  modalHelper: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  modalButtonSecondary: {
    backgroundColor: '#F3EFEB',
  },
  modalButtonPrimary: {
    backgroundColor: colors.accent,
  },
  modalButtonSecondaryText: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_600SemiBold',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
  },
});
