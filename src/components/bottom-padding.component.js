import React from 'react';
import View from  'react-native-ui-lib/view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const minimumPadding = 30;

const BottomPadding = ( props ) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{paddingBottom:
            insets.bottom > minimumPadding ? insets.bottom : minimumPadding
        }} {...props} />
    );
};

export { BottomPadding }
