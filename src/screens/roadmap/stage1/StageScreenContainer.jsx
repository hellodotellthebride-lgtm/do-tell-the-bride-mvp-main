import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

export default function StageScreenContainer({
  backLabel = 'Back to Kickoff & Vision',
  onBackPress,
  title,
  subtitle,
  children,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBackPress} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color="#6F5B55" />
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={{ height: 16 }} />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: roadmapColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: roadmapSpacing.pageGutter,
    paddingTop: 12,
    paddingBottom: 32,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 4,
    color: '#6F5B55',
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
});
