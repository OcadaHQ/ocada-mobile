import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions, slideFromBottomScreenOptions } from './navigation.js';
import HomeScreen from '../screens/home/home.screen';
import DiscoverHomeScreen from '../screens/discover/discover-home.screen.js';
import DiscoverSearchScreen from '../screens/discover/discover-search.screen';
import HoldingsScreen from '../screens/portfolio/my-holdings.screen';
import InstrumentScreen from '../screens/instrument/instrument.screen';
import InstrumentNewTransactionScreen from '../screens/instrument/instrument-new-transaction.screen';


const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => {
return (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
    <Screen
        name="Home"
        component={HomeScreen}
    />
    <Screen
        name="DiscoverHome"
        component={DiscoverHomeScreen}
    />
    <Screen
        name="DiscoverSearch"
        component={DiscoverSearchScreen}
    />
    <Screen
        name="Holdings"
        component={HoldingsScreen}
    />
    <Screen
        name="Instrument"
        component={InstrumentScreen}
    />
    <Screen
        name="InstrumentNewTransaction"
        component={InstrumentNewTransactionScreen}
    />
    </Navigator>
);
}

export { HomeNavigator }; 
