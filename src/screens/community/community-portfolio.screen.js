import * as React from 'react';
import { RefreshControl, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import { Colors } from 'react-native-ui-lib/style';
import { Image } from 'expo-image';

// import { Api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import { LandingImageWrapper } from '../../components/landing-image.component';
import Divider from '../../components/divider.component';
import StatCard from '../../components/stat-card.component';

import PortfolioHoldingItem from '../../components/list-items/portfolio-holding.component';

import { CommunityPortfolioSkeleton } from './community-portfolio.skeleton';
// import { styles } from './home.style';
import { globalStyles } from '../../theming/common.styles';
import { formatGainLoss } from '../../helpers/helpers';
import { refreshCommunityPortfolio, refreshCommunityHoldingByKey, refreshCommunityPortfolioSummary, loadMoreCommunityHoldings, resetPortfolio } from '../../redux/slices/community-portfolio.slice';
import { setError } from '../../redux/slices/error.slice';

import iconBriefcase from '../../../assets/images/onboarding/briefcase.png';

import { STATIC_BASE_URL } from '../../constants';

const CommunityPortfolioScreen = ({ navigation, route }) => {
  const { portfolioId } = route.params;
  const portfolio = useSelector(state => state.communityPortfolio);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScreenLoaded, setScreenLoaded] = React.useState(false);

  const viewabilityConfig = {
    minimumViewTime: 1000,
    itemVisiblePercentThreshold: 50,
  }
  
  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems, changed }) => {
      changed.forEach(({ key }) => {
        // dispatch(refreshCommunityHoldingByKey( {communityHoldingKey: key} ));
      })
    },
    []
  );

  const viewabilityConfigCallbackPairs = React.useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ])

  React.useEffect(() => {
    updatePortfolio(true);

  }, [])

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        dispatch(resetPortfolio());
    }),
    [navigation]
  );

  const updatePortfolio = (displaySkeleton=true) => {
    if(displaySkeleton)
      setScreenLoaded(false);
    
      dispatch(refreshCommunityPortfolio({portfolioId}))
      .unwrap()
      .then(() => {
        dispatch(loadMoreCommunityHoldings())
        setScreenLoaded(true);
      })
      .catch((rejectedValueOrSerializedError) => {
        dispatch(setError({
          message: 'Portfolio could not be refreshed',
          detail: rejectedValueOrSerializedError
        }));
      })
  }

  const onRefresh = React.useCallback(() => {
    updatePortfolio();
    setRefreshing(false);
  }, []);

  const onEndReached = React.useCallback(() => {
    dispatch(loadMoreCommunityHoldings());
  }, []);


  const NoCommunityPortfolioContent = () => (
    <View style={{height: '100%'}}>
      <View style={globalStyles.spaceBetween} level='2'>
      <View>
        <Text style={globalStyles.heading}>That's weird!</Text>
        <Text>
          Error loading a portfolio! 
        </Text>
      </View>
      <View>
      <LandingImageWrapper source={iconBriefcase} level='2' />
      </View>
      <View></View>
      </View>
    </View>
  )

  const SummaryBox = (  ) => {
      
    return (
      <>
      <View
        accessibilityRole='summary'
      >
        <View>
            { portfolio?.data?.stats?.total_net_worth ?
          <Text text40M accessible>
          ${portfolio?.data?.stats?.total_net_worth.toFixed(2)}
          </Text>
          : null }         
        </View>
      </View>
      <View flex row gap-20 marginV-10>
        <StatCard
          iconName='cash'
          metricValue={'$' + portfolio?.data?.cash_balance.toFixed(2)}
          metricLabel='Balance'
        />
        <StatCard
          iconName='briefcase'
          metricValue={portfolio?.holdings?.data?.length + (portfolio?.holdings?.data?.length >= 25 ? '+' : '')}
          metricLabel='Investments'
        />

      </View>
      <View flex row gap-20 marginV-10>
        <StatCard
          iconName='trophy'
          metricValue={portfolio?.data?.user?.xp_total}
          metricLabel='Total XP'
        />
        <StatCard
          iconName='stats-chart'
          metricValue={formatGainLoss(portfolio?.data?.stats?.total_gain)}
          metricValueProps={{
              color: portfolio?.data?.stats?.total_gain < 0 ? Colors.$textDanger : Colors.$textSuccess
          }}
          metricLabel={portfolio?.data?.stats?.total_gain < 0 ? 'Loss' : 'Profit'}
        />
      </View>
      </>
    )
  }

  const CommunityPortfolioAvatar = React.useMemo(() =>  ({ portfolio, ...props }) => {
    const characterId = portfolio?.character_id;
    const imageFileName = portfolio?.character?.image_url
    if(!characterId || !imageFileName)
        return null;
    
    const imageSrc = {uri: `${STATIC_BASE_URL}/characters/${imageFileName}`}

    return (
      <Image {...props}
        source={imageSrc}
        cachePolicy={'disk'}
        style={{width: 25, height: 25, borderRadius: 0}}
      />
    )
    }, [portfolio.isRefreshing, portfolio.isFetching]);

  const PortfolioHeader = () => {

    if(!isScreenLoaded)
      return <CommunityPortfolioSkeleton />

    if(!portfolio?.isFetching && portfolio?.data === null) {
      return <NoCommunityPortfolioContent/>
    }

    return (
      <>
      <View style={globalStyles.row}>
        <View style={globalStyles.centerVertical}>
          <CommunityPortfolioAvatar portfolio={portfolio.data} />
        </View>
        <View style={[globalStyles.centerVertical, {marginLeft: 10}]}>
          <Text style={globalStyles.heading}>
          {portfolio?.data?.name}
          </Text>
        </View>
      </View>


      <SummaryBox />

      <View>
        <Text style={globalStyles.heading}>Recent investments</Text>
      </View>

        </>
    )
  }

  const NoPositionsContent = () => {
    if(!isScreenLoaded && portfolio?.data === null)
      return null

    return (
      <Card
      enableShadow={false}
      bg-$backgroundElevated
      padding-20
      >
        <Text style={{color: Colors.$textNeutral}}>
          This investor is a minimalist. They're keeping their portfolio nice and empty.
        </Text>
      </Card>
    )
  };

  const onItemPress = React.useCallback(( item ) => {
    const instrumentId = item.instrument.id;
    navigation.navigate(
      'Instrument',
      { instrumentId }
    );
  }, []);
  
  return (
  <>
  <HeaderSimple
    title={'Community'}
    enableGoBack={true}
  />
    <View style={globalStyles.standardContainerBottomless} bg-$backgroundDefault>
    <FlatList
      data={portfolio?.holdings?.data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <PortfolioHoldingItem
          item={item}
          onItemPress={onItemPress}
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
          refreshing={portfolio.isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.$backgroundInverted} // colors for iOS
          colors={[Colors.$backgroundInverted]}  // colors for Android
          progressBackgroundColor={Colors.$backgroundDefault}
        />
      }
      >
      </FlatList>
    </View>
  </>
  )
};

export default CommunityPortfolioScreen;