import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BottomTabBar } from '../components/bottom-nav.component';
import { HomeNavigator } from './home.navigator';
import { CommunityNavigator } from './community.navigator';
import AIChatScreen from '../screens/ai/chat.screen';
import { APP_NAME } from '../constants';


const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    name="TabNav"
    screenOptions={{ headerShown: false}}
    tabBar={props => <BottomTabBar {...props} />}
    >
    <Tab.Screen
      name='HomeNav'
      title='Home'
      component={HomeNavigator}
      options={{
        tabBarLabel: 'Home'
      }}
    />
    <Tab.Screen
      name='CommunityNav'
      title='Leaderboard'
      component={CommunityNavigator}
      options={{
        tabBarLabel: 'Leaderboard'
      }}
    />
    <Tab.Screen
      name='AIChat'
      title={`${APP_NAME} AI`}
      component={AIChatScreen}
      options={{
        tabBarLabel: 'Ask AI'
      }}
    />
  </Tab.Navigator>
);

export { TabNavigator };