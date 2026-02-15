import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { roadmapColors, roadmapRadius, roadmapSpacing } from './tokens';

export default function GuideStepCard({ index, total, title, bullets, scripts }) {
  const stepLabel = typeof index === 'number' ? `STEP ${index + 1}` : 'STEP';
  const safeBullets = Array.isArray(bullets) ? bullets : [];
  const safeScripts = Array.isArray(scripts) ? scripts : [];

  return (
    <View style={styles.card}>
      <Text style={styles.stepLabel}>
        {stepLabel}
        {typeof total === 'number' ? `  •  ${index + 1} / ${total}` : ''}
      </Text>
      <Text style={styles.title}>{title}</Text>

      {safeBullets.length ? (
        <View style={styles.bullets}>
          {safeBullets.map((line) => (
            <Text key={line} style={styles.bulletText}>
              • {line}
            </Text>
          ))}
        </View>
      ) : null}

      {safeScripts.length ? (
        <View style={styles.scripts}>
          {safeScripts.map((script) => (
            <View key={script.label ?? script.text} style={styles.scriptCard}>
              {script.label ? <Text style={styles.scriptLabel}>{script.label}</Text> : null}
              <Text style={styles.scriptText}>{script.text}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: roadmapRadius,
    padding: roadmapSpacing.cardPadding,
    shadowColor: roadmapColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 1,
    gap: 10,
  },
  stepLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  bullets: {
    gap: 8,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  scripts: {
    gap: 10,
  },
  scriptCard: {
    borderRadius: roadmapRadius,
    backgroundColor: 'rgba(255,155,133,0.10)',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.25)',
  },
  scriptLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scriptText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.textDark,
  },
});

