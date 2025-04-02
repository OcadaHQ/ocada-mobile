import * as React from 'react';
import { RefreshControl, FlatList, Linking, Platform, Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Button from 'react-native-ui-lib/button';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import Badge from 'react-native-ui-lib/badge';
import FloatingButton from 'react-native-ui-lib/floatingButton';
import { Colors } from  'react-native-ui-lib/style';
import analytics from '@react-native-firebase/analytics';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import dayjs from 'dayjs';
import dayJsRelativeTime from 'dayjs/plugin/relativeTime';

// import { Api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import { LandingImageWrapper } from '../../components/landing-image.component';
import Divider from '../../components/divider.component';
import StatCard from '../../components/stat-card.component';
import TransactionItem from '../../components/list-items/community-transaction.component';

import { HomeSkeleton } from './home.skeleton';
import { styles } from './home.style';
import { globalStyles } from '../../theming/common.styles';

import { refreshActivePortfolio, refreshActiveHoldingByKey, refreshActivePortfolioSummary, beginOnboarding, loadMoreHoldings } from '../../redux/slices/user.slice';
import { 
  loadMore as txLoadMore,
  refresh as txRefresh,
  reset as txReset
} from '../../redux/slices/transactions.slice';
import { requestPushPermissions, registerPushToken } from '../../redux/slices/push.slice';
import { setError } from '../../redux/slices/error.slice';
import { formatGainLoss } from '../../helpers/helpers';

import iconBriefcase from '../../../assets/images/onboarding/briefcase.png';
import imgCourseAvatar from '../../../assets/images/promotional/course-avatar.png';
import { APP_NAME, APP_URL_DOWNLOAD } from '../../constants';
import { getNRewardsAvailableForPortfolio } from '../../helpers/rewards-eligibility.util';

dayjs.extend(dayJsRelativeTime)


const NoActivePortfolioContent = () => ( 
  <View flex>
    <View style={globalStyles.spaceBetween}>
    <View>
      <Text style={globalStyles.heading}>Hi there!</Text>
      <Text>
        Let's get you ready for your first investment! 
      </Text>
      <LandingImageWrapper source={iconBriefcase} />
    </View>
    </View>
  </View>
)

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const transactions = useSelector(state => state.transactions);
  
  const nRewardsAvailable = getNRewardsAvailableForPortfolio( 
    user.activePortfolio?.data?.date_last_claimed_intraday_reward,
    user.activePortfolio?.data?.date_last_claimed_daily_reward,
    user.activePortfolio?.data?.date_last_claimed_weekly_reward
  );

  // on screen load
  React.useEffect(() => {
    dispatch(txRefresh())
    dispatch(refreshActivePortfolio())  
  }, []);

  useFocusEffect(React.useCallback(() => {
    dispatch(refreshActivePortfolio())
  }, []));

  React.useEffect(() => {

    // navigation.navigate('CourseNav',{screen: 'VideoCourse'})
    // console.log('req push- home')
    // dispatch(requestPushPermissions())
    // .unwrap()
    // .then(() => {
    //   dispatch(registerPushToken());
    // })

    // const timeoutId = setTimeout(() => {
    //   if(!user.isPremium){
    //     // navigation.navigate('PaywallNav',{screen: 'Paywall'})
    //   }
    // }, 1000);

    // // Clean up the timeout when the component unmounts or when dependencies change
    // return () => clearTimeout(timeoutId);
  }, [])

  React.useEffect(() => {
    if(user.activePortfolio?.isInitFinished && user.activePortfolio?.data === null) {
      dispatch(beginOnboarding({backRef: "regular"}))
    }
  }, [user.activePortfolio]);

  const onListEndReached = React.useCallback(() => {
    dispatch(txLoadMore())
  }, []);

  const onPullToRefresh = React.useCallback(() => {
    dispatch(txRefresh())
    dispatch(refreshActivePortfolio())
  }, []);

  // React.useEffect(loadDailyRewardAd, []);
  // React.useEffect(loadWeeklyRewardAd, []);
  
  const onShopOpen = React.useCallback(() => {
    navigation.navigate(
      'ModalNav',
      {
        screen: 'DailyChallenge',
      }
    )
  }, []);

  const onItemPress = React.useCallback(( item ) => {
    const instrumentId = item?.instrument?.id;
    // const instrumentStatus = item?.instrument?.status;

    // if(instrumentStatus === 'active'){
    navigation.navigate(
      'Instrument',
      { instrumentId }
    );
    // } else {
      // Alert.alert(
        // title='Unavailable',
        // message='This asset is no longer active'
      // );
    // }
  }, []);

  const onSecondarySelect = React.useCallback(( item ) => {
    const portfolioId = item?.portfolio?.id;
    navigation.navigate(
      'CommunityNav',
      {
        screen: 'CommunityPortfolio',
        params: { portfolioId }
      }
    );
  }, []);

  const onPressInviteCode = React.useCallback(() => {
    Clipboard.setStringAsync(user.userDetails?.id + "")
    .then(() => {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    });
    Share.share({
      message: `Sign up for ${APP_NAME} with my code ${user.userDetails?.id} and get a MASSIVE bonus!\n${APP_URL_DOWNLOAD}`
    })
  }, []);
 
  const SummaryBox = (  ) => {
  
    return (
      <>
      <View
        accessibilityRole='summary'
      >
        <View>
            { user.activePortfolio?.data?.stats?.total_net_worth ?
          <Text text40M accessible>
          ${user.activePortfolio?.data?.stats?.total_net_worth.toFixed(2)}
          </Text>
          : null }         
        </View>
      </View>
      <View flex row gap-20 marginV-10>
        <StatCard
          iconName='cash'
          metricValue={'$' + user.activePortfolio?.data?.cash_balance.toFixed(2)}
          metricLabel='Balance'
          onPress={() => {
            navigation.navigate('ModalNav', { screen: 'VirtualCashModal' })
          }}
        />
        <StatCard
          iconName='briefcase'
          metricValue={user.activePortfolio?.holdings?.data?.length + ( user.activePortfolio?.holdings?.data?.length >= 25 ? '+' : '' )}
          metricLabel='Investments'
          onPress={() => {
            navigation.navigate('Holdings');
          }}
        />

      </View>
      <View flex row gap-20 marginV-10>
        <StatCard
          iconName='trophy'
          metricValue={user.userDetails?.xp_total}
          metricLabel='Total XP'
        />
        <StatCard
          iconName='stats-chart'
          metricValue={formatGainLoss(user.activePortfolio?.data?.stats?.total_gain)}
          metricValueProps={{
              color: user.activePortfolio?.data?.stats?.total_gain < 0 ? Colors.$textDanger : Colors.$textSuccess
          }}
          metricLabel={user.activePortfolio?.data?.stats?.total_gain < 0 ? 'Loss' : 'Profit'}
        />
        {/* <StatCard
          iconName='stats-chart'
          metricValue={formatGainLoss('420.69')}
          metricValueProps={{
              color: Colors.$textSuccess
          }}
          metricLabel={'Profit'}
        /> */}
      </View>
      </>
    )
  }

  const BottomButton = () => {
    return (
    <FloatingButton
    accessible
    accessibilityRole='button'
    accessibilityHint='Tap to discover tokens to invest in'
    visible={true}
    hideBackgroundOverlay={true}
    bottomMargin={15}
    button={{
      label: user.activePortfolio?.isInitFinished && user.activePortfolio?.data === null ? 'Get started' : 'Invest',
      onPress: () => {
        if(user.activePortfolio?.isInitFinished && user.activePortfolio?.data === null) {
          dispatch(beginOnboarding({backRef: "regular"}))
        } else {
          navigation.navigate('DiscoverHome')
        }
      },
      size: 'large',
      backgroundColor: Colors.$ocadaCoral,
    }}
    />
    )
  }

  const PortfolioHeader = React.useMemo(() => {

    if(!user.activePortfolio.isInitFinished)
      return <HomeSkeleton />

    if(user.activePortfolio?.isInitFinished && user.activePortfolio?.data === null) {
      return <NoActivePortfolioContent/>
    }
// `${APP_NAME} user #${user.userDetails?.id}\n`
    return (
      <>
      <View marginV-15>
        <Text style={{fontSize: 20}}>
          {user.activePortfolio?.data?.name}'s portfolio
        </Text>
        <Badge
          label={'Your invite code: ' + user.userDetails?.id}
          size={16}
          marginT-5
          backgroundColor={Colors.$backgroundInverted}
          icon={
            () => (<Ionicons name={'copy-outline'} size={15} color={Colors.$backgroundDefault} style={{marginHorizontal: 5}}/>)
          }
          onPress={onPressInviteCode}
          />
      </View>

      <SummaryBox />
      { !user.userDetails.target_net_worth_long_term ?
      <Button
        marginV-10
        onPress={() => {
          navigation.navigate(
            'GoalsNav', { screen: 'SetDream' }
          )
        }}
        label='Set goals'
        outline={true}
        />
      : null }

   {/* <Card
         enableShadow={false}
         padding-20
         marginV-10
         style={{backgroundColor: Colors.$backgroundWarningLight}}
         onPress={() => {
          analytics().logEvent('course_start');
          navigation.navigate('CourseNav',{screen: 'VideoCourse'})
         }}
         >
          <View row>
          <View centerV>
          <Image
            source={imgCourseAvatar}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              }} />
            </View>
            <View centerV paddingL-20>
            <Text style={{fontWeight: 'bold'}}>New to stocks?</Text>
            <Text>Get going with our FREE course!</Text>
            </View>
          </View>
      </Card> */}

      { nRewardsAvailable > 0 ?
      <Button
        marginV-10
        onPress={onShopOpen}
        label='Collect rewards'
        outline={true}
        iconOnRight={true}
        iconSource={
          () => (
            <Badge
              label={nRewardsAvailable + ""}
              size={18}
              backgroundColor={Colors.$backgroundDangerHeavy} 
              containerStyle={{marginLeft: 10}}
            />
          )
        }
        />
        : 
        null
      //   <Card
      //   enableShadow={false}
      //   bg-$backgroundElevated
      //   padding-20
      //   marginV-10
      //   >
      //     <Text style={{color: Colors.$textNeutral}}>
      //       Play your part to improve {APP_NAME}!
      //     </Text>
      // <Button
      //   marginT-20
      //   onPress={() => {
      //     Linking.openURL(FORM_SURVEY_2023_05_URL)
      //   }}
      //   label='Complete survey'
      //   outline={true}
      //   iconOnRight={true}
      //   iconSource={
      //     () => (
      //       <Badge
      //         label={"1"}
      //         size={18}
      //         backgroundColor={Colors.$backgroundDangerHeavy} 
      //         containerStyle={{marginLeft: 10}}
      //       />
      //     )
      //   }
      //   />
      //   </Card>
        }
      <View>
        <Text style={globalStyles.heading}>Trade feed</Text>
      </View>
      </>
    )
  }, [user.activePortfolio]);

  const EmptyContent = () => {

    if(transactions.isRefreshing)
      return null;
      // return <LeaderboardSkeleton />

    return (
    <View style={globalStyles.spaceBetween}>
      <View style={[globalStyles.center, {paddingTop: 20}]}>
        <Text>Nothing found. Pull to refresh</Text>
      </View>
    </View>
    );
  };

  return (
  <>
  <HeaderSimple
    title={APP_NAME}
    subtitle={ user.isPremium ? 'premium' : null }
    enableGoBack={false}
  />
    <View bg-$backgroundDefault style={globalStyles.screenContainer}>
    <FlatList
      data={transactions.data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => (
        <TransactionItem
          item={item}
          onItemPress={onItemPress}
          onSecondarySelect={onSecondarySelect}
          key={item.id}
        />
      )}
      ListHeaderComponent={PortfolioHeader}
      ListEmptyComponent={EmptyContent}
      onEndReachedThreshold={5}
      onEndReached={onListEndReached}
      style={globalStyles.scrollView}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={Divider}
      initialNumToRender={25}
      windowSize={10}
      refreshControl={
        <RefreshControl
          refreshing={transactions.isRefreshing}
          onRefresh={onPullToRefresh}
          tintColor={Colors.$backgroundInverted} // colors for iOS
          colors={[Colors.$backgroundInverted]}  // colors for Android
          progressBackgroundColor={Colors.$backgroundDefault}
        />
      }
      />

      <BottomButton/>
    </View>
  </>
  )
};

export default HomeScreen;