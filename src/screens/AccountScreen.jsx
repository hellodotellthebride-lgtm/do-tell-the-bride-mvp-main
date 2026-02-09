import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const STORAGE_KEYS = {
  firstName: 'ONBOARDING_FIRST_NAME',
  partnerName: 'ONBOARDING_PARTNER_NAME',
  weddingDate: 'ONBOARDING_WEDDING_DATE',
  email: 'ACCOUNT_EMAIL',
  weddingLocation: 'ACCOUNT_WEDDING_LOCATION',
  weddingType: 'ACCOUNT_WEDDING_TYPE',
  timezone: 'ACCOUNT_TIMEZONE',
  countdownMode: 'ACCOUNT_COUNTDOWN_MODE',
  planningPace: 'ACCOUNT_PLANNING_PACE',
  notifications: 'ACCOUNT_NOTIFICATIONS',
  currency: 'ACCOUNT_CURRENCY',
  guestEstimate: 'ACCOUNT_GUEST_ESTIMATE',
  budgetVisibility: 'ACCOUNT_BUDGET_VISIBILITY',
  collaborator: 'ACCOUNT_COLLABORATOR',
  appearance: 'ACCOUNT_APPEARANCE',
  accessibility: 'ACCOUNT_ACCESSIBILITY',
  language: 'ACCOUNT_LANGUAGE',
};

const DEFAULT_NOTIFICATIONS = {
  planning: true,
  budget: false,
  weddingWeek: true,
};

const DEFAULT_ACCESSIBILITY = {
  largeText: false,
  reducedMotion: false,
};

const formatOrdinal = (day) => {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const parseStoredDate = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const normalized = trimmed.replace(/\s/g, '');
  const match = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const candidate = new Date(year, month, day);
    if (
      candidate.getFullYear() === year &&
      candidate.getMonth() === month &&
      candidate.getDate() === day
    ) {
      return candidate;
    }
  }
  return null;
};

const formatDisplayDate = (date) => {
  if (!date) return 'Add your wedding date';
  const day = date.getDate();
  const suffix = formatOrdinal(day);
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${day}${suffix} ${month} ${date.getFullYear()}`;
};

const parseDigitsToDate = (digits) => {
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  ) {
    return null;
  }
  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return null;
  }
  return candidate;
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Row = ({ label, value, onPress, helper, destructive }) => (
  <Pressable onPress={onPress} style={styles.row} hitSlop={8}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
      {value ? (
        <Text style={styles.rowValue} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Text>
      ) : null}
      {helper ? <Text style={styles.rowHelper}>{helper}</Text> : null}
    </View>
    {onPress ? <Ionicons name="chevron-forward" size={16} color="#9C8E87" /> : null}
  </Pressable>
);

const ToggleRow = ({ label, value, onValueChange }) => (
  <View style={[styles.row, styles.toggleRow]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor={value ? '#FF9B85' : '#f4f3f4'}
      trackColor={{ false: '#d9d2ca', true: 'rgba(255,155,133,0.4)' }}
    />
  </View>
);

const ChipGroup = ({ options, value, onChange }) => (
  <View style={styles.chipGroup}>
    {options.map((option) => {
      const active = option.value === value;
      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.chip, active && styles.chipActive]}
          hitSlop={8}
        >
          <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const SegmentedDateField = ({
  day,
  month,
  year,
  activeSegment,
  onSegmentFocus,
  onSegmentChange,
  onBackspaceFromEmpty,
}) => {
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const focusSegment = useCallback((segment) => {
    switch (segment) {
      case 'day':
        dayRef.current?.focus();
        break;
      case 'month':
        monthRef.current?.focus();
        break;
      case 'year':
      default:
        yearRef.current?.focus();
        break;
    }
  }, []);

  React.useEffect(() => {
    focusSegment(activeSegment);
  }, [activeSegment, focusSegment]);

  const segments = [
    { key: 'day', label: 'DD', value: day, maxLength: 2, ref: dayRef },
    { key: 'month', label: 'MM', value: month, maxLength: 2, ref: monthRef },
    { key: 'year', label: 'YYYY', value: year, maxLength: 4, ref: yearRef },
  ];

  return (
    <View style={styles.segmentedField}>
      {segments.map((segment, index) => (
        <React.Fragment key={segment.key}>
          <TextInput
            ref={segment.ref}
            value={segment.value}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder={segment.label}
            placeholderTextColor="#b9b2aa"
            maxLength={segment.maxLength}
            onFocus={() => onSegmentFocus(segment.key)}
            onChangeText={(text) => onSegmentChange(segment.key, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && segment.value.length === 0) {
                onBackspaceFromEmpty(segment.key);
              }
            }}
            style={[styles.segmentInput, segment.key === 'year' && styles.segmentInputYear, activeSegment === segment.key && styles.segmentInputActive]}
            textAlign="center"
            selectionColor="#f2b6a6"
          />
          {index < segments.length - 1 && <Text style={styles.segmentSeparator}>/</Text>}
        </React.Fragment>
      ))}
    </View>
  );
};

export default function AccountScreen({ navigation }) {
  const [profile, setProfile] = useState({
    firstName: '',
    partnerName: '',
    email: '',
    weddingDate: '',
    weddingLocation: '',
    weddingType: 'Single day',
    timezone: '',
    currency: 'GBP',
    guestEstimate: '',
    budgetVisibility: 'totals',
    collaborator: 'you',
  });
  const [countdownMode, setCountdownMode] = useState('days');
  const [planningPace, setPlanningPace] = useState('standard');
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [appearance, setAppearance] = useState('system');
  const [accessibility, setAccessibility] = useState(DEFAULT_ACCESSIBILITY);
  const [language, setLanguage] = useState('English');
  const [modalConfig, setModalConfig] = useState(null);
  const [modalValue, setModalValue] = useState('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateSegments, setDateSegments] = useState({ day: '', month: '', year: '' });
  const [activeSegment, setActiveSegment] = useState('day');
  const [modalPasswordConfirm, setModalPasswordConfirm] = useState('');

  const hydrate = useCallback(async () => {
    try {
      const values = await Promise.all(
        Object.values(STORAGE_KEYS).map((key) => AsyncStorage.getItem(key)),
      );
      const entries = Object.keys(STORAGE_KEYS).reduce((acc, field, index) => {
        acc[field] = values[index];
        return acc;
      }, {});
      setProfile((prev) => ({
        ...prev,
        firstName: entries.firstName ?? prev.firstName,
        partnerName: entries.partnerName ?? prev.partnerName,
        email: entries.email ?? prev.email,
        weddingDate: entries.weddingDate ?? prev.weddingDate,
        weddingLocation: entries.weddingLocation ?? prev.weddingLocation,
        weddingType: entries.weddingType ?? prev.weddingType,
        timezone: entries.timezone ?? prev.timezone,
        currency: entries.currency ?? prev.currency,
        guestEstimate: entries.guestEstimate ?? prev.guestEstimate,
        budgetVisibility: entries.budgetVisibility ?? prev.budgetVisibility,
        collaborator: entries.collaborator ?? prev.collaborator,
      }));
      if (entries.countdownMode) setCountdownMode(entries.countdownMode);
      if (entries.planningPace) setPlanningPace(entries.planningPace);
      if (entries.notifications) {
        setNotifications((prev) => ({ ...prev, ...JSON.parse(entries.notifications) }));
      }
      if (entries.appearance) setAppearance(entries.appearance);
      if (entries.accessibility) {
        setAccessibility((prev) => ({ ...prev, ...JSON.parse(entries.accessibility) }));
      }
      if (entries.language) setLanguage(entries.language);
    } catch (error) {
      console.warn('Unable to load account settings', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate]),
  );

  const persistValue = async (key, value) => {
    try {
      if (typeof value === 'string') {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('Unable to save preference', error);
    }
  };

  const openTextModal = (key, label, initialValue = '', options = {}) => {
    setModalConfig({ key, label, ...options });
    setModalValue(initialValue);
    setModalPasswordConfirm('');
  };

  const closeModals = () => {
    setModalConfig(null);
    setModalValue('');
    setModalPasswordConfirm('');
  };

  const handleSaveModal = async () => {
    if (!modalConfig) return;
    if (modalConfig.key === 'password') {
      closeModals();
      Alert.alert('Password updated', 'We saved your new password.');
      return;
    }
    await persistValue(STORAGE_KEYS[modalConfig.key], modalValue);
    setProfile((prev) => ({ ...prev, [modalConfig.key]: modalValue }));
    closeModals();
  };

  const openDateModal = () => {
    const date = parseStoredDate(profile.weddingDate);
    setDateSegments({
      day: date ? String(date.getDate()).padStart(2, '0') : '',
      month: date ? String(date.getMonth() + 1).padStart(2, '0') : '',
      year: date ? String(date.getFullYear()) : '',
    });
    setActiveSegment('day');
    setDateModalVisible(true);
  };

  const closeDateModal = () => {
    setDateModalVisible(false);
    setActiveSegment('day');
  };

  const handleSegmentChange = (segment, text) => {
    const sanitized = text.replace(/\D/g, '');
    const max = segment === 'year' ? 4 : 2;
    const trimmed = sanitized.slice(0, max);
    setDateSegments((prev) => ({ ...prev, [segment]: trimmed }));
    if (trimmed.length === max) {
      if (segment === 'day') setActiveSegment('month');
      if (segment === 'month') setActiveSegment('year');
    }
  };

  const handleSegmentBackspace = (segment) => {
    if (segment === 'month') setActiveSegment('day');
    if (segment === 'year') setActiveSegment('month');
  };

  const handleSaveDate = async () => {
    const digits = `${dateSegments.day}${dateSegments.month}${dateSegments.year}`;
    const parsed = parseDigitsToDate(digits);
    if (!parsed) {
      Alert.alert('Invalid date', 'That date doesn’t look right — want to check it?');
      return;
    }
    const iso = parsed.toISOString();
    await persistValue(STORAGE_KEYS.weddingDate, iso);
    setProfile((prev) => ({ ...prev, weddingDate: iso }));
    closeDateModal();
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => console.log('Logged out') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will remove your data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
      ],
    );
  };

  const weddingDateDisplay = useMemo(
    () => formatDisplayDate(parseStoredDate(profile.weddingDate)),
    [profile.weddingDate],
  );

  const backToHome = () => navigation?.goBack?.();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={backToHome} hitSlop={8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={18} color="#6F5B55" />
            <Text style={styles.backText}>Home</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={styles.headerSubtitle}>Your details, your wedding, your preferences.</Text>

        <Section title="Account details">
          <Row
            label="Your name"
            value={profile.firstName || 'Not set'}
            onPress={() => openTextModal('firstName', 'Your name', profile.firstName, { autoCapitalize: 'words' })}
          />
          <Row
            label="Partner’s name"
            value={profile.partnerName || 'Not set'}
            onPress={() => openTextModal('partnerName', 'Partner’s name', profile.partnerName, { autoCapitalize: 'words' })}
          />
          <Row
            label="Email address"
            value={profile.email || 'Add email'}
            onPress={() => openTextModal('email', 'Email address', profile.email, { keyboardType: 'email-address' })}
          />
          <Row
            label="Password / security"
            value="••••••••"
            onPress={() => openTextModal('password', 'Update password', '')}
          />
          <Row label="Log out" onPress={handleLogout} destructive />
        </Section>

        <Section title="Wedding details">
          <Row label="Wedding date" value={weddingDateDisplay} onPress={openDateModal} />
          <Row
            label="Wedding location"
            value={profile.weddingLocation || 'Add location'}
            onPress={() => openTextModal('weddingLocation', 'Wedding location', profile.weddingLocation, { autoCapitalize: 'words' })}
          />
          <Row
            label="Wedding type"
            value={profile.weddingType}
            onPress={() => openTextModal('weddingType', 'Wedding type', profile.weddingType)}
          />
          <Row
            label="Timezone"
            value={profile.timezone || 'Set timezone'}
            onPress={() => openTextModal('timezone', 'Timezone', profile.timezone)}
          />
        </Section>

        <Section title="Planning preferences">
          <Text style={styles.sectionHelper}>Countdown display mode</Text>
          <ChipGroup
            options={[
              { label: 'Days only', value: 'days' },
              { label: 'Days + hours', value: 'daysHours' },
            ]}
            value={countdownMode}
            onChange={async (val) => {
              setCountdownMode(val);
              await persistValue(STORAGE_KEYS.countdownMode, val);
            }}
          />

          <Text style={styles.sectionHelper}>Planning pace</Text>
          <ChipGroup
            options={[
              { label: 'Gentle', value: 'gentle' },
              { label: 'Standard', value: 'standard' },
              { label: 'Intensive', value: 'intensive' },
            ]}
            value={planningPace}
            onChange={async (val) => {
              setPlanningPace(val);
              await persistValue(STORAGE_KEYS.planningPace, val);
            }}
          />

          <View style={styles.toggleGroup}>
            <ToggleRow
              label="Planning reminders"
              value={notifications.planning}
              onValueChange={async (next) => {
                const updated = { ...notifications, planning: next };
                setNotifications(updated);
                await persistValue(STORAGE_KEYS.notifications, updated);
              }}
            />
            <ToggleRow
              label="Budget reminders"
              value={notifications.budget}
              onValueChange={async (next) => {
                const updated = { ...notifications, budget: next };
                setNotifications(updated);
                await persistValue(STORAGE_KEYS.notifications, updated);
              }}
            />
            <ToggleRow
              label="Wedding week alerts"
              value={notifications.weddingWeek}
              onValueChange={async (next) => {
                const updated = { ...notifications, weddingWeek: next };
                setNotifications(updated);
                await persistValue(STORAGE_KEYS.notifications, updated);
              }}
            />
          </View>
        </Section>

        <Section title="Budget & guests">
          <Row
            label="Currency"
            value={profile.currency}
            onPress={() => openTextModal('currency', 'Currency', profile.currency.toUpperCase())}
          />
          <Row
            label="Estimated guest count"
            value={profile.guestEstimate || 'Not set'}
            onPress={() => openTextModal('guestEstimate', 'Estimated guest count', profile.guestEstimate, { keyboardType: 'number-pad' })}
          />
          <Text style={styles.sectionHelper}>Budget visibility</Text>
          <ChipGroup
            options={[
              { label: 'Totals only', value: 'totals' },
              { label: 'Line items', value: 'line-items' },
            ]}
            value={profile.budgetVisibility}
            onChange={async (val) => {
              setProfile((prev) => ({ ...prev, budgetVisibility: val }));
              await persistValue(STORAGE_KEYS.budgetVisibility, val);
            }}
          />
          <Text style={styles.sectionHelper}>Who can edit</Text>
          <ChipGroup
            options={[
              { label: 'You', value: 'you' },
              { label: 'Partner', value: 'partner' },
              { label: 'Both', value: 'both' },
            ]}
            value={profile.collaborator}
            onChange={async (val) => {
              setProfile((prev) => ({ ...prev, collaborator: val }));
              await persistValue(STORAGE_KEYS.collaborator, val);
            }}
          />
        </Section>

        <Section title="App preferences">
          <Text style={styles.sectionHelper}>Appearance</Text>
          <ChipGroup
            options={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
            value={appearance}
            onChange={async (val) => {
              setAppearance(val);
              await persistValue(STORAGE_KEYS.appearance, val);
            }}
          />
          <ToggleRow
            label="Larger text"
            value={accessibility.largeText}
            onValueChange={async (next) => {
              const updated = { ...accessibility, largeText: next };
              setAccessibility(updated);
              await persistValue(STORAGE_KEYS.accessibility, updated);
            }}
          />
          <ToggleRow
            label="Reduced motion"
            value={accessibility.reducedMotion}
            onValueChange={async (next) => {
              const updated = { ...accessibility, reducedMotion: next };
              setAccessibility(updated);
              await persistValue(STORAGE_KEYS.accessibility, updated);
            }}
          />
          <Row
            label="Language"
            value={language}
            onPress={() => openTextModal('language', 'Language', language)}
          />
        </Section>

        <Section title="Support & trust">
          <Row label="Help & FAQs" onPress={() => Alert.alert('Help', 'Coming soon.')} />
          <Row label="Contact support" onPress={() => Alert.alert('Support', 'Email hello@dotellthebride.com')} />
          <Row label="Privacy & data" onPress={() => Alert.alert('Privacy', 'View privacy policy')} />
          <Row label="Terms" onPress={() => Alert.alert('Terms', 'View terms of service')} />
          <Row label="Delete account" onPress={handleDeleteAccount} destructive />
        </Section>
      </ScrollView>

      <Modal transparent animationType="fade" visible={!!modalConfig} onRequestClose={closeModals}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModals} />
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{modalConfig?.label}</Text>
              {modalConfig?.key === 'password' ? (
                <>
                  <TextInput
                    value={modalValue}
                    onChangeText={setModalValue}
                    placeholder="New password"
                    secureTextEntry
                    style={styles.modalInput}
                  />
                  <TextInput
                    value={modalPasswordConfirm}
                    onChangeText={setModalPasswordConfirm}
                    placeholder="Confirm password"
                    secureTextEntry
                    style={styles.modalInput}
                  />
                </>
              ) : (
                <TextInput
                  value={modalValue}
                  onChangeText={setModalValue}
                  placeholder={modalConfig?.placeholder}
                  autoCapitalize={modalConfig?.autoCapitalize || 'sentences'}
                  keyboardType={modalConfig?.keyboardType || 'default'}
                  style={styles.modalInput}
                />
              )}
              <View style={styles.modalActions}>
                <Pressable onPress={closeModals} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleSaveModal} style={[styles.modalButton, styles.modalButtonPrimary]}>
                  <Text style={styles.modalButtonPrimaryText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={dateModalVisible} onRequestClose={closeDateModal}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDateModal} />
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add your wedding date</Text>
              <SegmentedDateField
                day={dateSegments.day}
                month={dateSegments.month}
                year={dateSegments.year}
                activeSegment={activeSegment}
                onSegmentFocus={setActiveSegment}
                onSegmentChange={handleSegmentChange}
                onBackspaceFromEmpty={handleSegmentBackspace}
              />
              <View style={styles.modalActions}>
                <Pressable onPress={closeDateModal} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleSaveDate} style={[styles.modalButton, styles.modalButtonPrimary]}>
                  <Text style={styles.modalButtonPrimaryText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF8',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  backText: {
    fontSize: 14,
    color: '#6F5B55',
    fontFamily: 'Outfit_500Medium',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#2B2B2B',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E867E',
    marginBottom: 16,
    fontFamily: 'Outfit_400Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 1.2,
    color: '#B0A79F',
    fontFamily: 'Outfit_500Medium',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  rowLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#2B2B2B',
  },
  rowLabelDestructive: {
    color: '#D0665F',
  },
  rowValue: {
    fontSize: 14,
    color: '#8E867E',
    marginTop: 4,
    fontFamily: 'Outfit_400Regular',
  },
  rowHelper: {
    fontSize: 13,
    color: '#B0A79F',
    marginTop: 2,
  },
  toggleRow: {
    justifyContent: 'space-between',
  },
  toggleGroup: {
    marginTop: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5DCD4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFFDF9',
  },
  chipActive: {
    backgroundColor: 'rgba(255,155,133,0.15)',
    borderColor: '#FF9B85',
  },
  chipLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: '#8E867E',
  },
  chipLabelActive: {
    color: '#F06F54',
  },
  sectionHelper: {
    fontSize: 13,
    color: '#B0A79F',
    marginBottom: 6,
    paddingHorizontal: 12,
    fontFamily: 'Outfit_400Regular',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#2B2B2B',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#2B2B2B',
    backgroundColor: '#FFFDF9',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    fontSize: 15,
    color: '#8E867E',
  },
  modalButtonPrimary: {
    backgroundColor: '#FF9B85',
    borderRadius: 999,
  },
  modalButtonPrimaryText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Outfit_500Medium',
  },
  segmentedField: {
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#FFFDF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  segmentInput: {
    width: 56,
    fontSize: 18,
    fontFamily: 'Outfit_500Medium',
    color: '#2B2B2B',
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  segmentInputYear: {
    width: 92,
  },
  segmentInputActive: {
    backgroundColor: 'rgba(255,155,133,0.12)',
    borderRadius: 12,
  },
  segmentSeparator: {
    fontSize: 18,
    color: '#C6BFB8',
    fontFamily: 'Outfit_500Medium',
  },
});
