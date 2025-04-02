import * as React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      textAlign: 'center',

    },
    bullet: {
      width: 10
    },
    bulletText: {
      paddingVertical: 4,
      paddingHorizontal: 10,
    }
  });

export { styles };