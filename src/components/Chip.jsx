import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const Chip = ({ label, done = false, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.chip, done ? styles.chipDone : styles.chipDefault]}
    >
      <Text style={[styles.chipText, done ? styles.chipTextDone : styles.chipTextDefault]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipDefault: {
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#FFFDF9',
  },
  chipDone: {
    borderColor: 'rgba(255,155,133,0.35)',
    backgroundColor: 'rgba(255,155,133,0.18)',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
  },
  chipTextDefault: {
    color: '#6F5B55',
  },
  chipTextDone: {
    color: '#F05F40',
  },
});

export default Chip;
