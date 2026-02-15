import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../components/AppText';
import { colors, layout, spacing } from '../theme';
import Bubble from './components/Bubble';
import QuickChip from './components/QuickChip';
import { respondToUser } from './ivyResponder';
import { clearAskIvyMessages, loadAskIvyState, saveAskIvyState } from './ivyStorage';
import { GUEST_NEST_STORAGE_KEY } from '../guestNest/guestNestStorage';
import { computeStageProgress, loadChecklistState } from '../roadmap/progressStorage';
import { getChecklistItems } from '../roadmap/checklists';

const S8 = 8;
const S16 = 16;
const S24 = 24;
const MAX_MESSAGE_CHARS = 1000;
const CHAR_COUNT_WARNING_AT = 900;

const createMessageId = () =>
  `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const WEDDING_DATE_STORAGE_KEY = 'ONBOARDING_WEDDING_DATE';
const BUDGET_STORAGE_KEY = 'BUDGET_BUDDY_STATE';
const WELCOME_BACK_AFTER_MS = 1000 * 60 * 60 * 24 * 7;

const ROADMAP_STAGES = [
  { id: 'stage-1', number: 1, title: 'Your Beginning', routeName: 'Stage1Overview' },
  { id: 'stage-2', number: 2, title: 'Your Early Decisions', routeName: 'Stage2EarlyDecisions' },
  { id: 'stage-3', number: 3, title: 'Your Dream Team', routeName: 'Stage3DreamTeam' },
  { id: 'stage-4', number: 4, title: 'Guest List & Invitations', routeName: 'Stage4GuestsInvitations' },
  { id: 'stage-5', number: 5, title: 'Wedding Style', routeName: 'Stage5Style' },
  { id: 'stage-6', number: 6, title: 'Final Touches', routeName: 'Stage6FinalDetails' },
  { id: 'stage-7', number: 7, title: 'Wedding Week', routeName: 'Stage7WeddingWeek' },
  { id: 'stage-8', number: 8, title: 'Wedding Wrap-Up', routeName: 'Stage8WrapUp' },
];

const ROADMAP_STAGE_MAP = ROADMAP_STAGES.reduce((acc, stage) => {
  acc[stage.id] = stage;
  return acc;
}, {});

const findNextRoadmapStage = (checklistState) => {
  const stagesWithChecklists = ROADMAP_STAGES.filter((stage) => stage.id !== 'stage-8');
  const state = checklistState && typeof checklistState === 'object' ? checklistState : {};
  for (const stage of stagesWithChecklists) {
    const progress = computeStageProgress(stage.id, state);
    if (progress.percent < 100) {
      return stage;
    }
  }
  return ROADMAP_STAGE_MAP['stage-8'] ?? null;
};

const safeJsonParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const loadIvyContext = async () => {
  try {
    const [weddingDateRaw, budgetRaw, guestNestRaw, checklistState] = await Promise.all([
      AsyncStorage.getItem(WEDDING_DATE_STORAGE_KEY),
      AsyncStorage.getItem(BUDGET_STORAGE_KEY),
      AsyncStorage.getItem(GUEST_NEST_STORAGE_KEY),
      loadChecklistState(),
    ]);

    const budgetState = safeJsonParse(budgetRaw);
    const totalBudget = Number(budgetState?.totalBudget);
    const hasBudget = Number.isFinite(totalBudget) && totalBudget > 0;

    const guestNestState = safeJsonParse(guestNestRaw);
    const guests = Array.isArray(guestNestState?.guests) ? guestNestState.guests : [];
    const hasGuests = guests.length > 0;
    const guestCount = guests.length;

    const nextStage = findNextRoadmapStage(checklistState);
    const nextStageChecklist = nextStage ? getChecklistItems(nextStage.id) : [];
    const roadmapNextStage = nextStage
      ? {
          id: nextStage.id,
          number: nextStage.number,
          title: nextStage.title,
          routeName: nextStage.routeName,
          checklistLabels: nextStageChecklist.map((item) => item.label).filter(Boolean),
        }
      : null;

    return {
      hasWeddingDate: isNonEmptyString(weddingDateRaw),
      hasBudget,
      hasGuests,
      weddingDate: weddingDateRaw,
      budgetTotal: hasBudget ? totalBudget : null,
      guestCount: hasGuests ? guestCount : null,
      roadmapNextStage,
    };
  } catch {
    return {
      hasWeddingDate: true,
      hasBudget: true,
      hasGuests: true,
      weddingDate: null,
      budgetTotal: null,
      guestCount: null,
      roadmapNextStage: null,
    };
  }
};

const resolveGreetingText = ({ hasWeddingDate, hasBudget, hasGuests }) => {
  if (!hasWeddingDate && !hasBudget && !hasGuests) {
    return 'No wedding date, budget, or guest list yet? That’s okay — we can still start.';
  }
  if (!hasWeddingDate) {
    return 'If you haven’t set your wedding date yet, that’s fine — we can still start.';
  }
  if (!hasBudget) {
    return 'If you haven’t set your budget yet, that’s okay — we can still start.';
  }
  if (!hasGuests) {
    return 'If you haven’t started a guest list yet, that’s fine — we can still start.';
  }
  return 'Hi, I’m Ivy. What can I help with today?';
};

const buildGreeting = (context) => ({
  id: createMessageId(),
  role: 'ivy',
  text: resolveGreetingText(context),
  createdAt: Date.now(),
});

const buildWelcomeBack = () => ({
  id: `welcome-back-${Date.now()}-${Math.round(Math.random() * 1000)}`,
  role: 'ivy',
  text: 'Welcome back — what feels most helpful to focus on today?',
  createdAt: Date.now(),
});

const isWelcomeBackMessage = (message) =>
  typeof message?.id === 'string' && message.id.startsWith('welcome-back-');

export default function IvyChatModal({ visible, onClose }) {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [composerText, setComposerText] = useState('');
  const [toastText, setToastText] = useState('');
  const toastTimerRef = useRef(null);

  const hasUserMessages = useMemo(
    () => messages.some((msg) => msg.role === 'user'),
    [messages],
  );

  const showQuickChips = !hasUserMessages;

  const scrollToEnd = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd?.({ animated });
    });
  }, []);

  const showToast = useCallback((text) => {
    const nextText = String(text || '').trim();
    if (!nextText) return;
    setToastText(nextText);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastText('');
      toastTimerRef.current = null;
    }, 1400);
  }, []);

  const persistMessages = useCallback(async (nextMessages) => {
    await saveAskIvyState({ messages: nextMessages });
  }, []);

  const appendMessages = useCallback(
    (newMessages) => {
      setMessages((current) => {
        const next = [...current, ...newMessages];
        persistMessages(next);
        return next;
      });
    },
    [persistMessages],
  );

  useEffect(() => {
    if (!visible) {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      setToastText('');
      return;
    }

    let mounted = true;
    const hydrate = async () => {
      const state = await loadAskIvyState();
      if (!mounted) return;
      let hydratedMessages = state.messages || [];
      if (hydratedMessages.length === 0) {
        const context = await loadIvyContext();
        hydratedMessages = [buildGreeting(context)];
        await saveAskIvyState({ messages: hydratedMessages });
        if (!mounted) return;
      }
      const lastUserMessage = [...hydratedMessages]
        .reverse()
        .find((msg) => msg?.role === 'user');
      const lastUserAt =
        typeof lastUserMessage?.createdAt === 'number' && Number.isFinite(lastUserMessage.createdAt)
          ? lastUserMessage.createdAt
          : null;
      const lastMessage = hydratedMessages[hydratedMessages.length - 1];
      const shouldWelcomeBack =
        hydratedMessages.length > 0 &&
        lastUserAt !== null &&
        Date.now() - lastUserAt > WELCOME_BACK_AFTER_MS &&
        !isWelcomeBackMessage(lastMessage);

      if (shouldWelcomeBack) {
        hydratedMessages = [...hydratedMessages, buildWelcomeBack()];
        await saveAskIvyState({ messages: hydratedMessages });
        if (!mounted) return;
      }

      setMessages(hydratedMessages);
      scrollToEnd(false);
    };
    hydrate();

    return () => {
      mounted = false;
    };
  }, [scrollToEnd, visible]);

  useEffect(() => {
    if (!visible) return;
    scrollToEnd(true);
  }, [messages.length, scrollToEnd, visible]);

  useEffect(() => {
    if (!visible) return;
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollToEnd(true), 50);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => scrollToEnd(true), 50);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollToEnd, visible]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Clear this chat?',
      'This removes messages from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setComposerText('');
            setMessages([]);
            await clearAskIvyMessages();
            const context = await loadIvyContext();
            const greeting = buildGreeting(context);
            setMessages([greeting]);
            await saveAskIvyState({ messages: [greeting] });
          },
        },
      ],
    );
  }, []);

  const sendUserText = useCallback(
    (rawText) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed) return;

      setComposerText('');

      const userMessage = {
        id: createMessageId(),
        role: 'user',
        text: trimmed,
        createdAt: Date.now(),
      };
      appendMessages([userMessage]);

      const contextPromise = loadIvyContext();
      const delayMs = 400 + Math.round(Math.random() * 200);
      setTimeout(() => {
        Promise.resolve(contextPromise)
          .then((context) => {
            const ivyMessage = {
              id: createMessageId(),
              role: 'ivy',
              text: respondToUser(trimmed, context),
              createdAt: Date.now(),
            };
            appendMessages([ivyMessage]);
          })
          .catch(() => {
            const ivyMessage = {
              id: createMessageId(),
              role: 'ivy',
              text: respondToUser(trimmed),
              createdAt: Date.now(),
            };
            appendMessages([ivyMessage]);
          });
      }, delayMs);
    },
    [appendMessages],
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleOpenRoadmapStage = useCallback(
    (stageId) => {
      const id = String(stageId || '').trim();
      const stage = ROADMAP_STAGE_MAP[id];
      const routeName = stage?.routeName || 'WeddingRoadmap';
      navigation?.navigate?.(routeName);
      onClose?.();
    },
    [navigation, onClose],
  );

  const canSend = composerText.trim().length > 0;
  const showCharCount = composerText.length >= CHAR_COUNT_WARNING_AT;
  const charCountText = `${composerText.length}/${MAX_MESSAGE_CHARS}`;

  const quickChips = useMemo(
    () => [
      'Script for awkward guest',
      'Help with budget',
      'Questions to ask a vendor',
      'What should I do next?',
    ],
    [],
  );

  const scrollContentStyle = useMemo(
    () => [
      styles.scrollContent,
      {
        paddingBottom: layout.safeBottomPadding + spacing.lg,
      },
    ],
    [],
  );

  const composerWrapStyle = useMemo(
    () => [
      styles.composerWrap,
      {
        paddingBottom: layout.safeBottomPadding,
      },
    ],
    [],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBadge}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="h3">Ask Ivy</AppText>
                <AppText variant="caption" color="textMuted">
                  Your calm wedding expert
                </AppText>
              </View>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={handleReset}
                style={styles.headerActionButton}
                accessibilityRole="button"
                accessibilityLabel="Clear chat"
              >
                <Ionicons name="refresh-outline" size={18} color={colors.textMuted} />
              </Pressable>
              <Pressable
                onPress={handleClose}
                style={styles.headerActionButton}
                accessibilityRole="button"
                accessibilityLabel="Close chat"
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={scrollContentStyle}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <Bubble
                key={msg.id}
                role={msg.role}
                text={msg.text}
                createdAt={msg.createdAt}
                onRoadmapStagePress={handleOpenRoadmapStage}
                showSuggestions={hasUserMessages && msg.role === 'ivy' && index === messages.length - 1}
                onSuggestionPress={sendUserText}
              />
            ))}

            {showQuickChips ? (
              <View style={styles.quickChipBlock}>
                <View style={styles.quickChipGrid}>
                  {quickChips.map((label) => (
                    <QuickChip
                      key={label}
                      label={label}
                      onPress={() => sendUserText(label)}
                      style={styles.quickChipItem}
                    />
                  ))}
                </View>
                <AppText
                  variant="caption"
                  color="textMuted"
                  align="center"
                  style={styles.emptyNudge}
                >
                  Or type your own question.
                </AppText>
              </View>
            ) : null}
          </ScrollView>

          <View style={composerWrapStyle}>
            {toastText ? (
              <View style={styles.toastPill} pointerEvents="none">
                <AppText variant="caption" color="textMuted">
                  {toastText}
                </AppText>
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <View style={styles.actionIcons}>
                <Pressable
                  onPress={() => showToast('Coming soon')}
                  style={[styles.actionIconButton, styles.actionIconButtonDisabled]}
                  accessibilityRole="button"
                  accessibilityHint="Coming soon"
                >
                  <Ionicons name="camera-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => showToast('Coming soon')}
                  style={[styles.actionIconButton, styles.actionIconButtonDisabled]}
                  accessibilityRole="button"
                  accessibilityHint="Coming soon"
                >
                  <Ionicons name="heart-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => showToast('Coming soon')}
                  style={[styles.actionIconButton, styles.actionIconButtonDisabled]}
                  accessibilityRole="button"
                  accessibilityHint="Coming soon"
                >
                  <Ionicons name="cash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
              {showCharCount ? (
                <AppText variant="caption" color="textMuted">
                  {charCountText}
                </AppText>
              ) : null}
            </View>

            <View style={styles.composerRow}>
              <TextInput
                value={composerText}
                onChangeText={setComposerText}
                placeholder="Ask anything…"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                returnKeyType="send"
                maxLength={MAX_MESSAGE_CHARS}
                onFocus={() => scrollToEnd(true)}
                onSubmitEditing={() => sendUserText(composerText)}
              />
              <Pressable
                onPress={() => sendUserText(composerText)}
                disabled={!canSend}
                style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
                accessibilityRole="button"
                accessibilityLabel="Send"
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  kav: {
    flex: 1,
  },
  header: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.screenPaddingTop,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S16,
    flex: 1,
    paddingRight: S16,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S8,
  },
  headerActionButton: {
    padding: S8,
    borderRadius: S24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.lg,
  },
  quickChipBlock: {
    marginTop: S16,
  },
  quickChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickChipItem: {
    width: '48%',
    marginBottom: S8,
  },
  emptyNudge: {
    marginTop: S16,
  },
  composerWrap: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: colors.background,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: S8,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S8,
  },
  actionIconButton: {
    padding: S8,
    borderRadius: S24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  actionIconButtonDisabled: {
    opacity: 0.6,
  },
  toastPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: S24,
    paddingHorizontal: S16,
    paddingVertical: S8,
    marginBottom: S8,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: S8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: S24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: S16,
    paddingVertical: S16,
    color: colors.text,
    fontFamily: 'Outfit_400Regular',
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: S24,
    padding: S16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral,
  },
});
