import { memo } from 'react';
import { Pressable } from 'react-native';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Drawer from 'react-native-ui-lib/drawer';
import { Colors } from 'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';

import { Image } from 'expo-image';
import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';
import { abbreviateNumber } from '../../helpers/helpers';


const TransactionItem = ({ item, onItemPress, onSecondarySelect }) => {
    const transactionPrice = item?.value / item?.quantity;
    const currentPrice = item?.instrument?.kpi_latest_price?.price;

    const purchasePnlPerc = (((currentPrice - transactionPrice)/transactionPrice) * 100).toFixed(2);
    const purchasePnlPercAbs = Math.abs(purchasePnlPerc);

    const salePnlPerc = item?.ex_avg_price > 0 ? (transactionPrice/item.ex_avg_price).toFixed(2) : 0;
    const salePnlPercAbs = Math.abs(salePnlPerc);
    

    return (
    <Drawer
      rightItems={[
        {
          text: 'View investor',
          background: Colors.$backgroundElevatedLight,
          onPress: () => {onSecondarySelect( item )}
        }
      ]}
    >
    <Pressable
    onPress={() => onItemPress( item )}
    accessible={true}
    accessibilityLabel={`Tap to open the stock or crypto: ${item?.instrument?.name}`}
    style={{backgroundColor: Colors.$backgroundDefault}}
    >

      <View marginV-10>
      <View row flex-3>
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
          <View>
            <Text>
            <Text style={{fontWeight: 'bold'}}>
              {item?.transaction_type == 'buy' ? 'Bought' :
              item?.transaction_type == 'sell' ? 'Sold' : null}
            </Text> {item?.instrument?.name} 
            </Text>
          </View>
          <View row>
              { item?.portfolio?.user?.is_premium ? 
              <Ionicons name="checkmark-circle-sharp" size={15} color={Colors.$textPrimary} style={{marginRight: 5}} />
              : null }
              <Text text90 grey30>
              {item?.portfolio?.name}, {dayjs(item?.date_executed).fromNow()}
              </Text>
          </View>
          { item?.message ? 
          <View>
            <Text text90>{item?.message}</Text>
          </View>
          : null }
        </View>
        <View centerV>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={globalStyles.textBold}>
            ${abbreviateNumber(item?.value.toFixed(0))}
            </Text>
            { item?.transaction_type == 'buy' ?
            <Text style={{color: purchasePnlPerc < 0 ? Colors.$textDanger : Colors.$textSuccess}}>
              {purchasePnlPerc < 0 ? '▼ ' : '▲ '}{purchasePnlPercAbs}%
            </Text>
            : 
            <Text style={{color: salePnlPerc < 0 ? Colors.$textDanger : Colors.$textSuccess}}>
              {salePnlPerc < 0 ? '▼ ' : '▲ '}{salePnlPercAbs}%
            </Text>
            }
          </View>
        </View>
      </View>

      </View>
      </Pressable>
      </Drawer>
    )
};

export default memo(TransactionItem);