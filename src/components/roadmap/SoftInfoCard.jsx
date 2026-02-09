import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { roadmapColors, roadmapRadius, roadmapSpacing } from './tokens';

export default function SoftInfoCard({ eyebrow, title, body, children }) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: roadmapColors.surface,
    borderRadius: roadmapRadius,
    padding: roadmapSpacing.cardPadding,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    marginBottom: 6,
  },
  body: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
    lineHeight: 22,
  },
});
