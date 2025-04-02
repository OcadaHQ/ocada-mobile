import * as React from 'react';
import { RefreshControl, FlatList, Share, Platform, Linking } from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import { Colors } from  'react-native-ui-lib/style';

import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import dayJsRelativeTime from 'dayjs/plugin/relativeTime';

// import { Api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import { LandingImageWrapper } from '../../components/landing-image.component';
import PortfolioHoldingItem from '../../components/list-items/portfolio-holding.component';
import Divider from '../../components/divider.component';

// import { HomeSkeleton } from './home.skeleton';
// import { styles } from './home.style';
import { globalStyles } from '../../theming/common.styles';

import { refreshActivePortfolio, refreshActiveHoldingByKey, refreshActivePortfolioSummary, beginOnboarding, loadMoreHoldings } from '../../redux/slices/user.slice';
import { setError } from '../../redux/slices/error.slice';

import iconBriefcase from '../../../assets/images/onboarding/briefcase.png';
import { APP_NAME, STATIC_BASE_URL } from '../../constants';

dayjs.extend(dayJsRelativeTime)

const NoHoldingsPlaceholder = () => ( 
  <Card marginV-20 padding-20 enableShadow={false} bg-$backgroundElevated >
  <Text marginV-10>
    You hold no assets.
  </Text>
</Card>
)


const HoldingsScreen = ({ navigation }) => {

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScreenLoaded, setScreenLoaded] = React.useState(false);

  // React.useEffect(loadDailyRewardAd, []);
  // React.useEffect(loadWeeklyRewardAd, []);

  const viewabilityConfig = {
    minimumViewTime: 1000,
    // waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
  }
  
  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems, changed }) => {
      changed.forEach(({ key }) => {
        // console.log(key)
        // dispatch(refreshActiveHoldingByKey( {activeHoldingKey: key} ));
      })
    },
    []
  )

  const viewabilityConfigCallbackPairs = React.useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ])

  // useFocusEffect(React.useCallback(() => {
  //   // todo: updatePortfolio resets everything basically when the user navigates back from the holding screen
  //   // some smarter logic has to be implemented
  //   updatePortfolio(false);
  //   const interval = setInterval(() => {
  //     dispatch(refreshActivePortfolioSummary());
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []));

  const updatePortfolio = React.useCallback((displaySkeleton=true) => {
    if(displaySkeleton)
      setScreenLoaded(false);
      dispatch(refreshActivePortfolio())
      .unwrap()
      .then(() => {
        dispatch(loadMoreHoldings())
        setScreenLoaded(true);
      })
      .catch((rejectedValueOrSerializedError) => {
        dispatch(setError({
          message: 'Portfolio could not be refreshed',
          detail: rejectedValueOrSerializedError
        }));
      })
  }, [])

  const onRefresh = React.useCallback(() => {
    updatePortfolio();
    setRefreshing(false);
  }, []);

  const onEndReached = React.useCallback(() => {
    dispatch(loadMoreHoldings());
  }, []);

  const onItemPress = React.useCallback(( item ) => {
    const instrumentId = item.instrument.id;
    navigation.navigate(
      'Instrument',
      { instrumentId }
    );
  }, []);
  
  const PortfolioHeader = () => {

    if(user.activePortfolio?.isInitFinished && user.activePortfolio?.data === null) {
      return <NoHoldingsPlaceholder/>
    }

    return null;
  }

  const NoPositionsContent = () => {
    if(!isScreenLoaded || 
      (user.activePortfolio?.isInitFinished && user.activePortfolio?.data === null))
    return null

    return <NoHoldingsPlaceholder />
  };

  return (
  <>
  <HeaderSimple
    title='My holdings'
    enableGoBack={true}
  />
    <View style={globalStyles.screenContainer} bg-$backgroundDefault>
    <FlatList
      data={user.activePortfolio?.holdings?.data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <PortfolioHoldingItem
          item={item}
          onItemPress={onItemPress}
          key={item?.instrument?.id}
        />
      )}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      ListHeaderComponent={PortfolioHeader}
      ListEmptyComponent={NoPositionsContent}
      ItemSeparatorComponent={Divider}
      onEndReachedThreshold={2}
      onEndReached={onEndReached}
      style={globalStyles.scrollView}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.general} // colors for iOS
          colors={[Colors.general]}  // colors for Android
          progressBackgroundColor={Colors.inverted}
        />
      }
      >
      </FlatList>
      {/* <BottomButton/> */}
    </View>
  </>
  )
};

export default HoldingsScreen;