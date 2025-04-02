import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from  'react-native-ui-lib/view';
import { Colors } from  'react-native-ui-lib/style';

const barThickness = 10;
const barRadius = barThickness/2;

const ProgressBar = ( percComplete ) => {
    return (
    <>
    <View style={styles.container} accessibilityRole='progressbar' centerV>
        <View style={styles.progressBar}>
            <View style={
                [StyleSheet.absoluteFill, 
                    {
                        backgroundColor: Colors.$backgroundSuccessHeavy,
                        width: percComplete + "%",
                        borderRadius: barRadius,
                }]
            } />
        </View>
    </View>
    </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    progressBar: {
        height: barThickness,
        flexDirection: "row",
        width: 250,
        backgroundColor: '#ccc',
        borderColor: '#000',
        borderWidth: 0,
        borderRadius: barRadius,
      }
});

export { ProgressBar };