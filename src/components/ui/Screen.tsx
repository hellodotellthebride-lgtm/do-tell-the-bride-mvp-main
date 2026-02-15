import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gapLg, screenPaddingX, spacing } from '../../theme';
import IvyHelpFab from './IvyHelpFab';

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  backgroundColor?: string;
  ivyHelp?: boolean;
};

export default function Screen({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  edges = ['top', 'bottom'],
  backgroundColor = colors.background,
  ivyHelp = true,
}: ScreenProps) {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    { backgroundColor },
    style,
  ];

  if (scroll) {
    return (
      <SafeAreaView style={containerStyle} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.grow}>{children}</View>
        </ScrollView>
        {ivyHelp ? <IvyHelpFab /> : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle} edges={edges}>
      <View style={[styles.fixedContent, contentContainerStyle]}>{children}</View>
      {ivyHelp ? <IvyHelpFab /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPaddingX,
  },
  scrollContent: {
    paddingTop: gapLg,
    paddingBottom: screenPaddingX + spacing.lg,
  },
  fixedContent: {
    flex: 1,
    paddingTop: gapLg,
    paddingBottom: screenPaddingX,
  },
  grow: {
    flexGrow: 1,
  },
});
