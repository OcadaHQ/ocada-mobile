import * as React from 'react';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import { Colors } from  'react-native-ui-lib/style';


const ChatSuggestedPrompt = ({ message, onItemPress, ...props }) => (
    <View
        column
        {...props}>
        <Card
            onPress={onItemPress}
            flexG
            enableShadow={false}
            padding-15
            marginR-20
            containerStyle={{
                borderWidth: 1,
                borderColor:  Colors.$outlineDefault,
            }}
            accessible
            accessibilityRole='text'
            accessibilityLabel={'Suggested message'}
            accessibilityValue={{text: message}}
            >
                <Text style={{color: Colors.$textNeutral, }}>{ message }</Text>
        </Card>
    </View>
)

export default ChatSuggestedPrompt;