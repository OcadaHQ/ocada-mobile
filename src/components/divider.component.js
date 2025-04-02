import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from  'react-native-ui-lib/view';
import { Colors } from  'react-native-ui-lib/style';

const Divider = () => (
    <View
        flex
        accessible={false}
        style={style.divider}
    />
)

const style = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: Colors.$backgroundNeutral
    }
});

export default Divider;