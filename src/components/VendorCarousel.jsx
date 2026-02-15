import React from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from './AppText';
import { gapLg, gapMd, gapSm, screenPaddingX, spacing } from '../theme';

const PALETTE = {
  coral: '#FF9B85',
  coralTagBg: 'rgba(255,155,133,0.18)',
  coralTagText: '#FF9B85',
  green: '#3F7F63',
  greenBg: '#EAF6EF',
  text: '#262626',
};

export default function VendorCarousel({
  title = 'Vendor Spotlight',
  subtitle = 'A few calm picks to make decisions easier.',
  weddingType,
  location,
  vendors = [],
  onPressVendor,
  onViewAll,
  style,
}) {
  const normalizedWeddingType = (weddingType ?? '').toString().trim().toLowerCase();
  const hasLocation = (location ?? '').toString().trim().length > 0;

  const getReason = (vendor) => {
    const category = (vendor?.category || '').toLowerCase();
    if (category.includes('venue')) return 'Fits your guest size';
    if (category.includes('flor')) return 'Within your budget range';
    if (category.includes('photo')) return 'Warm, natural style';
    if (category.includes('cater')) return 'Comfort-first menus';
    if (category.includes('planner')) return 'Supportive planning style';
    return 'A calm match';
  };

  const matchesWeddingType = (vendor) => {
    if (!normalizedWeddingType) return false;
    const types = Array.isArray(vendor?.weddingTypes) ? vendor.weddingTypes : [];
    return types.some((t) => String(t || '').toLowerCase().includes(normalizedWeddingType));
  };

  const getTrustLabels = (vendor, index) => {
    if (matchesWeddingType(vendor)) return ['Often chosen for similar weddings'];
    if (index === 0) return ['Brides like you loved this'];
    if (hasLocation) return ['Curated for your area'];

    const regions = Array.isArray(vendor?.regions) ? vendor.regions : [];
    if (regions.includes('any')) return ['Reliable availability'];

    return ['A calm favourite'];
  };

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="sparkles-outline" size={18} color={PALETTE.coral} />
        </View>
        <View style={styles.headerText}>
          <AppText variant="h3">{title}</AppText>
          <AppText variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </AppText>
        </View>
        {onViewAll ? (
          <Pressable
            onPress={onViewAll}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="View all vendors"
            style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]}
          >
            <AppText variant="bodySmall" style={styles.viewAllText}>
              View all →
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {vendors.map((vendor, index) => {
          const reason = getReason(vendor);
          const trustLabels = getTrustLabels(vendor, index);
          return (
            <Pressable
              key={vendor.id}
              onPress={() => onPressVendor?.(vendor)}
              accessibilityRole="button"
              accessibilityLabel={`Open vendor: ${vendor.name}`}
              style={({ pressed }) => [styles.vendorCard, pressed && styles.vendorCardPressed]}
            >
              <ImageBackground
                source={{ uri: vendor.image }}
                style={styles.vendorImage}
                imageStyle={styles.vendorImageStyle}
                resizeMode="cover"
              >
                <View style={styles.tagRow}>
                  <View style={styles.categoryTag}>
                    <AppText variant="caption" style={styles.categoryTagText} numberOfLines={1}>
                      {vendor.category}
                    </AppText>
                  </View>
                </View>

                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.60)']} style={styles.gradient} />

                <View style={styles.vendorTextBlock}>
                  <AppText variant="h3" style={styles.vendorName} numberOfLines={2}>
                    {vendor.name}
                  </AppText>
                </View>
              </ImageBackground>

              <View style={styles.pillRow}>
                <View style={styles.reasonPill}>
                  <AppText variant="caption" style={styles.reasonText} numberOfLines={1}>
                    {reason}
                  </AppText>
                </View>
                {trustLabels.map((label) => (
                  <View key={label} style={styles.trustPill}>
                    <Ionicons name="checkmark-circle" size={14} color={PALETTE.green} />
                    <AppText variant="caption" style={styles.trustText} numberOfLines={1}>
                      {label}
                    </AppText>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = 250;
const CARD_IMAGE_HEIGHT = 170;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  wrap: {
    gap: gapLg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: gapMd,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,155,133,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  viewAllButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: gapSm,
  },
  viewAllText: {
    fontFamily: 'Outfit_500Medium',
    color: PALETTE.coral,
  },
  subtitle: {
    color: PALETTE.coral,
  },
  scrollContent: {
    paddingRight: gapLg,
    gap: gapMd,
  },
  vendorCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: 'rgba(0,0,0,0.10)',
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  vendorCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  vendorImage: {
    height: CARD_IMAGE_HEIGHT,
    padding: gapMd,
    justifyContent: 'space-between',
  },
  vendorImageStyle: {
    borderRadius: 20,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: gapSm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    maxWidth: CARD_WIDTH - screenPaddingX,
  },
  categoryTagText: {
    color: PALETTE.text,
    fontFamily: 'Outfit_500Medium',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  vendorTextBlock: {
    paddingTop: gapLg,
  },
  vendorName: {
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay_700Bold',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 6 },
  },
  pillRow: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSm,
    paddingHorizontal: gapMd,
    paddingVertical: gapSm,
  },
  reasonPill: {
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.coralTagBg,
    borderRadius: 999,
    paddingHorizontal: gapSm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.18)',
    maxWidth: CARD_WIDTH - screenPaddingX,
  },
  reasonText: {
    fontFamily: 'Outfit_500Medium',
    color: PALETTE.coralTagText,
  },
  trustPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.greenBg,
    borderRadius: 999,
    paddingHorizontal: gapSm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(63, 127, 99, 0.16)',
    maxWidth: CARD_WIDTH - screenPaddingX,
  },
  trustText: {
    fontFamily: 'Outfit_500Medium',
    color: PALETTE.green,
  },
});
