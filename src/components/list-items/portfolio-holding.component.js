import { memo } from 'react';
import { Pressable } from 'react-native';
import dayjs from 'dayjs';
import dayJsRelativeTime from 'dayjs/plugin/relativeTime';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { Colors } from 'react-native-ui-lib/style';
import { Image } from 'expo-image';

import { abbreviateNumber } from '../../helpers/helpers';
import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';

dayjs.extend(dayJsRelativeTime)

const PortfolioHoldingItem = ({ item, onItemPress }) => {
    const bookValue = (item.quantity * item.average_price).toFixed(2);
    const currentValue = (item.quantity * item.instrument?.kpi_latest_price?.price).toFixed(2);
    const pnlPerc = (((currentValue - bookValue)/bookValue) * 100).toFixed(2);
    const pnlPercAbs = Math.abs(pnlPerc);

    return (
    <Pressable
        onPress={() => onItemPress( item )}
        accessible={true}
        accessibilityLabel={`Tap to open stock or crypto: ${item.instrument?.name}`}
        >
        <View row marginV-10>
        <View centerV>
            <Image
                source={{
                    uri: item?.instrument?.image_url ?? `${STATIC_BASE_URL}/stock-logos/${item?.instrument?.symbol}.png`
                }}
                cachePolicy={'disk'}
                style={{width: 50, height: 50, borderRadius: 25}}
            />
        </View>
        <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
            <Text style={{fontWeight: 'bold'}}>
                {item.instrument?.name}
            </Text>
            <Text style={{color: Colors.$textNeutral}}>
                Traded {dayjs(item?.date_last_updated).fromNow()}
            </Text>
        </View>
        <View centerV>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={globalStyles.textBold}>
            ${currentValue}
            </Text>
            <Text style={{color: pnlPerc < 0 ? Colors.$textDanger : Colors.$textSuccess}}>
              {pnlPerc < 0 ? '▼ ' : '▲ '}{pnlPercAbs}%
            </Text>
          </View>
        </View>
        </View>
    </Pressable>
    )
}

export default memo(PortfolioHoldingItem);