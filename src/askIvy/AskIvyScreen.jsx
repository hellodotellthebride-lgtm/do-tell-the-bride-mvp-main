import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import Card from '../components/ui/Card';
import AppText from '../components/AppText';
import Bubble from './components/Bubble';
import QuickChip from './components/QuickChip';
import ThinkingBubble from './components/ThinkingBubble';
import IvyIntroModal from './IvyIntroModal';
import { colors, gapLg, gapMd, gapSm, radius, screenPaddingX, sectionGap, spacing } from '../theme';
import { respondToUser } from './ivyResponder';
import {
  clearAskIvyMessages,
  loadAskIvyState,
  saveAskIvyState,
  setAskIvyDontShowIntro,
} from './ivyStorage';
import { GUEST_NEST_STORAGE_KEY } from '../guestNest/guestNestStorage';
import { computeStageProgress, loadChecklistState } from '../roadmap/progressStorage';
import { getChecklistItems } from '../roadmap/checklists';

const MAX_MESSAGE_CHARS = 1000;
const CHAR_COUNT_WARNING_AT = 900;
const WELCOME_BACK_AFTER_MS = 1000 * 60 * 60 * 24 * 7;

const createMessageId = () => `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const WEDDING_DATE_STORAGE_KEY = 'ONBOARDING_WEDDING_DATE';
const BUDGET_STORAGE_KEY = 'BUDGET_BUDDY_STATE';

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

const safeJsonParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

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
  return 'Hi, I’m Ivy. Tell me what you’re navigating — we’ll keep it calm and practical.';
};

const buildGreeting = (context) => ({
  id: createMessageId(),
  role: 'ivy',
  text: resolveGreetingText(context || {}),
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

export default function AskIvyScreen({ navigation }) {
  const scrollRef = useRef(null);
  const toastTimerRef = useRef(null);
  const thinkingTimerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [composerText, setComposerText] = useState('');
  const [toastText, setToastText] = useState('');
  const [introVisible, setIntroVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

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

  const closeScreen = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Home');
  }, [navigation]);

  const ensureGreeting = useCallback(async () => {
    const context = await loadIvyContext();
    const greeting = buildGreeting(context);
    setMessages([greeting]);
    await saveAskIvyState({ messages: [greeting] });
    scrollToEnd(false);
  }, [scrollToEnd]);

  const handleStartChat = useCallback(
    async ({ dontShowAgain }) => {
      await setAskIvyDontShowIntro(Boolean(dontShowAgain));
      setIntroVisible(false);
      await ensureGreeting();
    },
    [ensureGreeting],
  );

  const handleNotNow = useCallback(
    async ({ dontShowAgain }) => {
      if (dontShowAgain) {
        await setAskIvyDontShowIntro(true);
      }
      setIntroVisible(false);
      closeScreen();
    },
    [closeScreen],
  );

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const state = await loadAskIvyState();
      if (!mounted) return;

      const storedMessages = Array.isArray(state.messages) ? state.messages : [];
      const needsIntro = !state.dontShowIntro && storedMessages.length === 0;
      if (needsIntro) {
        setIntroVisible(true);
        setMessages([]);
        return;
      }

      let hydratedMessages = storedMessages;
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
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
    };
  }, [scrollToEnd]);

  useEffect(() => {
    scrollToEnd(true);
  }, [messages.length, isThinking, scrollToEnd]);

  useEffect(() => {
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
  }, [scrollToEnd]);

  const handleReset = useCallback(() => {
    Alert.alert('Clear this chat?', 'This removes messages from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setComposerText('');
          setIsThinking(false);
          if (thinkingTimerRef.current) {
            clearTimeout(thinkingTimerRef.current);
            thinkingTimerRef.current = null;
          }
          setMessages([]);
          await clearAskIvyMessages();
          await ensureGreeting();
        },
      },
    ]);
  }, [ensureGreeting]);

  const handleOpenRoadmapStage = useCallback(
    (stageId) => {
      const id = String(stageId || '').trim();
      const stage = ROADMAP_STAGE_MAP[id];
      const routeName = stage?.routeName || 'WeddingRoadmap';
      navigation?.navigate?.(routeName);
    },
    [navigation],
  );

  const sendUserText = useCallback(
    (rawText) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed) return;
      if (isThinking) return;

      setComposerText('');

      const userMessage = {
        id: createMessageId(),
        role: 'user',
        text: trimmed,
        createdAt: Date.now(),
      };
      appendMessages([userMessage]);

      setIsThinking(true);
      const contextPromise = loadIvyContext();
      const delayMs = 420 + Math.round(Math.random() * 180);

      thinkingTimerRef.current = setTimeout(() => {
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
          })
          .finally(() => {
            setIsThinking(false);
            thinkingTimerRef.current = null;
          });
      }, delayMs);
    },
    [appendMessages, isThinking],
  );

  const canSend = composerText.trim().length > 0 && !isThinking;
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

  return (
    <>
      <Screen scroll={false} ivyHelp={false} contentContainerStyle={styles.screenContent}>
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
                onPress={closeScreen}
                style={styles.headerActionButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
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

            {isThinking ? <ThinkingBubble /> : null}

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
                <AppText variant="caption" color="textMuted" align="center" style={styles.emptyNudge}>
                  Or type your own question.
                </AppText>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.composerWrap}>
            {toastText ? (
              <Card elevated={false} padding={gapMd} style={styles.toastPill}>
                <AppText variant="caption" color="textMuted">
                  {toastText}
                </AppText>
              </Card>
            ) : null}

            <View style={styles.actionRow}>
              <View style={styles.actionIcons}>
                <Pressable
                  onPress={() => showToast('Coming soon')}
                  style={({ pressed }) => [
                    styles.actionIconButton,
                    pressed && styles.actionIconButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityHint="Coming soon"
                >
                  <Ionicons name="camera-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => showToast('Coming soon')}
                  style={({ pressed }) => [
                    styles.actionIconButton,
                    pressed && styles.actionIconButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityHint="Coming soon"
                >
                  <Ionicons name="heart-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => showToast('Coming soon')}
                  style={({ pressed }) => [
                    styles.actionIconButton,
                    pressed && styles.actionIconButtonPressed,
                  ]}
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
                style={({ pressed }) => [
                  styles.sendButton,
                  !canSend && styles.sendButtonDisabled,
                  pressed && canSend && styles.sendButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Send"
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Screen>

      <IvyIntroModal visible={introVisible} onStartChat={handleStartChat} onNotNow={handleNotNow} />
    </>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
  kav: {
    flex: 1,
  },
  header: {
    paddingTop: gapLg,
    paddingBottom: gapLg,
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
    gap: gapLg,
    flex: 1,
    paddingRight: gapLg,
  },
  headerIconBadge: {
    width: spacing.giant,
    height: spacing.giant,
    borderRadius: spacing.giant / 2,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
  },
  headerActionButton: {
    padding: gapSm,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: gapLg,
    paddingBottom: sectionGap,
  },
  quickChipBlock: {
    marginTop: gapLg,
  },
  quickChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickChipItem: {
    width: '48%',
    marginBottom: gapSm,
  },
  emptyNudge: {
    marginTop: gapLg,
  },
  composerWrap: {
    paddingTop: gapLg,
    paddingBottom: screenPaddingX,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: colors.background,
  },
  toastPill: {
    alignSelf: 'flex-start',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: gapSm,
    marginBottom: gapSm,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
  },
  actionIconButton: {
    padding: gapSm,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    opacity: 0.75,
  },
  actionIconButtonPressed: {
    opacity: 0.55,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: gapSm,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: gapLg,
    paddingVertical: gapLg,
    color: colors.text,
    fontFamily: 'Outfit_400Regular',
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    padding: gapLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    opacity: 0.9,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral,
  },
});
