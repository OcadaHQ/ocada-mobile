import * as React from 'react';
import { TouchableOpacity } from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import Button from 'react-native-ui-lib/button';
import { Colors } from  'react-native-ui-lib/style';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import StatCard from '../../components/stat-card.component';
import { formatGainLoss } from '../../helpers/helpers';
import AnimatedText from '../../components/animated-text.component';

import { STATIC_BASE_URL } from '../../constants';
import { globalStyles } from '../../theming/common.styles';
import { ColorSwatch } from 'react-native-ui-lib';

const iconShare = () => (
  <Ionicons name="share-outline" size={20} color={Colors.$iconPrimary} style={{marginRight: 10}} />
)


export const InstrumentItem = ( { selectedPrice, cardAlternativeText } ) => {

    const instrument = useSelector(state => state.instrument);
    // const instrumentPrice = instrument.data?.kpi_latest_price?.price;

    return (
    <Card
        enableShadow={false}
        bg-$backgroundElevated
        marginV-10
        padding-20
        >
        <View style={globalStyles.row}>
        <View style={{flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}>
          <Image
          source={{
              uri: instrument?.data?.image_url ?? `${STATIC_BASE_URL}/stock-logos/${instrument?.data?.symbol}.png`
            }}
          cachePolicy={'disk'}
          style={{width: 50, height: 50, borderRadius: 25}}
          />
        </View>
        <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
            <Text style={{fontWeight: 'bold'}}>{instrument.data?.name}</Text>
            { instrument.data?.subtitle ? <Text style={{color: Colors.$textNeutral}}>{instrument.data?.subtitle}</Text> : null }
            <View row spread marginT-10>
              <AnimatedText text={selectedPrice} style={{color: Colors.$textDefault, fontSize: 20, fontWeight: 'bold'}} />
              <AnimatedText text={cardAlternativeText} style={{color: Colors.$textNeutral}} />
            </View>
        </View>
      </View>
    </Card>
    )
};

export const InstrumentItemSimple = () => {

  const instrument = useSelector(state => state.instrument);
  // const instrumentPrice = instrument.data?.kpi_latest_price?.price;

  return (
  <Card
      enableShadow={false}
      bg-$backgroundElevated
      marginV-10
      padding-20
      >
      <View style={globalStyles.row}>
      <View style={{flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}>
      <Image
        source={{
            uri: instrument?.data?.image_url ?? `${STATIC_BASE_URL}/stock-logos/${instrument?.data?.symbol}.png`
          }}
        cachePolicy={'disk'}
        style={{width: 50, height: 50, borderRadius: 25}}
        />
      </View>
      <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
          <Text style={{fontWeight: 'bold'}}>{instrument.data?.name}</Text>
          { instrument.data?.subtitle ? <Text style={{color: Colors.$textNeutral}}>{instrument.data?.subtitle}</Text> : null }
          <View row spread marginT-10>
            <Text style={{color: Colors.$textDefault, fontSize: 20, fontWeight: 'bold'}}>
            ${ instrument.data?.kpi_latest_price?.price.toFixed(2) }
            </Text>
          </View>
      </View>
    </View>
  </Card>
  )
};

export const NoHoldingCard = () => (
  <Card
    enableShadow={false}
    bg-$backgroundElevated
    padding-20
  >
  <Text style={{color: Colors.$textNeutral}}>
      You do not hold this asset yet.
  </Text>
  </Card>
);

export const HoldingCard = ( { instrument, navigation } ) => {

  const user = useSelector(state => state.user);
  const bookValue = (instrument.holding?.quantity * instrument.holding?.average_price).toFixed(2);
  const currentValue = (instrument.holding?.quantity * instrument.data?.kpi_latest_price?.price).toFixed(2);
  const pnl = currentValue - bookValue


  return (
  <>
  <View flex-2 row gap-20 marginV-10>
    <StatCard
      iconName='cash-outline'
      metricValue={'$' + currentValue}
      metricLabel='Current value'
    />
    <StatCard
      iconName='documents-outline'
      metricValue={instrument.holding?.quantity.toFixed(5)}
      metricLabel={ instrument.data?.type == 'stock' ? 'No. of shares' : instrument.data?.type == 'crypto' ? 'No. of coins' : 'No. of units' }
    /> 
  </View>

  <View flex-2 row gap-20 marginV-10>
    <StatCard
      iconName='pricetag-outline'
      metricValue={'$' + instrument.holding?.average_price.toFixed(2)}
      metricLabel={ instrument.data?.type == 'stock' ? 'Avg. price per share' : instrument.data?.type == 'crypto' ? 'Avg. price per coin' : 'Avg. price per unit' }
    />
    <StatCard
      iconName='stats-chart-outline'
      metricValue={ formatGainLoss(pnl) }
      metricValueProps={{
        color: pnl < 0 ? Colors.$textDanger : Colors.$textSuccess
      }}
      metricLabel={ pnl < 0 ? 'Loss' : 'Gain' }
    />
  </View>

  { pnl != 0 ? 
  <View>
    <Button
      label='Share'
      outline={true}
      iconSource={iconShare}
      onPress={()=> {
        navigation.navigate('ModalNav', {
          screen: 'ScoreCard',
          params: {
            symbol: instrument?.data?.symbol,
            pnlAbs: pnl,
            pnlPerc: (currentValue - bookValue)/bookValue*100
          }
        })
      }}
    />
  </View>
  : null }
  </>
  )
};
