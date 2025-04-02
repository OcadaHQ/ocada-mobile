import React from 'react';
import { Image } from 'react-native';
import Card from 'react-native-ui-lib/card';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';

import defaultImage from '../../assets/images/missing-file.png'
import { globalStyles } from '../theming/common.styles';


const GiantButton = ( { buttonText, buttonIcon, ...props } ) => {
    return (
        <>
        <Card
            style={[globalStyles.tappable, {
                paddingVertical: 25,
                justifyContent: 'flex-start',
            }]}
            appearance="outline"
            enableShadow={false}
            paddingH-20
            {...props}
            >
                <View row centerV>
                <Image
                    defaultSource={defaultImage}
                    source={buttonIcon}
                    accessible={false}
                    style={{
                        width: 50,
                        height: 50,
                        margin: 10
                    }} />
                <Text style={{fontWeight: 'bold'}} marginL-10>
                    { buttonText }
                </Text>
                </View>
        </Card>
        </>
    );
};

export default GiantButton;
