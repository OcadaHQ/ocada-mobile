import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { Colors } from 'react-native-ui-lib/style';
import { BlurView } from "@react-native-community/blur";

import { Image } from 'expo-image';
import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';
import { abbreviateNumber } from '../../helpers/helpers';


const InstrumentMoverItem = ({ item, onItemPress, isCensored }) => {
    const changePerc1D = item.kpi_latest_price?.change_perc_1d?.toFixed(2);
    const changePerc1DAbs = Math.abs(changePerc1D);
    return (
    <Pressable
    onPress={() => onItemPress( item )}
    accessible={true}
    accessibilityLabel={`Tap to open stock or crypto: ${item.name}`}
    >
    <View column flex-3 marginH-10 marginV-10>
    <View centerV center style={isCensored ? styles.censoredContainer : {}}>
        <Image
            source={{
                uri: item.image_url ?? `${STATIC_BASE_URL}/stock-logos/${item.symbol}.png`
            }}
            cachePolicy={'disk'}
            style={[{
                width: 50, height: 50, borderRadius: 25,
            }, isCensored ? styles.censoredView : {}]}
        />
        { isCensored ? 
        <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      : null }
    </View>
   
    <View center marginV-5>
        { isCensored ? null : <Text style={{fontWeight: 'bold'}}>{item.symbol}</Text> }
    </View>
    <View centerV center>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: changePerc1D < 0 ? Colors.$textDanger : Colors.$textSuccess}}>
              {changePerc1D < 0 ? '▼ ' : '▲ '}{changePerc1DAbs}%
            </Text>
            </View>
        </View>
    </View>
</Pressable>
)
}

const styles = StyleSheet.create({
    censoredContainer: {
        width: 50,
        height: 50,
    },
    censoredView: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blurView: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

      

export default memo(InstrumentMoverItem);