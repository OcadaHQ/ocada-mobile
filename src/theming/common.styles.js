import * as React from 'react';
import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '85%'
    },
    textContent: {
        paddingVertical: 10
    },
    button: {
        marginVertical: 10
    },
    dialogOptions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
    dialogButton: {
        flex: 1,
        marginHorizontal: 5,
    }
});

const buttonStyles = StyleSheet.create({
    appleButton: {
        backgroundColor: '#8e8e93', // 8e8e93

    },
    googleButton: {
        backgroundColor: '#4285F4', // 4285F4
    },
});

const globalStyles = StyleSheet.create({
    standardContainer: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    standardContainerBottomless: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    screenContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    tappable: {
        marginVertical: 10
    },
    spaceBetween: {
        flex: 1,
        justifyContent: 'space-between'
    },
    spaceEvenly: {
        flex: 1,
        justifyContent: 'space-evenly',
    },

    column: {
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    heading: {
        fontSize: 20,
        marginVertical: 15
    },
    headingTopMargin: {
        fontSize: 20,
        marginTop: 25,
        marginBottom: 15
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerVertical: {
        justifyContent: 'center'
    },
    textCenter: {
        textAlign: 'center'
    },
    textBold: {
        fontWeight: 'bold'
    },
    verticalOffset: {
        marginVertical: 10
    },
    scrollView: {
        flex: 1,
    },
    italic: {
        fontStyle: 'italic'
    },
    roundBlob: {
        borderRadius: 4,
        padding: 20
    },
});

export { modalStyles, buttonStyles, globalStyles };