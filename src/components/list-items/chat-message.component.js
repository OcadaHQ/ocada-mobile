import * as React from 'react';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import LottieView from 'lottie-react-native';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_NAME } from '../../constants';

const loaderText = [
    'Analyzing the request',
    'Gathering sources',
    'Analyzing the on-chain data',
    'Analyzing the trends',
    'Analyzing real-time data',
    'Analyzing the goals',
    'Considering risk tolerance',
    'Identifying opportunities',
    'Correlating data points',
    'Preparing a report',
]

const ChatMessage = ({ isSentByMe, message, isTyping = false}) => {
    const [loaderCaptionId, setLoaderCaptionId] = React.useState(0);

    React.useEffect(() => {
        if(!isTyping) return; 
        const intervalId = setInterval(() => {
            setLoaderCaptionId((prevId) => (prevId + 1) % loaderText.length);
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
    <View row flex-1>
        { isSentByMe ? <View flex-1></View> : null }
        <Card
            // bg-$backgroundElevated
            // bg-$textPrimary
            enableShadow={false}
            padding-15
            marginV-10
            flex-3
            style={{backgroundColor: isSentByMe ? Colors.$outlinePrimary : Colors.$backgroundElevated}}
            accessible
            accessibilityRole='text'
            accessibilityLabel={isSentByMe ? 'Message sent by you' : `Message sent by ${APP_NAME} AI`}
            accessibilityValue={{text: message}}
            column
            >
            { isTyping ?
            <>
            <Text center>
            { loaderText[loaderCaptionId] }
            </Text>
            <View center>
                <LottieView
                    source={require('../../../assets/animations/typing.json')}
                    autoPlay
                    loop={true}
                    style={{height: 40}}
                    />
            </View>
            
            </>
            : 
            <Text
            style={{color: isSentByMe ? Colors.$textDefaultLight : Colors.$textDefault}}
            selectable
            >
            { message }
            </Text>
            }
        </Card>
        { !isSentByMe ?
        <View flex-1 center centerV>
            {/* <Ionicons name="ellipsis-horizontal" size={24} color="grey" /> */}
        </View> : null }
    </View>
    )
}

export default ChatMessage;