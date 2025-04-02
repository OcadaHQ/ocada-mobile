import { memo } from 'react';
import { Pressable } from 'react-native';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { Colors } from 'react-native-ui-lib/style';

import { Image } from 'expo-image';
import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';
import { abbreviateNumber } from '../../helpers/helpers';


const InstrumentItem = ({ item, onItemPress }) => {
    const changePerc1D = item.kpi_latest_price?.change_perc_1d;
    const changePerc1DAbs = Math.abs(changePerc1D)?.toFixed(2);
    return (
    <Pressable
    onPress={() => onItemPress( item )}
    accessible={true}
    accessibilityLabel={`Tap to open stock or crypto: ${item.name}`}
    >
    <View row flex-3 marginV-10>
    <View centerV>
        <Image
            source={{
                uri: item.image_url ? item.image_url : `${STATIC_BASE_URL}/stock-logos/${item.symbol}.png`
            }}
            cachePolicy={'disk'}
            style={{width: 50, height: 50, borderRadius: 25}}
        />
    </View>
    <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
        <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
        <Text style={{color: Colors.$textNeutral}}>{item.subtitle}</Text>
    </View>
    <View centerV>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={globalStyles.textBold}>
            ${item.kpi_latest_price?.price?.toFixed(2)}
            </Text>
            <Text style={{color: changePerc1D < 0 ? Colors.$textDanger : Colors.$textSuccess}}>
              {changePerc1D < 0 ? '▼ ' : '▲ '}{changePerc1DAbs}%
            </Text>
            </View>
        </View>
    </View>
</Pressable>
)
}

export default memo(InstrumentItem);