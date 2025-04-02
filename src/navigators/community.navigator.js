import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions, slideFromBottomScreenOptions } from './navigation.js';
import LeaderboardScreen from '../screens/community/leaderboard.screen';
import CommunityPortfolioScreen from '../screens/community/community-portfolio.screen';
import InstrumentScreen from '../screens/instrument/instrument.screen';
import InstrumentNewTransactionScreen from '../screens/instrument/instrument-new-transaction.screen';


const { Navigator, Screen } = createStackNavigator();

const CommunityNavigator = () => (
    <Navigator
        screenOptions={{...defaultScreenOptions}}
    >
    <Screen
        name="Leaderboard"
        component={LeaderboardScreen}
    />
    <Screen
        name="CommunityPortfolio"
        component={CommunityPortfolioScreen}
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

export { CommunityNavigator }; 
