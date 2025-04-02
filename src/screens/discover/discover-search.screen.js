import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView,
  FlatList, RefreshControl, Linking, Platform } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';
import { TextField } from 'react-native-ui-lib';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useDispatch, useSelector } from 'react-redux';

import { api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import InstrumentItem from '../../components/list-items/instrument.component';
import Divider from '../../components/divider.component';

import { setError } from '../../redux/slices/error.slice';
import { loadMore, refresh, reset, setSearchTerm, setCollectionId } from '../../redux/slices/discover-instruments.slice';
import { errors } from '../../error-messages';

import { FORM_SUGGEST_NEW_INSTRUMENT, STATIC_BASE_URL } from '../../constants';
import { styles } from './discover.style';
import { DiscoverSkeleton} from './discover.skeleton';
import { globalStyles } from '../../theming/common.styles';


const DiscoverSearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const discover = useSelector(state => state.discoverInstruments);
  const collectionId = route?.params?.collectionId;
  const collectionName = route?.params?.collectionName;

  React.useEffect(() =>{
    if(collectionId){
      dispatch(setCollectionId(collectionId));
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    dispatch(refresh());
  }, []);

  const onEndReached = React.useCallback(() => {
    dispatch(loadMore())
  }, []);

  const onSearch = (searchTerm) => {
    dispatch(setSearchTerm(searchTerm));
  };

  const onItemPress = React.useCallback(( item ) => {
    const instrumentId = item.id;
    navigation.navigate(
      'Instrument',
      { instrumentId }
    );
  }, []);

  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      dispatch(refresh());
      analytics().logEvent('search_query', {
        search_target: 'instrument',
        search_term: discover.req.q,
      });
    }, 250);
    return () => clearTimeout(timeOutId);
  }, [discover.req.q]);

  // reset state on navigation change
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        dispatch(reset());
      }),
    [navigation]
  );


  const EmptyContent = () => {

    if(discover.isRefreshing)
      return <DiscoverSkeleton />

    return (
    <View style={globalStyles.spaceBetween} level='2'>
      <View style={[globalStyles.center, {paddingTop: 20}]}>
        <Text>We could not find any tokens. Pull to refresh</Text>
      </View>
      <View style={[globalStyles.center, {paddingTop: 20}]}>
        <Button
          appearance={'ghost'}
          onPress={() => Linking.openURL(FORM_SUGGEST_NEW_INSTRUMENT)}
          label='Request a token'
          />
      </View>
    </View>
    );
  };
 
  const ListHeaderComponent = React.useMemo(() =>  ({ item }) => (
    <></>
  ), [discover.isRefreshing, discover.isFetching]);

  return (
  <>
  <HeaderSimple
    title={collectionName ?? 'Discover'}
    enableGoBack={true}   
  />
  <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"} 
  style={{flex: 1, backgroundColor: Colors.$backgroundDefault}}>
  {/* <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}> */}
  <View flex bg-$backgroundDefault>
  <View row centerV paddingH-15>
    <View flexG centerV row>
    <TextField
      placeholder='Search by name or keyword'
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
  </View>

  <FlatList
        data={discover.instruments}
        renderItem={({item}) => (
          <InstrumentItem
            item={item}
            onItemPress={onItemPress}
            key={item.symbol}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={EmptyContent}
        ItemSeparatorComponent={Divider}
        numColumns={1}
        onEndReachedThreshold={2}
        onEndReached={onEndReached}
        maxToRenderPerBatch={25}
        initialNumToRender={25}
        windowSize={10}
        style={{paddingHorizontal: 20}}
        refreshControl={
          <RefreshControl
            refreshing={discover.isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.$backgroundInverted} // colors for iOS
            colors={[Colors.$backgroundInverted]}  // colors for Android
            progressBackgroundColor={Colors.$backgroundDefault}
          />
        }
      />
  </View> 
  {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
  </>
  )
};

export default DiscoverSearchScreen;