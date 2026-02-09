import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProgressPill = ({ label }) => {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  pillText: {
    fontSize: 12,
    color: '#6F5B55',
    fontFamily: 'Outfit_500Medium',
  },
});

export default ProgressPill;
