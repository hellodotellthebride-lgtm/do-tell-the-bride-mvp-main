import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import Card from '../components/ui/Card';
import AppText from '../components/AppText';
import { colors, gapLg, gapSm, screenPaddingX, sectionGap, spacing } from '../theme';
import CalmTile from './components/CalmTile';

const GRID_GAP = gapLg;
const TILE_MIN_HEIGHT = spacing.jumbo * 4 + gapLg;

const TILES = [
  {
    id: 'breathing',
    title: 'Breathing Tools',
    description: 'Quick resets for stressy moments.',
    iconName: 'cloud-outline',
    tint: '#E9F3ED',
    routeName: 'CalmBreathing',
  },
  {
    id: 'meditations',
    title: 'Meditations',
    description: 'Audio guides for calm clarity.',
    iconName: 'headset-outline',
    tint: '#EEF3FF',
    routeName: 'CalmMeditations',
  },
  {
    id: 'scripts',
    title: 'Calm Scripts',
    description: 'What to say in tricky moments.',
    iconName: 'chatbubble-ellipses-outline',
    tint: '#FFEDE6',
    routeName: 'CalmScripts',
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Wind down before wedding planning.',
    iconName: 'moon-outline',
    tint: '#F2EEFF',
    routeName: 'CalmSleep',
  },
];

export default function CalmCornerScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const tileWidth = useMemo(() => {
    const available = Math.max(0, width - screenPaddingX * 2 - GRID_GAP);
    return available / 2;
  }, [width]);

  const handleBack = () => navigation?.goBack?.();

  return (
    <Screen scroll>
      <Pressable
        onPress={handleBack}
        hitSlop={{ top: gapSm, bottom: gapSm, left: gapSm, right: gapSm }}
        style={({ pressed }) => [styles.backRow, pressed && styles.backRowPressed]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={20} color={colors.text} />
        <AppText variant="bodySmall" color="textMuted">
          Back
        </AppText>
      </Pressable>

      <Card backgroundColor={colors.surface} style={styles.heroCard}>
        <AppText variant="h1">Calm Corner</AppText>
        <AppText variant="bodySmall" color="textMuted" style={styles.subtitle}>
          For when planning feels like too much.
        </AppText>

        <View style={styles.quickRow}>
          <Pressable
            onPress={() => navigation?.navigate?.('CalmBreathing')}
            hitSlop={{ top: gapSm, bottom: gapSm, left: gapSm, right: gapSm }}
            accessibilityRole="button"
            accessibilityLabel="Open 2-minute reset"
            style={({ pressed }) => [styles.quickChip, pressed && styles.quickChipPressed]}
          >
            <Ionicons name="timer-outline" size={16} color={colors.success} />
            <AppText variant="bodySmall" style={styles.quickText}>
              2-minute reset
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => navigation?.navigate?.('CalmScripts')}
            hitSlop={{ top: gapSm, bottom: gapSm, left: gapSm, right: gapSm }}
            accessibilityRole="button"
            accessibilityLabel="Open what to say when someone’s upset"
            style={({ pressed }) => [styles.quickChip, pressed && styles.quickChipPressed]}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.success} />
            <AppText variant="bodySmall" style={styles.quickText}>
              What to say when someone’s upset
            </AppText>
          </Pressable>
        </View>
      </Card>

      <View style={styles.grid}>
        {TILES.map((tile) => (
          <CalmTile
            key={tile.id}
            title={tile.title}
            description={tile.description}
            iconName={tile.iconName}
            tint={tile.tint}
            onPress={() => navigation?.navigate?.(tile.routeName)}
            style={{
              width: tileWidth,
              minHeight: TILE_MIN_HEIGHT,
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
    marginBottom: gapLg,
    alignSelf: 'flex-start',
  },
  backRowPressed: {
    opacity: 0.85,
  },
  heroCard: {
    marginBottom: sectionGap,
  },
  subtitle: {
    marginTop: gapSm,
  },
  quickRow: {
    marginTop: gapLg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSm,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
    paddingVertical: gapSm,
    paddingHorizontal: gapLg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(115,180,156,0.35)',
    backgroundColor: '#FFFFFF',
  },
  quickChipPressed: {
    opacity: 0.9,
  },
  quickText: {
    fontFamily: 'Outfit_500Medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    justifyContent: 'flex-start',
  },
});
