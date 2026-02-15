import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../components/AppText';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cardPadding, colors, gapLg, gapSm, radius, screenPaddingX, sectionGap } from '../theme';

export default function IvyIntroModal({ visible, onStartChat, onNotNow }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!visible) {
      setDontShowAgain(false);
    }
  }, [visible]);

  const handleStartChat = () => onStartChat?.({ dontShowAgain });
  const handleNotNow = () => onNotNow?.({ dontShowAgain });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleNotNow}
    >
      <View style={styles.overlay}>
        <Card style={styles.card} elevated>
          <View style={styles.iconBadge}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.accent} />
          </View>
          <AppText variant="h2" align="center" style={styles.title}>
            Ask Ivy
          </AppText>
          <AppText variant="bodySmall" color="textMuted" align="center">
            A calm place to ask for wedding scripts, vendor questions, budget help,
            and “what next” guidance — all on your device.
          </AppText>

          <Pressable
            onPress={() => setDontShowAgain((value) => !value)}
            style={styles.checkboxRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: dontShowAgain }}
          >
            <View style={[styles.checkboxBox, dontShowAgain && styles.checkboxBoxChecked]}>
              {dontShowAgain ? (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              ) : null}
            </View>
            <AppText variant="bodySmall">Don’t show this again</AppText>
          </Pressable>

          <View style={styles.buttonStack}>
            <Button label="Start Chat" onPress={handleStartChat} />
            <Button label="Not right now" variant="secondary" onPress={handleNotNow} />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(43,43,43,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: screenPaddingX,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    padding: cardPadding,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf: 'center',
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: gapLg,
  },
  title: {
    marginBottom: gapSm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
    marginTop: sectionGap,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  buttonStack: {
    marginTop: sectionGap,
    gap: gapSm,
  },
});
