import * as React from 'react';
import { KeyboardAvoidingView, FlatList, RefreshControl, Platform } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { TextField } from 'react-native-ui-lib';
import FloatingButton from 'react-native-ui-lib/floatingButton'
import { Colors } from 'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useDispatch, useSelector } from 'react-redux';

import { HeaderSimple } from '../../components/header-simple';
import { BottomPadding } from '../../components/bottom-padding.component';
import ConversationItem from '../../components/list-items/conversation.component';
import Divider from '../../components/divider.component';
import { globalStyles } from '../../theming/common.styles';
import { loadMore, refresh, reset } from '../../redux/slices/ai-conversations.slice';
import { resetChat } from '../../redux/slices/ai-messages.slice';
import { setConversationId } from '../../redux/slices/ai-messages.slice';

import { api } from '../../api/api';

const ConversationsModalScreen = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const aiConversations = useSelector(state => state.aiConversations);

  React.useEffect(() => {
    dispatch(refresh());
  }, [])

  return (
  <>
  <HeaderSimple
    title='Conversations'
    enableGoBack={true}
    backActionCbk={null}
    backIcon={'cross'}
    displayCharacterAvatar={false}
  />
  <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"} 
  style={{flex: 1, backgroundColor: Colors.$backgroundDefault}}>
  <View flex bg-$backgroundDefault>
  {/* <View row centerV paddingH-15>
    <View flexG>
    <TextField
      placeholder='Search conversation'
      leadingAccessory={<Ionicons name='search' size={20} color={Colors.$textNeutral} style={{paddingRight: 10}} />}
      value={discover.req.q}
      placeholderTextColor={Colors.$textNeutral}
      onChangeText={onSearch}
      accessibilityLabel='Search a stock or crypto by a name or keyword'
      fieldStyle={{paddingVertical: 10}}
      containerStyle={{paddingBottom: 0, marginBottom: 0}}
      maxLength={15}
      autoFocus={collectionId ? false : true}
    />
    </View>
  </View> */}
  <FlatList
        data={aiConversations.data}
        renderItem={({item}) => (
          <ConversationItem
            item={item}
            onItemPress={() => {
              dispatch(setConversationId({ conversationId: item.id }))
              navigation.goBack();
            }}
            key={item?.id}
          />
        )}
        showsVerticalScrollIndicator={false}
        // ListHeaderComponent={ListHeaderComponent}
        // ListEmptyComponent={EmptyContent}
        ListFooterComponent={BottomPadding}
        ItemSeparatorComponent={Divider}
        numColumns={1}
        onEndReachedThreshold={2}
        // onEndReached={onEndReached}
        maxToRenderPerBatch={25}
        initialNumToRender={25}
        windowSize={10}
        // style={{paddingHorizontal: 20}}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={discover.isRefreshing}
        //     onRefresh={onRefresh}
        //     tintColor={Colors.$backgroundInverted} // colors for iOS
        //     colors={[Colors.$backgroundInverted]}  // colors for Android
        //     progressBackgroundColor={Colors.$backgroundDefault}
        //   />
        // }
      />
      <FloatingButton
        accessible
        accessibilityRole='button'
        accessibilityHint='Tap to open a new chat'
        visible={true}
        hideBackgroundOverlay={true}
        bottomMargin={25}
        button={{
          label: 'New chat',
          onPress: () => {
            dispatch(resetChat())
            navigation.goBack();
          },
          size: 'large',
          backgroundColor: Colors.$ocadaCoral,
        }}
      />

  </View> 
      </KeyboardAvoidingView>
      
  </>
  )
}

export { ConversationsModalScreen };
