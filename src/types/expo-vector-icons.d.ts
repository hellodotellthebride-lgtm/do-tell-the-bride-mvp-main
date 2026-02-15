declare module '@expo/vector-icons/Ionicons' {
  import React from 'react';
  import type { TextStyle } from 'react-native';

  export type IoniconsProps = {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  };

  const Ionicons: React.ComponentType<IoniconsProps>;
  export default Ionicons;
}

