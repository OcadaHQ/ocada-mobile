import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView,
  FlatList, RefreshControl, Linking, Pressable, StyleSheet, Platform } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { TextField } from 'react-native-ui-lib';
import SegmentedControl from 'react-native-ui-lib/segmentedControl';
import FloatingButton from  'react-native-ui-lib/floatingButton';
import { Colors } from  'react-native-ui-lib/style';

import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HeaderSimple } from '../../components/header-simple';
import { abbreviateNumber } from '../../helpers/helpers';
import Divider from '../../components/divider.component';

import { setError } from '../../redux/slices/error.slice';
import { loadMore, refresh, reset, setSearchTerm, setMode } from '../../redux/slices/leaderboard.slice';
import { errors } from '../../error-messages';

import { STATIC_BASE_URL } from '../../constants';
import { LeaderboardSkeleton } from './leaderboard.skeleton';
import { globalStyles } from '../../theming/common.styles';


const LeaderboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const leaderboard = useSelector(state => state.leaderboard);
  const user = useSelector(state => state.user);

  const onRefresh = React.useCallback(() => {
    dispatch(refresh())
  }, []);

  const onEndReached = React.useCallback(() => {
    dispatch(loadMore())
  }, []);

  const onSearch = (searchTerm) => {
    dispatch(setSearchTerm(searchTerm));
  };

  const onItemPress = ( portfolioId ) => {
    navigation.navigate(
      'CommunityPortfolio',
      { portfolioId }
    );
  };

  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      dispatch(refresh());
      analytics().logEvent('search_query', {
        search_target: 'leaderboard',
        search_term: leaderboard.req.q,
      });
    }, 250);
    return () => clearTimeout(timeOutId);
  }, [leaderboard.req.q]);

  // reset state on navigation change
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        dispatch(reset());
      }),
    [navigation]
  );


  const EmptyContent = () => {

    if(leaderboard.isRefreshing)
      return <LeaderboardSkeleton />

    return (
    <View style={globalStyles.spaceBetween} level='2'>
      <View style={[globalStyles.center, {paddingTop: 20}]} level='2'>
        <Text>Could not find anyone 👀 </Text>
        <Text>Try searching again or pull to refresh</Text>
      </View>
    </View>
    );
  };

  const LeaderboardItemPosition = React.useMemo(() =>  ({ position }) => {
    const positionAbbr = abbreviateNumber(position);
    return (
      <View
        style={[globalStyles.center, {
          width: 25,
          height: 25,
          borderRadius: 15,
          backgroundColor: 
            position === 1 ? '#d2ac00' : 
            position === 2 ? '#8F9BB3' :
            position === 3 ? '#795C00':
            null,
          marginRight: 20,
        }]}
        >
        <Text
          category={'label'}
          style={ position <= 3 ? {color: 'white'} : null }
          >
          {positionAbbr}
        </Text>
      </View>
    )
    }, [leaderboard.isRefreshing, leaderboard.isFetching]);

  const LeaderboardItemIcon = React.useMemo(() =>  ({ portfolio }) => {
    const characterId = portfolio?.character_id;
    const imageFileName = portfolio?.character?.image_url
    if(!characterId || !imageFileName)
        return null;
    
    const imageSrc = {uri: `${STATIC_BASE_URL}/characters/${imageFileName}`}

    return (
      <Image
        source={imageSrc}
        cachePolicy={'disk'}
        style={{width: 35, height: 35}}
      />
    )
    }, [leaderboard.isRefreshing, leaderboard.isFetching]);


  const LeaderboardItem = React.useMemo(() =>  ({ item, index }) => (
    <Pressable
    onPress={() => {onItemPress( item.id )}}
    accessible={true}
    accessibilityLabel={`Tap to open investor profile: ${item?.name}`}
    >
      <View style={[globalStyles.row, {flex: 4}]} bg-$backgroundElevatedLight={ user.activePortfolio?.data?.id === item?.id } paddingH-20>
        { !leaderboard.req.q ? (
        <View style={globalStyles.centerVertical}>
          <LeaderboardItemPosition position={index + 1} />
        </View>
        ) : null }
        <View style={[globalStyles.centerVertical, {height: 50}]}>
          <LeaderboardItemIcon portfolio={item} />
        </View>
        <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
          <View row centerV>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          { item?.user?.is_premium ? 
          <Ionicons name="checkmark-circle-sharp" size={15} color={Colors.$textPrimary} style={{marginLeft: 5}} />
          : null }
          </View>

        </View>
        <View style={[globalStyles.centerVertical, {alignItems: 'flex-end'}]}>
        {
          leaderboard.mode === 'xp' ? 
          ( item?.user?.xp_current_week ? <Text>{abbreviateNumber(item?.user?.xp_current_week)} XP</Text> : null ) :
          leaderboard.mode === 'gain' ?
          <Text style={{color: item?.stats?.total_gain >= 0 ? Colors.$textSuccess : Colors.$textDanger}}>{item?.stats?.total_gain >= 0 ? '▲' : '▼'}${abbreviateNumber(item?.stats?.total_gain?.toFixed(0))}</Text> :
          null
        }
        </View>
      </View>
      </Pressable>
  ), [leaderboard.isRefreshing, leaderboard.isFetching]);

  return (
  <>
  <HeaderSimple
    title='Leaderboard'
    subtitle={leaderboard.mode === 'xp' ? 'Weekly XP' : 'All-time gain'}
    enableGoBack={false}   
  />
  <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"} 
  style={{flex: 1, backgroundColor: Colors.$backgroundDefault}}>
  <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}>
  <View flex bg-$backgroundDefault>
  <View row centerV paddingH-15 paddingT-5>
    <View row flexG>
    <TextField
      placeholder='Search players by name'
      leadingAccessory={<Ionicons name='search' size={20} color={Colors.$textNeutral} style={{paddingRight: 10}} />}
      value={leaderboard.req.q}
      placeholderTextColor={Colors.$textNeutral}
      onChangeText={onSearch}
      accessibilityLabel='Search a character by entering a name'
      fieldStyle={{paddingVertical: 10}}
      containerStyle={{paddingBottom: 0, marginBottom: 0}}
      maxLength={15}
    />
    </View>
    <View>
    <SegmentedControl
      segments={[
        {label: 'XP'},
        {label: '$$$'}
      ]}
      throttleTime={500}
      initialIndex={0}
      onChangeIndex={(index) => {
        dispatch(setMode(index === 0 ? 'xp' : index === 1 ? 'gain' : null));
        dispatch(refresh())
      }}
    />
    </View>
  </View>
  <FlatList
        data={leaderboard.portfolios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={LeaderboardItem}
        refreshControl={
          <RefreshControl
            refreshing={leaderboard.isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.$backgroundInverted} // colors for iOS
            colors={[Colors.$backgroundInverted]}  // colors for Android
            progressBackgroundColor={Colors.$backgroundDefault}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyContent}
        ItemSeparatorComponent={Divider}
        numColumns={1}
        onEndReachedThreshold={2}
        onEndReached={onEndReached}
        maxToRenderPerBatch={25}
        windowSize={3}
      />

<FloatingButton
    accessible
    accessibilityRole='button'
    accessibilityHint='Tap to discover stocks and crypto to invest in'
    visible={true}
    hideBackgroundOverlay={true}
    bottomMargin={15}
    button={{
      label: 'How to win?',
      onPress: () => {
        navigation.navigate('ModalNav', { screen: 'XP101' })
      },
      size: 'large',
      backgroundColor: Colors.$ocadaCoral
    }}
    />

  </View>
  </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  </>
  )
};

const styles = StyleSheet.create({
  withUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabledHeavy,
    paddingBottom: 4,
    height: 50
  }
})

export default LeaderboardScreen;