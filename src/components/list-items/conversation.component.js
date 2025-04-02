import { memo } from 'react';
import { Pressable } from 'react-native';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Drawer from 'react-native-ui-lib/drawer';
import Badge from 'react-native-ui-lib/badge';
import { Colors } from 'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';

import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';
import { abbreviateNumber } from '../../helpers/helpers';


const truncateText = (text, limit) => {
  if (text.length > limit) {
    return text.slice(0, limit) + '...';
  }
  return text;
}

const ConversationItem = ({ item, onItemPress, onSecondarySelect }) => {

    return (
    <Drawer
      rightItems={[
        {
          text: 'Read',
          background: Colors.$backgroundElevatedLight,
          // onPress: () => {onSecondarySelect( item )}
        }
      ]}
    >
    <Pressable
    onPress={() => onItemPress( item )}
    accessible={true}
    accessibilityLabel={`Tap to open the conversation: ${item?.instrument?.name}`}
    style={{backgroundColor: Colors.$backgroundDefault}}
    >

      <View row flex-3 marginV-10 paddingH-20>
        <View centerV style={{height: 50}}>
        </View>
        <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, justifyContent: 'center'}]}>
          <View>
            <Text style={{fontWeight: item?.unseen ? 'bold' : 'normal' }}>
              { truncateText(item?.display_name, 35) }
            </Text>
            { item?.last_update && dayjs().unix() >= item?.last_update ?
            <Text text90 grey30>
              { dayjs.unix(item?.last_update).fromNow() }
            </Text> : null }
          </View>
          <View row>
          </View>
        </View>
        <View centerV>
          <View style={{alignItems: 'flex-end'}}>
            {/* seen/unseen goes here */}
            { item?.unseen ? 
            <Badge
            backgroundColor={Colors.$backgroundDangerHeavy} 
            size={10}/> : null } 
          </View>
        </View>
      </View>
      </Pressable>
      </Drawer>
    )
};

export default memo(ConversationItem);