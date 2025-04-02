import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './tab.navigator';
import { defaultScreenOptions, slideFromBottomScreenOptions } from './navigation.js';
import { SettingsNavigator } from './settings.navigator';
import { ModalNavigator } from './modal.navigator';
import { PaywallNavigator } from './paywall.navigator';
import { GoalsNavigator } from './goals.navigator';

const { Navigator, Screen} = createStackNavigator();

const RegularNavigator = () => (
  <Navigator
    screenOptions={{ headerShown: false}}>
    <Screen name='TabNav' component={TabNavigator}/>
    <Screen
      name='GoalsNav'
      component={GoalsNavigator}
      options={{...slideFromBottomScreenOptions}}
    />
    <Screen
      name='SettingsNav'
      component={SettingsNavigator}
      options={{...slideFromBottomScreenOptions}}
    />
    <Screen
      name='ModalNav'
      component={ModalNavigator}
      options={{...slideFromBottomScreenOptions}}
    />
    <Screen
      name='PaywallNav'
      component={PaywallNavigator}
      options={{...slideFromBottomScreenOptions}}
    />
  </Navigator>
);

export { RegularNavigator };
