import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { colors, layout, spacing } from '../theme';

const baseStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: layout.screenPaddingX,
  paddingTop: layout.screenPaddingTop,
};

export default function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  style,
}) {
  if (scroll) {
    return (
      <SafeAreaView style={[baseStyle, style]}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingBottom: layout.safeBottomPadding + spacing.lg,
            },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexGrow: 1 }}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[baseStyle, style]}>
      <View style={{ flex: 1, paddingBottom: layout.safeBottomPadding }}>
        {children}
      </View>
    </SafeAreaView>
  );
}
