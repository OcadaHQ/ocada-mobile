import * as React from 'react';
import { FlatList, RefreshControl, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ContentLoader, { Circle, Rect } from "react-content-loader/native";

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from  'react-native-ui-lib/card';
import Button from  'react-native-ui-lib/button';
import LoaderScreen from  'react-native-ui-lib/loaderScreen';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import InstrumentWithMetricsItem from '../../components/list-items/instrument-with-metrics.component';
import Divider from '../../components/divider.component';

import { globalStyles, modalStyles } from '../../theming/common.styles';

import { api } from '../../api/api';

import { errors } from '../../error-messages';
import { STATIC_BASE_URL } from '../../constants';
import { setSelectedInstrument } from '../../redux/slices/onboarding.slice';
import { setError } from '../../redux/slices/error.slice';
import contentLoaderProps from '../../helpers/content-loader-props.helper';

const IconShuffle = () => (
  <Ionicons name='shuffle' size={20} color={Colors.$textPrimary} style={{marginRight: 10}} />
);


const StockListSkeleton = ( props ) => {

  const LoaderLine = () => (
    <Card
    style={[globalStyles.tappable, {marginVertical: 10}]}
    enableShadow={false}
    >
      <ContentLoader
          height={90}
          width={500}
          {...contentLoaderProps}>
        <Circle cx="30" cy="45" r="30" />
        <Rect x="80" y="10" rx="2" ry="2" width="150" height="10" />
        <Rect x="80" y="30" rx="2" ry="2" width="125" height="10" />
        </ContentLoader>
  </Card>
  );

  return (
  <>
  <View>
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
  </View>
  </>
  )
}

const OnboardingPickStockScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const onboarding = useSelector((state) => state.onboarding);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScreenLoaded, setScreenLoaded] = React.useState(false);
  const [stockList, setStockList] = React.useState([]);

  const onPressBuyStock = ( selectedStock ) => {

    setIsProcessing(true);

    // todo: make stock purchase a dispatchable action
    // todo: check stock pricing data
    api.createPortfolioTransaction( { 
      portfolioId: user.activePortfolio.data.id, 
      instrumentId: selectedStock.id,
      transactionType: "buy",
      quantity: 100 / selectedStock.kpi_latest_price.price,
     } )
    .then(( { data } ) =>{
      if(data?.id) {
        api.executeTransaction( { transactionId: data.id } )
        .then(( { data } ) => {
          dispatch(setSelectedInstrument(selectedStock));
          setIsProcessing(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'OnboardingFinish' }],
          });
        })
        .catch((error) => {
          dispatch(setError({
            message: errors.PURCHASE_INSTRUMENT_ERROR,
            detail: {}
          }))
        });
      }
      else {
        dispatch(setError({
          message: errors.PURCHASE_INSTRUMENT_ERROR,
          detail: {}
        }))
      }
    })
    .catch((error) => {
      setIsProcessing(false);
      dispatch(setError({
        message: errors.PURCHASE_INSTRUMENT_ERROR,
        detail: {}
      }))
    })
  }

  const updateStockList = async (displaySkeleton=true) => {
    if(displaySkeleton)
      setScreenLoaded(false);
    
      api.getInstruments({
        q: null,
        skip: 0,
        limit: 3,
        showWellKnownOnly: true,
        sort: 'shuffle'
      })
      .then(( { data }) => {
        setStockList(data);
        setScreenLoaded(true);
      })
      .catch((error) => {
        dispatch(setError({
          message: errors.STOCK_LIST_LOADING_ERROR,
          detail: {}
        }));
      })
  };

  const onRefresh = React.useCallback(() => {
    setStockList([])
    updateStockList();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    updateStockList(true);
  }, []);

  const EmptyContent = () => {

    if(!isScreenLoaded)
      return <StockListSkeleton />

    return (
    <View style={globalStyles.spaceBetween}>
      <View></View>
      <View style={globalStyles.center}>
        <Text>No stocks found. Pull to refresh</Text>
      </View>
      <View></View>
    </View>
    );
  };

  const StockListHeader = () => (
    <>
      <Text style={globalStyles.heading}>
      Pick a stock
      </Text>
      <Text>
        Let's invest $100 in a business.
      </Text>
    </>
  );

  if(isProcessing){
    return (
      <>
      <HeaderSimple
        title={ProgressBar(80)}
        enableGoBack={true}
        isCharacterAvatarActionable={false}
      />
      <View style={globalStyles.standardContainer} bg-$backgroundDefault>
      <LoaderScreen color={Colors.grey40} message={'Loading...'} messageStyle={{color: Colors.grey30}} />
      </View>
      </>
    )
  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(80)}
    enableGoBack={true}
    isCharacterAvatarActionable={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>
    <FlatList
        data={stockList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <InstrumentWithMetricsItem
            item={item}
            key={item.id}
            onItemPress={() => {
              Alert.alert(
                title='Buy ' + item.name,
                message='Would you like to invest $100 in ' + item.name + '?',
                buttons=[
                  { 
                    text: "Buy",
                    style: "default",
                    onPress: () => onPressBuyStock( item )
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ]
              )
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.$backgroundInverted} // colors for iOS
            colors={[Colors.$backgroundInverted]}  // colors for Android
            progressBackgroundColor={Colors.$backgroundDefault}
          />
        }
        // contentContainerStyle={}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={StockListHeader}
        ListEmptyComponent={EmptyContent}
        ItemSeparatorComponent={Divider}
        numColumns={1}
      />
  <View>
    <Button
        onPress={() => {onRefresh()}}
        style={globalStyles.tappable}
        iconSource={IconShuffle}
        outline
        label='I want to see other stocks'
        ></Button>
  </View>
  </View>
  </>
  )
};

export { OnboardingPickStockScreen };
