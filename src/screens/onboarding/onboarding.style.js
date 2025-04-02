import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    summaryBoxOuter: {
      flexDirection: 'column',
    },
    summaryBoxRow: {
      flexDirection: 'row',
    },
    characterList: {
      flex: 1,
      justifyContent: 'space-evenly',
      // alignItems: 'flex-start',
      // alignContent: 'flex-start',
    }
  });

export { styles };