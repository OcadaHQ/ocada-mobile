import * as React from 'react';
import View from 'react-native-ui-lib/view';
import Card from 'react-native-ui-lib/card';
import Button from 'react-native-ui-lib/button';
import SkeletonView from 'react-native-ui-lib/skeletonView';
import { Colors } from  'react-native-ui-lib/style';
import { globalStyles, modalStyles } from '../../theming/common.styles';
  

const InstrumentSkeleton = (props) => {
    return (
        <>
        <Card
            enableShadow={false}
            bg-$backgroundElevated
            marginV-10
            marginH-20
            padding-20
            >
                <View style={globalStyles.row}>

                <SkeletonView
                circle={true}
                height={50}
                />
                <SkeletonView
                template={SkeletonView.templates.TEXT_CONTENT}
                height={60}
                width={50}
                paddingL-20
                />
                </View>
        </Card>

        <View marginH-20 row>
                <Button
                style={modalStyles.dialogButton}
                outline
                backgroundColor={Colors.$backgroundDangerHeavy}
                outlineColor={Colors.$backgroundDangerHeavy}
                disabled={true}
                label='Sell'
                />
                <Button
                style={modalStyles.dialogButton}
                backgroundColor={Colors.$backgroundSuccessHeavy}
                disabled={true}
                label='Buy'
                />
            </View>
            </>
    )
};

export { InstrumentSkeleton };
