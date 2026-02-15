import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '../../components/ui/Card';
import AppText from '../../components/AppText';
import { colors, gapMd, gapSm } from '../../theme';

export default function ThinkingBubble() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((value) => (value + 1) % 4);
    }, 420);
    return () => clearInterval(interval);
  }, []);

  const dots = useMemo(() => {
    if (step === 1) return '.';
    if (step === 2) return '..';
    if (step === 3) return '...';
    return '…';
  }, [step]);

  return (
    <View style={styles.row}>
      <Card style={styles.bubble} elevated={false}>
        <AppText variant="bodySmall" color="textMuted">
          {dots}
        </AppText>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: gapSm,
  },
  bubble: {
    maxWidth: '40%',
    backgroundColor: '#FFFFFF',
    borderColor: colors.borderSoft,
    padding: gapMd,
  },
});

