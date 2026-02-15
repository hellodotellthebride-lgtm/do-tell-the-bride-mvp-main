import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

export default function RecommendedNextStepCard({
  title,
  body,
  ctaLabel = 'Continue',
  onPress,
}) {
  return (
    <View style={styles.shadow}>
      <View style={styles.wrap}>
        <View style={styles.accent} />
        <View style={styles.content}>
          <Text style={styles.kicker}>RECOMMENDED NEXT STEP</Text>
          <Text style={styles.title}>{title}</Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}

          <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            hitSlop={8}
          >
            <Text style={styles.buttonText}>{ctaLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    backgroundColor: 'transparent',
  },
  wrap: {
    borderRadius: 28,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accent: {
    width: 4,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textSecondary,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    fontFamily: 'Outfit_400Regular',
    marginBottom: 16,
  },
  button: {
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
});
