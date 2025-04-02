import * as React from 'react';
import { AppState, RefreshControl, FlatList, Keyboard, KeyboardAvoidingView, Platform, Animated, Easing, useWindowDimensions } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import { TextField } from  'react-native-ui-lib';
import Button from 'react-native-ui-lib/button';
import LoaderScreen from 'react-native-ui-lib/loaderScreen';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, resetChat, addMessage, loadConversation } from '../../redux/slices/ai-messages.slice';
import { restorePurchases } from '../../helpers/purchases.helper';
import { refreshUnseenBadge } from '../../redux/slices/ai-conversations.slice';

import ChatMessage from '../../components/list-items/chat-message.component';
import ChatSuggestedPrompt from '../../components/list-items/chat-suggested-prompt.component';
import { HeaderSimple } from '../../components/header-simple';
import { globalStyles } from '../../theming/common.styles';
import { errors } from '../../error-messages';
import { getRevCatPublicApiKey } from '../../helpers/purchases.helper';
import { APP_NAME } from '../../constants';

const IconPremium = () => (
    <Ionicons name="checkmark-circle-sharp" size={20} color={Colors.$backgroundDefault} style={{marginRight: 10}} />
  );

const SpinnerIcon = () => {

    const spinValue = new Animated.Value(0);

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start(() => {
      spinValue.setValue(0);
    });
    
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
    <Ionicons
        name='sync-sharp'
        size={19}
        accessible={false}
        
        />
    </Animated.View>
    )
}


const EmptyContent = () => (
    <>
        <ChatMessage
            isSentByMe={false}
            message={'Gm, I\'m your copilot for Solana! 👋'}
        />
        <ChatMessage
            isSentByMe={false}
            message={'Keeping up with all the latests drops, memes and rug pulls can be exhausing 🥵 I\'ve got your back! 🤝'}
        />
        <ChatMessage
            isSentByMe={false}
            message={'Got questions? Need alpha? I can analyze tokens and manage your wallet. Let\'s pump it to the moon! 🌕'}
        />
        <ChatMessage
            isSentByMe={false}
            message={'I\'m still levelling up, so stick to using my suggestions in the game, and do your own research before you go full degen irl 🦧'}
        />
    </>
)

const AIChatScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const aiMessages = useSelector(state => state.aiMessages);
    const aiConversations = useSelector(state => state.aiConversations);
    const user = useSelector(state => state.user);
    

    const { width: windowWidth} = useWindowDimensions();
    const maxSuggestedPromptWidth = windowWidth * 0.8;
    const [tempMessageText, setTempMessageText] = React.useState({
        content: '',
        readyToSend: false
    });
    const maxMessageLength = 100;

    const appState = React.useRef(AppState.currentState);
    const scrollViewRef = React.useRef(null);
    const inputFieldRef = React.useRef(null);

    const scrollToLatest = React.useCallback(() => {
        try{
            if(aiMessages.data.length > 0){
                scrollViewRef.current.scrollToIndex({
                    index: 0,
                    animated: true
                });
            }
        }
        // TODO: there seem to be intermittent errors
        catch(error){}
    }, [aiMessages.data.length])

    React.useEffect(() => {
        if(!['ios', 'android'].includes(Platform.OS))
            return

        // https://reactnative.dev/docs/keyboard#addlistener: both iOS and Android have 'keyboardDidShow' event
        // the 'keyboardWillShow' event is a little more smooth on iOS and should be preferred
        const eventName = (Platform.OS === 'ios') ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardShowListener = Keyboard.addListener(eventName, () => {
            scrollToLatest();
        });
    
        return () => {
          keyboardShowListener.remove();
        };
    }, []);

    // React.useEffect(() => {
    //     if(route.params?.context){
    //         console.log(route.params?.context)
    //         dispatch(startNewChat({context: route.params?.context}))
    //     }
    // }, []);

    // TODO: is it a good practice?
    React.useEffect(() => {
        scrollToLatest();
    }, [aiMessages.data.length]);
    
    React.useEffect(() => {
        dispatch(loadConversation())
        dispatch(refreshUnseenBadge())
    }, [aiMessages.conversationId]);

    React.useEffect(() => {
        if(tempMessageText.readyToSend){
            onSend()
        }
    }, [tempMessageText.readyToSend]);

    React.useEffect(
        () => {
            const subscription = AppState.addEventListener('change', nextAppState => {
                if (
                  appState.current.match(/inactive|background/) &&
                  nextAppState === 'active'
                ) {
                    dispatch(loadConversation())
                }
          
                appState.current = nextAppState;
              });
          
              return () => {
                subscription.remove();
              };
        }, []);

    const onSend = () => {
        // when triggered froman iphone keyboard, number of characters may be 0
        if(tempMessageText.content.length == 0){
            return;
        }

        // log event
        analytics().logEvent('ai_send_message', {
            scope: aiMessages.context ? 'instrument' : 'general', // 'general' or 'instrument'
            isSuggested: tempMessageText.readyToSend
        });

        // send the message
        dispatch(sendMessage({
            message: tempMessageText.content,
            revCatApiKey: user.isPremium ? getRevCatPublicApiKey() : null
        }))
        .unwrap()
        .catch(() => {})
        .finally(() => {
            inputFieldRef?.current?.clear();
            dispatch(loadConversation())
        })
    };

    const FakeLoaderMessages = () => {
        if(aiMessages.isSending)
            return (
                <View column>
                    <ChatMessage
                        isSentByMe={true}
                        message={tempMessageText.content}
                    />
                    <ChatMessage
                        isSentByMe={false}
                        message={''}
                        isTyping={true}
                    />
                </View>
            )
        return null;
    }

    return (
  <>
  <HeaderSimple
    title={
        aiMessages.conversationId === 'news' ? 'News' :
        aiMessages.conversationId === 'announcements' ? 'Announcements' :
        aiMessages.conversationId === 'feedback' ? 'Feedback' :
        `${APP_NAME} AI`
    }
    subtitle={ !['news', 'announcements', 'feedback'].includes(aiMessages.conversationId) ? 'experimental' : null}
    enableGoBack={true}
    backIcon={'list'}
    backActionCbk={() => {
        navigation.navigate(
            'ModalNav',
            { screen: 'ConversationsModal' }
          )
    }}
    isBackActionBadgeVisible={aiConversations.isUnseenBadgeDisplayed}
    // enableGoBack={ !aiMessages.isSending && aiMessages.data.length }
    // backIcon='refresh'
    // backActionCbk={() => {
    //     dispatch(resetChat())
    // }}
    displayCharacterAvatar={true}
  />
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1, backgroundColor: Colors.$backgroundDefault}}>
    <View paddingV-5 bg-$backgroundDark paddingH-20>
        <Text text100>For informational purposes only; not financial advice.</Text>
    </View>
    <View bg-$backgroundDefault style={globalStyles.screenContainer}>
    { aiMessages.isFetching ?
    <View flex flexG>
        <LoaderScreen
            color={Colors.grey40}
            message={'Loading messages...'}
            messageStyle={{color: Colors.grey30}}
        />
    </View>
    
    :
    <FlatList
        data={aiMessages.data}
        inverted={ aiMessages.data.length > 0 }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <ChatMessage
            isSentByMe={item.isSentByMe}
            message={item.content}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyContent}
        ListHeaderComponent={() => {
            if(aiMessages.data.length > 0){
                return <FakeLoaderMessages />
            }
        }}
        ListFooterComponent={() => {
            if(!aiMessages.data.length){
                return <FakeLoaderMessages />
            }
        }}
        numColumns={1}
        onEndReachedThreshold={2}
        // onEndReached={onEndReached}
        maxToRenderPerBatch={25}
        windowSize={3}
        ref={scrollViewRef}
        refreshControl={
            <RefreshControl
            refreshing={aiMessages.isFetching}
            onRefresh={() => {
                dispatch(loadConversation())
                dispatch(refreshUnseenBadge())
            }}
            tintColor={Colors.$backgroundInverted} // colors for iOS
            colors={[Colors.$backgroundInverted]}  // colors for Android
            progressBackgroundColor={Colors.$backgroundDefault}
            />
        }
    />
    }
    
    { 
    (!aiMessages.isQuotaExceeded || user.isPremium ) &&
    !aiMessages.isSending && !aiMessages.isFetching
    ?
    <View paddingV-5>
        <FlatList
            data={aiMessages.suggestedPrompts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
            <ChatSuggestedPrompt
                message={item}
                style={{width: maxSuggestedPromptWidth}}
                onItemPress={() => {
                    setTempMessageText({
                        content: item,
                        readyToSend: true
                    })
                }}
            />
            )}
            showsHorizontalScrollIndicator={false}       
            maxToRenderPerBatch={3}
            windowSize={3}
            horizontal={true}
            flexS
        />
    </View>
    : null
    }


    {
    (!user.isPremium && aiMessages.isQuotaExceeded) ?
    <View column paddingV-10 style={{borderTopWidth: 1, borderTopColor: Colors.$backgroundElevatedLight}}>
        <Text>
        Congrats! You've made best use of your free chat limit!
        Get Premium now to increase your limit or wait up to 24 hours to reset your free quota! 🚀
        </Text>
        <Button
            onPress={() => {
                analytics().logEvent('paywall_open', {source: 'ai_chat'});
                navigation.navigate('PaywallNav',{screen: 'Paywall'})}
            }
            style={globalStyles.tappable}
            iconSource={IconPremium}
            label='Upgrade to Premium'
            />
        <Text
            grey30
            style={[globalStyles.textCenter, globalStyles.textBold]}
            accessibilityRole='link'
            onPress={restorePurchases}
        >
            Restore purchases
        </Text>
    </View>
    :
    <View row centerV>
    <View flex-3>
    <TextField
        placeholder='Ask me anything'
        placeholderTextColor={Colors.$textNeutral}
        accessibilityLabel={`Enter your question for ${APP_NAME} AI`}
        fieldStyle={{paddingVertical: 10}}
        containerStyle={{paddingBottom: 0, marginBottom: 0}}
        maxLength={ maxMessageLength }
        showCharCounter={ tempMessageText.content.length > (maxMessageLength - 10)}
        preset={'default'}
        margin-0
        onChangeText={(nextValue) => {
            setTempMessageText({
                content: nextValue,
                readyToSend: false
            })
        }}
        value={tempMessageText.content}
        readonly={aiMessages.isSending}
        ref={inputFieldRef}
        onSubmitEditing={onSend}
        enterKeyHint={'send'}
        color={Colors.$textDefault}
    />
    </View>
    <View centerV flex>
        {/* TODO: long text inputs shift the button  */}
    <Button
        hitSlop={15}
        style={{position: 'absolute', width: 35, height: 35, right: 0}}
        backgroundColor={ Colors.$backgroundPrimaryLight }
        round
        disabled={
            // disabled when the message is empty or is being sent
            !tempMessageText.content.length || aiMessages.isSending
        }
        size={'medium'}
        avoidInnerPadding
        iconSource={() => (
            aiMessages.isSending ?
            <SpinnerIcon />
            :
            <Ionicons
                name='arrow-up-sharp'
                size={19}
                accessible={false}
            />
        )}
        onPress={onSend}
        accessible
        accessibilityRole='button'
        accessibilityLabel={`Press to send your message to ${APP_NAME} AI`}
        />
    </View>
    </View>
    }
  </View>
  </KeyboardAvoidingView>
  </>
    )
}


export default AIChatScreen;
