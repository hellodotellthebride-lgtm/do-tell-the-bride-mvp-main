import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';
import GuestNestHeader from '../components/GuestNestHeader';
import { Button, Card } from '../components/GuestNestUi';
import { useGuestNest } from '../GuestNestProvider';

const groupByCourse = (options = []) => {
  const grouped = { Starter: [], Main: [], Dessert: [], Other: [] };
  (options || []).forEach((opt) => {
    const course = opt?.course || 'Other';
    if (!grouped[course]) grouped[course] = [];
    grouped[course].push(opt);
  });
  Object.keys(grouped).forEach((course) => {
    grouped[course].sort((a, b) =>
      String(a?.dishName || '').localeCompare(String(b?.dishName || ''), undefined, {
        sensitivity: 'base',
      }),
    );
  });
  return grouped;
};

export default function MealOptionsScreen({ navigation }) {
  const { state, actions } = useGuestNest();
  const mealOptions = state.mealOptions || [];
  const grouped = useMemo(() => groupByCourse(mealOptions), [mealOptions]);

  const right = (
    <Pressable
      hitSlop={spacing.sm}
      onPress={() => navigation.navigate('AddMealOption')}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={22} color={colors.text} />
    </Pressable>
  );

  const confirmDelete = (option) => {
    Alert.alert(
      'Delete this meal option?',
      'Guests who had this selected will simply be set back to “no meal chosen”.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => actions.deleteMealOption(option.id),
        },
      ],
    );
  };

  return (
    <Screen>
      <GuestNestHeader title="Meal Options" onBack={() => navigation.goBack()} right={right} />

      {mealOptions.length === 0 ? (
        <Card>
          <AppText variant="h3" style={{ marginBottom: 6 }}>
            No meal options yet
          </AppText>
          <AppText variant="bodySmall" color="textMuted" style={{ marginBottom: spacing.lg }}>
            Add a few choices now, and guests can be assigned later.
          </AppText>
          <Button label="Add Meal Option" onPress={() => navigation.navigate('AddMealOption')} />
        </Card>
      ) : null}

      {Object.entries(grouped).map(([course, options]) => {
        if (!options.length) return null;
        return (
          <Card key={course} style={{ marginBottom: spacing.lg }}>
            <AppText variant="h3" style={{ marginBottom: spacing.md }}>
              {course}
            </AppText>
            {options.map((opt) => (
              <View key={opt.id} style={styles.row}>
                <Pressable
                  hitSlop={6}
                  onPress={() => navigation.navigate('EditMealOption', { mealOptionId: opt.id })}
                  style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]}
                >
                  <View style={{ flex: 1 }}>
                    <AppText variant="body">{opt.dishName || 'Untitled dish'}</AppText>
                    <AppText variant="caption" color="textMuted">
                      Tap to edit
                    </AppText>
                  </View>
                  <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  hitSlop={spacing.sm}
                  onPress={() => confirmDelete(opt)}
                  style={({ pressed }) => [styles.trashButton, pressed && styles.pressed]}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
            ))}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: spacing.sm,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 2,
  },
  trashButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
});
