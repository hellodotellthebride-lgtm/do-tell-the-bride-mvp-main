import AsyncStorage from '@react-native-async-storage/async-storage';

export const ASK_IVY_STORAGE_KEY = 'askIvy_v1';

export const DEFAULT_ASK_IVY_STATE = {
  dontShowIntro: false,
  messages: [],
};

const createMessageId = () =>
  `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const normalizeRole = (role) => (role === 'user' ? 'user' : 'ivy');

const normalizeMessage = (message) => ({
  id:
    typeof message?.id === 'string' && message.id.trim().length > 0
      ? message.id
      : createMessageId(),
  role: normalizeRole(message?.role),
  text: typeof message?.text === 'string' ? message.text : '',
  createdAt:
    typeof message?.createdAt === 'number' && Number.isFinite(message.createdAt)
      ? message.createdAt
      : Date.now(),
});

const ensureMessages = (messages) =>
  Array.isArray(messages) ? messages.map(normalizeMessage) : [];

export const loadAskIvyState = async () => {
  try {
    const raw = await AsyncStorage.getItem(ASK_IVY_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ASK_IVY_STATE;
    }
    const parsed = JSON.parse(raw);
    return {
      dontShowIntro: Boolean(parsed?.dontShowIntro),
      messages: ensureMessages(parsed?.messages),
    };
  } catch (error) {
    console.warn('[askIvy] unable to load state', error);
    return DEFAULT_ASK_IVY_STATE;
  }
};

export const saveAskIvyState = async (partial = {}) => {
  try {
    const existing = await loadAskIvyState();
    const nextState = {
      dontShowIntro:
        partial.dontShowIntro === undefined
          ? existing.dontShowIntro
          : Boolean(partial.dontShowIntro),
      messages:
        partial.messages === undefined
          ? existing.messages
          : ensureMessages(partial.messages),
    };
    await AsyncStorage.setItem(ASK_IVY_STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  } catch (error) {
    console.warn('[askIvy] unable to save state', error);
    return null;
  }
};

export const clearAskIvyMessages = async () => saveAskIvyState({ messages: [] });

export const setAskIvyDontShowIntro = async (dontShowIntro) =>
  saveAskIvyState({ dontShowIntro: Boolean(dontShowIntro) });

