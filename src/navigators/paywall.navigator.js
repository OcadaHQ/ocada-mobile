import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PaywallScreen from '../screens/paywall/paywall.screen'
import { defaultScreenOptions, slideFromBottomScreenOptions } from './navigation.js';
const { Navigator, Screen } = createStackNavigator();


const PaywallNavigator = () => (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
        <Screen
            name="PaywallModal"
            component={PaywallScreen}
        />
    </Navigator>
);

export { PaywallNavigator }; 
