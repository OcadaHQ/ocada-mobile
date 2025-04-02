import * as React from 'react';
import { ScrollView, RefreshControl, StyleSheet, useWindowDimensions, Platform, Image, Pressable, Linking } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import dayjs from 'dayjs';
import analytics from '@react-native-firebase/analytics';
import * as Clipboard from 'expo-clipboard';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import Card from 'react-native-ui-lib/card';
import SegmentedControl from 'react-native-ui-lib/segmentedControl';
import FloatingButton from 'react-native-ui-lib/floatingButton';
import { Colors } from  'react-native-ui-lib/style';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { LineGraph } from 'react-native-graph';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

// import { api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import StatCard from '../../components/stat-card.component';

import { startNewChat } from '../../redux/slices/ai-messages.slice';
import { refreshInstrument, loadPriceHistory, resetInstrument, setTransactionType, resetTransaction } from '../../redux/slices/instrument.slice';
import { setError } from '../../redux/slices/error.slice';
import { InstrumentSkeleton } from './instrument.skeleton';
import { InstrumentItem, NoHoldingCard, HoldingCard } from './instrument.components';

import DiscordLogo from '../../components/svg/discord-icon'
import XLogo from '../../components/svg/x-icon'
import TelegramLogo from '../../components/svg/telegram-icon'
import SocialButton from '../../components/social-button.component';
import { abbreviateNumber } from '../../helpers/helpers';

import { 
    // STATIC_BASE_URL, 
    APP_NAME,
    SOLANA_RUG_CHECK_BASE_URL,
    // MAX_ASSETS_IN_PORTFOLIO,
} from '../../constants';
import { onReviewDialogShouldAppear } from '../../helpers/store-review.helper';
import { hasCurrentVersionPromptedReview, updateAppReviewDetails, clearAppReviewDetails } from '../../storage/app-review-prompt';
import { restorePurchases } from '../../helpers/purchases.helper';
import { globalStyles, modalStyles } from '../../theming/common.styles';
import { FloatingButtonLayouts } from 'react-native-ui-lib';
// import { BottomPadding } from '../../components/bottom-padding.component';


// const isInstrumentPriceRecentlyUpdated = (instrument) => {
//     const permittedMarketUpdateBuffer = 600000; // specified in milliseconds, equal to 10 minutes
//     const lastUpdateTime = Date.parse(instrument?.data?.kpi_latest_price?.date_as_of);
//     const now = new Date().getTime();
//     return (lastUpdateTime && now - lastUpdateTime < permittedMarketUpdateBuffer) ? true : false;
// }

const RoundBlobForNonPremium = () => {
    const navigation = useNavigation();
    return (
      <Card bg-$backgroundElevated padding-20 enableShadow={false}>
      <Text grey30>Upgrade to Premium to reach your goals faster!</Text>
      <Button
                onPress={() => {
                    analytics().logEvent('paywall_open', {source: 'instrument'});
                    navigation.navigate('PaywallNav',{screen: 'Paywall'})}
                }
                style={globalStyles.tappable}
                label='Upgrade to Premium'
                />
      <Text
        grey30
        style={[globalStyles.textCenter, globalStyles.textBold]}
        accessibilityRole='link'
        onPress={restorePurchases}
        >Restore purchases</Text>
      </Card>
    )
}

const chartLabels = [
    '4HOUR',
    '1DAY',
    '1WEEK',
    '1MONTH',
    '3MONTH',
    '6MONTH',
    '1YEAR'
]

const InstrumentScreen = ({ navigation, route }) => {
    const { instrumentId } = route.params;
    const dispatch = useDispatch();
    const instrument = useSelector(state => state.instrument);
    const user = useSelector(state => state.user);
    const { width: screenWidth } = useWindowDimensions();
    const chartWidth = screenWidth - 40; // 40 is twice the size of standardContainerBottomless.paddingHorizontal
    const chartHeight = chartWidth / 2;
    // const isPurchasedAllowed = user.isPremium || user.activePortfolio.holdings.data.length <= MAX_ASSETS_IN_PORTFOLIO || instrument.holding?.quantity > 0;

    // const [chartControlIndex, setChartControlIndex] = React.useState(2);
    const [isScreenLoaded, setScreenLoaded] = React.useState(false);

    const latestPrice = useSharedValue('');
    const latestChange = useSharedValue('');
    const latestChangeColor = useSharedValue('');

    const selectedPrice = useSharedValue('');
    const selectedDate = useSharedValue('');
    const cardAlternativeText = useSharedValue('');
    const cardAlternativeTextColor = useSharedValue('');

    const [isAskAIButtonDisplayed, setAskAIButtonDisplayed] = React.useState(false);


    let rugRiskFormattedText = null;
    let rugRiskFormattedColor = null;

    if(instrument.data?.kpi_token_metrics?.risk_score >= 0 && instrument.data?.kpi_token_metrics?.risk_score <=100){
        rugRiskFormattedText = 'Very low';
        rugRiskFormattedColor = Colors.$textSuccess;
    }
    else if(instrument.data?.kpi_token_metrics?.risk_score > 100 && instrument.data?.kpi_token_metrics?.risk_score <=500){
        rugRiskFormattedText = 'Low';
        rugRiskFormattedColor = Colors.$textSuccess;
    }
    else if(instrument.data?.kpi_token_metrics?.risk_score > 500 && instrument.data?.kpi_token_metrics?.risk_score <=1500){
        rugRiskFormattedText = 'Medium';
        rugRiskFormattedColor = Colors.$textMajor;
    }
    else if(instrument.data?.kpi_token_metrics?.risk_score > 1500){
        rugRiskFormattedText = 'High';
        rugRiskFormattedColor = Colors.$textDanger;
    }

    let nMarketsFormattedText = null;
    let nMarketsFormattedColor = null;

    if(instrument.data?.kpi_token_metrics?.number_markets > 0 && instrument.data?.kpi_token_metrics?.number_markets <=5){
        nMarketsFormattedText = 'Limited';
        nMarketsFormattedColor = Colors.$textDanger;
    }
    else if(instrument.data?.kpi_token_metrics?.number_markets > 5 && instrument.data?.kpi_token_metrics?.number_markets <= 20){
        nMarketsFormattedText = 'Moderate';
        nMarketsFormattedColor = Colors.$textMajor;
    }
    else if(instrument.data?.kpi_token_metrics?.number_markets > 20 && instrument.data?.kpi_token_metrics?.number_markets < 50){
        nMarketsFormattedText = 'Well adopted';
        nMarketsFormattedColor = Colors.$textSuccess;
    }
    else if(instrument.data?.kpi_token_metrics?.number_markets > 50){
        nMarketsFormattedText = 'Mainstream';
        nMarketsFormattedColor = Colors.$textSuccess;
    }


    
    React.useEffect(() => {
        selectedPrice.value = '$' + instrument.data?.kpi_latest_price?.price.toFixed(6);
        latestPrice.value = '$' + instrument.data?.kpi_latest_price?.price.toFixed(6);

        latestChange.value = (instrument.data?.kpi_latest_price?.change_perc_1d < 0 ? '▼ ' : '▲ ') + Math.abs(instrument.data?.kpi_latest_price?.change_perc_1d)?.toFixed(2) + '%';
        latestChangeColor.value = instrument.data?.kpi_latest_price?.change_perc_1d < 0 ? Colors.$textDanger : Colors.$textSuccess;

        cardAlternativeText.value = (instrument.data?.kpi_latest_price?.change_perc_1d < 0 ? '▼ ' : '▲ ') + Math.abs(instrument.data?.kpi_latest_price?.change_perc_1d)?.toFixed(2) + '%';
        cardAlternativeTextColor.value = instrument.data?.kpi_latest_price?.change_perc_1d < 0 ? Colors.$textDanger : Colors.$textSuccess;
    }, [instrument.data?.kpi_latest_price?.price])


    const loadInstrument = () => {
        dispatch(loadPriceHistory({ instrumentId: instrumentId, lookbackOption: '4HOUR' }));
        dispatch(refreshInstrument({ instrumentId }))
        .unwrap()
        .then((originalPromiseResult) => {
            setAskAIButtonDisplayed(true);
        })
        .catch((rejectedValueOrSerializedError) => {
            navigation.goBack();
            dispatch(setError(
                {
                    message: 'Could not load an asset',
                    detail: {}
                }
            ));
        })
        .finally(() => {
            setScreenLoaded(true);
        });
    };

    const onRefresh = React.useCallback(() => {
        dispatch(resetTransaction());
        loadInstrument();
    }, []);

    const onBeginTransaction = ( {transactionType} ) => {
        if(transactionType === 'buy' || transactionType === 'sell') {
            dispatch(setTransactionType({ type: transactionType }));
            navigation.navigate('InstrumentNewTransaction');
        }
    };

    // const onMarketClosed = () => {
    //     navigation.navigate(
    //         'ModalNav',
    //         {
    //           screen: 'MarketClosedModal',
    //         }
    //     )
    // }

    const onPointSelected = React.useCallback(
        (p) => {
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            selectedPrice.value = '$' + p.value?.toFixed(6)?.toString();
            cardAlternativeText.value = dayjs(p.date).format('D MMM HH:mm')
        },
        [selectedPrice, cardAlternativeText],
    );

    const onPointScrubEnd = React.useCallback(
        () => {
            selectedPrice.value = '' + latestPrice.value;
            cardAlternativeText.value = latestChange.value;
        },
        [selectedPrice, cardAlternativeText, latestPrice, latestChange]
    )
    
    React.useEffect(() => {
        loadInstrument();
    }, []);

    React.useEffect(
        () => navigation.addListener('beforeRemove', (e) => {
            dispatch(resetInstrument());
        }), [navigation]);

    useFocusEffect(React.useCallback(() => {
        // on transaction complete
        if(instrument.transaction.transactionDetails?.status === 'executed'){
            // check if the app review prompt has been displayed to the user
            hasCurrentVersionPromptedReview().then(
                (result) => {
                    // if review prompt has not been shown, show it and record the fact
                    if(!result){
                        onReviewDialogShouldAppear();
                        updateAppReviewDetails();
                    }
                }
            );
        }
    }, [instrument.transaction]));

    // const MarketClosedBlob = ( ) => {

    //     return (
    //         <>
    //           <Card row bg-$backgroundElevated enableShadow={false} padding-20 marginV-10>
    //             <View style={globalStyles.centerVertical}>
    //                 <Ionicons name='time-outline' size={25} color={Colors.$textNeutral}/>
    //             </View>
    //             <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
    //                 <Text grey30>
    //                 { instrument?.data?.type == 'stock' ? 
    //                     'Stock market is currently closed.' :
    //                     'Pricing data might be delayed.'
    //                 }
    //                 </Text>
    //                 <Text grey30>
    //                 You may keep buying and selling, but prices won't change.
    //                 </Text>
    //             </View>
    //           </Card>
    //         </>
    //     )
    // };

    // const InstrumentAnalysis =  () => {
    //     let isDisplayed = false
    //     for (const insightKey in instrument.insights) {
    //         let keyMetric = instrument.insights[insightKey];
    //         if(keyMetric !== null && keyMetric !== undefined){
    //             isDisplayed = true;
    //             break;
    //         }
    //     }
    //     return isDisplayed ? (
    //     <>
    //         <Text style={globalStyles.heading}>Insights</Text>
    //         <View row flex-2>
    //         <StatCard
    //             iconName={ instrument.insights['profitableYears'] >= 0 ? 'sunny-outline' : 'rainy-outline' }
    //             metricValue={ (instrument.insights['profitableYears'] >= 0 ? '▲ ' : '▼ ') + Math.abs(instrument.insights['profitableYears']) }
    //             metricValueProps={{
    //                 color: instrument.insights['profitableYears'] >= 0 ? Colors.$textSuccess : Colors.$textDanger
    //             }}
    //             metricLabel={ instrument.insights['profitableYears'] >= 0 ? 'profitable years' : 'years losing money' }
    //             />
    //         <StatCard
    //             iconName={ instrument.insights['growthYears'] >= 0 ? 'trending-up' : 'trending-down' }
    //             metricValue={ (instrument.insights['growthYears'] >= 0 ? '▲ ' : '▼ ') + Math.abs(instrument.insights['growthYears']) }
    //             metricValueProps={{
    //                 color: instrument.insights['growthYears'] >= 0 ? Colors.$textSuccess : Colors.$textDanger
    //             }}
    //             metricLabel={ instrument.insights['growthYears'] >= 0 ? 'years of growth' : 'years in decline' }
    //         />
    //         </View>

    //     </>
    //     ) : null;
    // };

    const InstrumentChart =
     React.useMemo(() => 
    () => {
        // console.log(instrument.priceHistory)
        const barsCount = instrument.priceHistory?.data?.length;
        if(!barsCount)
            return <Card flex accessible centerV center marginV-10 padding-10 enableShadow={false} row bg-$backgroundElevated>
                <Text>This chart is not available</Text>
            </Card>

        const chartAscending = 
            instrument.priceHistory.data[barsCount-1]?.value >= instrument.priceHistory.data[0]?.value ? true : false;

        const priceHistory = instrument.priceHistory.data.map((bar) => {
            return {
                date: new Date(bar.date),
                value: bar.value
            }
        })

        return (
            <LineGraph
            points={priceHistory}
            animated={true}
            enablePanGesture={true}
            panGestureDelay={0}
            onPointSelected={onPointSelected}
            onGestureEnd={onPointScrubEnd}
            color={chartAscending ? '#3ABC49' : '#D63D2C'}
            style={{width: "100%", height: 200}}
            />
        )
    }, [instrument.priceHistory.data?.length, instrument.isRefreshing]);

    return (
    <>
    <HeaderSimple
    title={instrument.data?.name ? `${instrument.data?.name}` : APP_NAME}
    subtitle={instrument.data?.symbol}
    enableGoBack={true}   
    />
    <View bg-$backgroundDefault flex>
    <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
            refreshing={instrument.isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.$backgroundInverted} // colors for iOS
            colors={[Colors.$backgroundInverted]}  // colors for Android
            progressBackgroundColor={Colors.$backgroundDefault}
            />
        }
        >
            
            {!isScreenLoaded ? <InstrumentSkeleton /> :
            <>
            <View style={globalStyles.screenContainer}>
            <View>
            { instrument.transaction.transactionDetails?.status === 'executed' ? (
            <>
            <Card enableShadow={false} marginT-20 padding-20 containerStyle={{borderColor: Colors.$textSuccess, borderWidth: 1}}>
                 { instrument.transaction.transactionDetails?.transaction_type === 'buy' ? (
                <Text>
                    Congrats on your purchase!
                </Text>
                 ) : (
                <Text>Congrats on your sale!</Text>
                )}
            </Card>
            {
            user.isPremium ? null :
            <View marginV-20>
                <RoundBlobForNonPremium />
            </View>
            }
            </>

            ) : null}
            </View>
            <View>
                <InstrumentItem
                    selectedPrice={selectedPrice}
                    // selectedDate={selectedDate}
                    cardAlternativeText={cardAlternativeText}
                    // cardAlternativeTextColor={cardAlternativeTextColor}
                    />
                <InstrumentChart />
                <View paddingV-10>
                {/* { instrument.priceHistory.data.length > 0 ? */}
                <SegmentedControl
                    segments={[
                        {label: '4H'}, // 1 min
                        {label: '1D'}, // 15 min
                        {label: '1W'}, // 1 day
                        {label: '1M'},
                        {label: '3M'},
                        {label: '6M'},
                        {label: '1Y'}
                    ]}
                    throttleTime={500}
                    initialIndex={0}
                    onChangeIndex={(index) => {
                        dispatch(loadPriceHistory({ instrumentId: instrumentId, lookbackOption: chartLabels[index] }));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                />
                {/* : null } */}
                </View>
                
            </View>

            <View>
            <Card flex accessible centerV center marginV-10 padding-10 enableShadow={false} row bg-$backgroundElevated 
                // AI chat trigger
                onPress={() => {
                    // oepn a new chat with instrument context
                    dispatch(startNewChat({
                        context: {
                            instrumentId: instrument.data?.id,
                        }
                    }))
                    navigation.navigate('AIChat')
                }}
            >
                <View paddingH-10>
                <Ionicons name={'flash'} size={20} color={Colors.purple40} />
                </View>
                <View flex>
                <View row center>
                    <Text center>Ask AI</Text>
                </View>
                <Text text90 grey30 center>Tap to analyze the token with Ocada AI</Text>
                </View>
            </Card>
            </View>

            {/* contract address */}
            { instrument.data?.token_address?.length ?
            <View>
            <Card flex accessible centerV center marginV-10 padding-10 enableShadow={false} row bg-$backgroundElevated 
                onPress={async () => {
                    await Clipboard.setStringAsync(instrument.data?.token_address);
                    if (Platform.OS === 'ios') {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                }}
            >
                <View paddingH-10>
                <Ionicons name={'location'} size={20} color={Colors.$textNeutralLight} />
                </View>
                <View flex>
                <View row center>
                    <Text center>{instrument.data?.token_address?.slice(0, 5) + '...' + instrument.data?.token_address?.slice(-5)}</Text>
                    <Ionicons name={'copy-outline'} size={20} color={Colors.$textNeutralLight} style={{marginLeft: 10}}/>
                </View>
                <Text text90 grey30 center>contract address</Text>
                </View>
            </Card>
            </View>
            : null }

            {/* social buttons */}

            { instrument?.data?.tg_url || instrument?.data?.twitter_url || instrument?.data?.discord_url || instrument?.data?.website_url ? 
            <Card flex accessible centerV center marginV-10 padding-15 paddingH-20 enableShadow={false} row bg-$backgroundElevated>
                <View flex>
                <View row center>
                </View>
                <View row center style={{
                    // justifyContent: 'space-between',
                    flex: 1,
                    width: '100%',
                    gap: 15,
                }}>
                
                { instrument?.data?.tg_url ?
                <SocialButton
                    targetId={'TELEGRAM'}
                    bgColor={'#fff'}
                    imgSrc={() => <TelegramLogo width={32} height={32} />}
                    url={instrument?.data?.tg_url}
                />
                : null }
            
                { instrument?.data?.twitter_url ? 
                <SocialButton
                    targetId={'X'}
                    bgColor={Colors.black}
                    imgSrc={() => <XLogo width={20} height={20} fill={Colors.white} stroke={Colors.white} />}
                    url={instrument?.data?.twitter_url}
                />
                : null }

                { instrument?.data?.discord_url ?
                <SocialButton
                    targetId={'DISCORD'}
                    bgColor={'#5865F2'}
                    imgSrc={() => <DiscordLogo width={20} height={20} fill={Colors.white} />}
                    url={instrument?.data?.discord_url}
                />
                : null }

                { instrument?.data?.website_url ?
                <Pressable onPress={() => {Linking.openURL(instrument?.data?.website_url)}}>
                    <Ionicons name='globe-outline' size={32} color={Colors.$textNeutral} />
                </Pressable>
                : null }
                
                </View>

                </View>
            </Card>
            : null }

            {/* market cap + # of holders */}
            { instrument?.data?.kpi_token_metrics ? 
            <View row flex-2 gap-20 marginV-10>
            <StatCard
                iconName='logo-usd'
                metricValue={ abbreviateNumber( instrument.data?.kpi_token_metrics?.market_cap ?? 0 ) }
                metricValueProps={{ color: Colors.$textSuccess }}
                metricLabel={ 'market cap' }
            />
            <StatCard
                iconName='people'
                metricValue={ abbreviateNumber( instrument.data?.kpi_token_metrics?.holders ?? 0 ) }
                metricValueProps={{ color: true ? Colors.$textSuccess : Colors.$textDanger }}
                metricLabel={ 'holders' }
            />
            </View>
            : null }

            {/* (instrument.insights['profitableYears'] >= 0 ? '▲ ' : '▼ ')  */}
            {/* rug risk + markets*/}
            { instrument?.data?.kpi_token_metrics ? 
            <View row flex-2 gap-20 marginV-10>
            <StatCard
                iconName='flag'
                metricValue={ rugRiskFormattedText }
                metricValueProps={{ color: rugRiskFormattedColor }}
                metricLabel={ 'rug risk' }
                onPress={() => Linking.openURL(SOLANA_RUG_CHECK_BASE_URL + '/' + instrument?.data?.token_address)}
            />
            <StatCard
                iconName='cart'
                metricValue={ nMarketsFormattedText }
                metricValueProps={{ color: nMarketsFormattedColor }}
                metricLabel={ 'presence' }
            />
            </View>
            : null }


        
            <View>
                <Text style={globalStyles.heading}>Your position</Text>
                { instrument.holding?.quantity > 0 ? <HoldingCard instrument={instrument} navigation={navigation}  /> : <NoHoldingCard /> }
            </View>
            <View>
                <Text style={globalStyles.heading} selectable>Disclaimer</Text>
                <Text marginV-10 selectable style={{color: Colors.$textNeutral}}>
                    None of the information presented here is investment advice.
                </Text>
                <Text marginV-10 selectable style={{color: Colors.$textNeutral}}>
                    We source our data through third parties and in rare cases you might notice inaccuracies.
                </Text>
                <Text marginV-10 selectable style={{color: Colors.$textNeutral}}>
                    Buying crypto with real money carries risk.
                </Text>
            </View>
            <View style={{paddingBottom: 100}} />
            </View>
            </> }
        </ScrollView>
        
        <FloatingButton
            accessible
            accessibilityRole='button'
            accessibilityHint='Tap to Ask AI'
            visible={isAskAIButtonDisplayed}
            hideBackgroundOverlay={true}
            // bottomMargin={15}
            buttonLayout={FloatingButtonLayouts.HORIZONTAL}
            duration={500}
            button={{
                label: 'Buy',
                onPress: () => onBeginTransaction({transactionType: 'buy'}),
                size: 'large',
            }}
            secondaryButton={{
                label: 'Sell',
                onPress: () => onBeginTransaction({transactionType: 'sell'}),
                disabled: instrument.holding === null || instrument.holding?.quantity === 0,
                size: 'large',
            }}
        />
    </View>
    </>
    )
};


const styles = StyleSheet.create({
    container: {
    //   flex: 1,
    //   backgroundColor: '#F5FCFF'
    },
    chartControlsWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    }
  });

export default InstrumentScreen;