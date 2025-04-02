import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from  'react-native-ui-lib/card';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

const InfoIcon = () => (
  <Ionicons name='information-circle-outline' size={15} color={Colors.$textNeutral} style={{position: 'absolute', top: 5, right: 5}} />
)

const StatCard = ({ metricValue, metricValueProps, metricLabel, iconName, ...props }) => (
  <Card flex accessible centerV center margiV-10 padding-10 enableShadow={false} row bg-$backgroundElevated {...props}>
    <View paddingH-10>
      <Ionicons name={iconName} size={20} color={Colors.$textNeutralLight} />
    </View>
    <View flex>
      <Text center {...metricValueProps}>{metricValue}</Text>
      <Text text90 grey30 center>{metricLabel}</Text>
    </View>
    { props?.onPress ? <InfoIcon /> : null }
  </Card>
)

export default StatCard;