import * as React from 'react';
import { FlatList, RefreshControl, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import { TextField } from 'react-native-ui-lib';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HeaderSimple } from '../../components/header-simple';
import CollectionItem from '../../components/list-items/collection.component';
import InstrumentMoverItem from '../../components/list-items/instrument-mover.component';
import Divider from '../../components/divider.component';

import { setError } from '../../redux/slices/error.slice';
import { loadMore, refresh, reset } from '../../redux/slices/discover-collections.slice';
import { errors } from '../../error-messages';

import { STATIC_BASE_URL } from '../../constants';
import { DiscoverSkeleton} from './discover.skeleton';
import { globalStyles } from '../../theming/common.styles';
import { api } from '../../api/api';

const IconPremium = () => (
  <Ionicons name="checkmark-circle-sharp" size={20} color={Colors.$backgroundDefault} style={{marginRight: 10}} />
);

const DiscoverHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const discover = useSelector(state => state.discoverCollections);
  const user = useSelector(state => state.user);
  const [topMoversList, setTopMoversList] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    dispatch(refresh());
    updateTopMovers();
  }, [dispatch, refresh]);

  React.useEffect(() => {
    dispatch(refresh());
    updateTopMovers();
  }, []);

  const onCollectionsEndReached = () => {
    dispatch(loadMore())
  };

  const onCollectionPress = ( { id, display_name } ) => {
    navigation.navigate(
      'DiscoverSearch',
      { collectionId: id, collectionName: display_name }
    );
  };

  const onInstrumentPress = React.useCallback(( item ) => {
    const instrumentId = item.id;
    navigation.navigate(
      'Instrument',
      { instrumentId }
    );
  }, []);

  const updateTopMovers = async () => {
    
      api.getInstruments({
        q: null,
        skip: 0,
        limit: 10,
        showWellKnownOnly: false,
        sort: 'price_change_perc_desc'
      })
      .then(( { data }) => {
        setTopMoversList(data);
      })
      .catch((error) => {
        setTopMoversList([]);
      })
  };

  // reset state on navigation change
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        dispatch(reset());
      }),
    [navigation]
  );

  const EmptyContent = () => {

    // if(discover.isRefreshing)
      return <DiscoverSkeleton />

    return (
    <View style={globalStyles.spaceBetween}>
      <View style={[globalStyles.center, {paddingTop: 20}]}>
        <Text>Could not load collections. Pull to refresh</Text>
      </View>
    </View>
    );
  };

  const TopMovers = () => {
    return (
    <>
    <Text style={globalStyles.heading}>Today's Top Movers</Text>
    <FlatList
      data={topMoversList}
      renderItem={({item}) => (
      <InstrumentMoverItem
        item={item}
        key={item.key}
        onItemPress={ onInstrumentPress }
        isCensored={ false }
      />)}
    horizontal={true}
    />
    <Text style={globalStyles.heading}>Collections</Text>
    </>)
  }


  return (
  <>
  <HeaderSimple
    title='Discover'
    enableGoBack={true}
  />
  <View style={globalStyles.screenContainer} flex bg-$backgroundDefault>
  <Pressable 
    onPress={() => navigation.navigate('DiscoverSearch')}
  >
  <View row centerV paddingT-5 pointerEvents='none'>
    <TextField
      placeholder='Search by name or keyword'
      leadingAccessory={<Ionicons name='search' size={20} color={Colors.$textNeutral} style={{paddingRight: 10}} />}
      value={''}
      placeholderTextColor={Colors.$textNeutral}
      readonly={true}
      accessibilityLabel='Search a stock or crypto by a name or keyword'
      fieldStyle={{paddingVertical: 10}}
      containerStyle={{paddingBottom: 0, marginBottom: 0}}
      maxLength={15}
      disabled={true}
    />
    </View>
  </Pressable>
  <FlatList
    data={discover.collections}
    renderItem={({item}) => (<CollectionItem
      item={item}
      key={item.key}
      onItemPress={onCollectionPress}
    />)}
    refreshControl={
      <RefreshControl
        refreshing={discover.isRefreshing}
        onRefresh={() => {onRefresh()}}
        tintColor={Colors.$backgroundInverted} // colors for iOS
        colors={[Colors.$backgroundInverted]}  // colors for Android
        progressBackgroundColor={Colors.$backgroundDefault}
      />
    }
    // contentContainerStyle={}
    showsVerticalScrollIndicator={false}
    ItemSeparatorComponent={Divider}
    ListHeaderComponent={TopMovers}
    // ListFooterComponent={ListFooter}
    ListEmptyComponent={EmptyContent}
    numColumns={1}
    maxToRenderPerBatch={25}
    initialNumToRender={25}
    windowSize={10}
    onEndReached={onCollectionsEndReached}
  />
  </View>
  </>
  )
};

export default DiscoverHomeScreen;