import { memo } from 'react';
import { Pressable } from 'react-native';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';

import { Image } from 'expo-image';
import { globalStyles } from '../../theming/common.styles';
import { STATIC_BASE_URL } from '../../constants';


const CollectionItem = ({ item, onItemPress }) => (
<Pressable
    onPress={() => onItemPress( item )}
    accessible={true}
    accessibilityLabel={`Tap to view the collection: ${item?.display_name}`}
    >
    <View row marginV-10>
    <View centerV>      
        <Image
        source={{
            uri: `${STATIC_BASE_URL}/collection-icons/${item?.key}.png`
            }}
        cachePolicy={'disk'}
        style={{width: 50, height: 50}}
        />
    </View>
    <View style={[globalStyles.centerVertical, {flex: 1, flexDirection: 'column', flexGrow: 1, paddingLeft: 20, justifyContent: 'center'}]}>
    <View>
      <Text style={{fontWeight: 'bold'}}>
        {item?.display_name}
      </Text> 
    </View>
    { item?.is_premium ?
    <View>
        <Text
          appearance='hint'
          category={'label'}
          status={'warning'}
          >
          premium
        </Text>
    </View> : null }
    </View>
    </View>
</Pressable>
)

export default memo(CollectionItem);