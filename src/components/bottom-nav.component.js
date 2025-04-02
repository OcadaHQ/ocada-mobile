import React from 'react';
import { Pressable } from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Badge from  'react-native-ui-lib/badge';
import { Colors } from  'react-native-ui-lib/style';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

// TODO: user.userDetails.accounts?.length

export const BottomTabBar = ({ state, descriptors, navigation }) => {
  const aiConversations = useSelector(state => state.aiConversations)
  const insets = useSafeAreaInsets();
  return (
      <View row
        accessibilityRole='tablist'
        bg-$backgroundDefault
      style={{ borderTopColor: Colors.$backgroundNeutral, borderTopWidth: 1, paddingBottom: insets.bottom, paddingTop: 5 }}>
        <Text>{aiConversations.isUnseenBadgeDisplayed}</Text>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          
          const tabBarItemIcon = 
              route.name == 'HomeNav' ?  ( isFocused ? 'home' : 'home-outline' ) :
              route.name == 'CommunityNav' ? ( isFocused ? 'trophy' : 'trophy-outline' ) :
              route.name == 'AIChat' ? ( isFocused ? 'chatbubbles' : 'chatbubbles-outline' ) :
              null

          return (
            <Pressable
              accessibilityRole='tab'
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              key={index}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <Ionicons
                name={tabBarItemIcon}
                size={25}
                color={
                  route.name == 'AIChat' ? Colors.$ocadaAquaMarine :
                  isFocused ? Colors.$textPrimary : 
                  Colors.$textNeutral
                }
              />
              <Text text100 style={{
                color: 
                route.name == 'AIChat' ? Colors.$ocadaAquaMarine :
                isFocused ? Colors.$textPrimary : 
                Colors.$textNeutral
                }}>
                {label}
              </Text>
              { route.name == 'AIChat' && !isFocused && aiConversations.isUnseenBadgeDisplayed ?
              <Badge
                size={10}
                backgroundColor={Colors.$backgroundDangerHeavy} 
                containerStyle={{position: 'absolute', top: 0, right: '25%'}} />
              : null }
            </Pressable>
          );
        })}
      </View>
    );
}