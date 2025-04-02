import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from './navigation.js';
import { GuestHomeScreen } from '../screens/home/guest-home.screen';


const { Navigator, Screen } = createStackNavigator();

const GuestNavigator = () => {
return (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
    <Screen
        name="GuestHome"
        component={GuestHomeScreen}
    />
    </Navigator>
);
}

export { GuestNavigator }; 
