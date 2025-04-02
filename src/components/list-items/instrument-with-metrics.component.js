import { memo } from 'react';
import { Pressable } from 'react-native';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { Colors } from 'react-native-ui-lib/style';

import { Image } from 'expo-image';
import StatCard from '../../components/stat-card.component';
import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';


const findKPI = ( { instrument, category, key, fiscal } ) => {
    if(instrument === null)
        return null;
    const { kpi_summary } = instrument;
    const data = kpi_summary.find(kpi => 
        kpi.category === category && kpi.kpi_key === key && kpi.fiscal === fiscal
        );
    return data?.kpi_value;
}

const InstrumentWithMetricsItem = ({ item, onItemPress }) => {

    const profitableYears = findKPI({ instrument: item, category: 'EPS', key: 'PROFIT', fiscal: 'year' });
    const growthYears = findKPI({ instrument: item, category: 'EPS', key: 'GROWTH', fiscal: 'year' });

    return (
    <Pressable
    onPress={() => onItemPress( item )}
    accessible={true}
    accessibilityLabel={`Tap to select ${item.name}`}
    style={{marginTop: 10}}
    >
    <View row>
    <View centerV>
        <Image
            source={{
                uri: item.image_url ?? `${STATIC_BASE_URL}/stock-logos/${item.symbol}.png`
            }}
            cachePolicy={'disk'}
            style={{width: 50, height: 50, borderRadius: 25}}
        />
    </View>
    <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
        <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
        <Text style={{color: Colors.$textNeutral}}>{item.subtitle}</Text>
    </View>
    </View>
    <View row flex-2 gap-20 marginV-10>
        <StatCard
          iconName={ profitableYears >= 0 ? 'sunny-outline' : 'rainy-outline' }
          metricValue={ (profitableYears >= 0 ? '▲ ' : '▼ ') + Math.abs(profitableYears) }
          metricValueProps={{
            color: profitableYears >= 0 ? Colors.$textSuccess : Colors.$textDanger
          }}
          metricLabel={ profitableYears >= 0 ? 'profitable years' : 'years losing money' }
        />
        <StatCard
          iconName={ growthYears >= 0 ? 'trending-up' : 'trending-down' }
          metricValue={ (growthYears >= 0 ? '▲ ' : '▼ ') + Math.abs(growthYears) }
          metricValueProps={{
            color: growthYears >= 0 ? Colors.$textSuccess : Colors.$textDanger
          }}
          metricLabel={ growthYears >= 0 ? 'years of growth' : 'years in decline' }
        />
    </View>
</Pressable>
)
}

export default memo(InstrumentWithMetricsItem);