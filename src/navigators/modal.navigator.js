import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DailyChallengeScreen } from '../screens/challenges/daily-challenge.screen'
import { XP101Screen } from '../screens/community/xp-101.screen'
import { VirtualCashModalScreen } from '../screens/modals/virtual-cash.screen'
import { ConversationsModalScreen } from '../screens/ai/conversations.screen';
import { ScoreCardScreen } from '../screens/instrument/score-card.screen';
import PaywallScreen from '../screens/paywall/paywall.screen'
import { defaultScreenOptions, slideFromBottomScreenOptions } from './navigation.js';
const { Navigator, Screen } = createStackNavigator();


const ModalNavigator = () => (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
        <Screen
            name="DailyChallenge"
            component={DailyChallengeScreen}
        />
        <Screen
            name="ScoreCard"
            component={ScoreCardScreen}
        />
        <Screen
            name="XP101"
            component={XP101Screen}
        />
        <Screen
            name="VirtualCashModal"
            component={VirtualCashModalScreen}
        />
        <Screen
            name="ConversationsModal"
            component={ConversationsModalScreen}
        />
    </Navigator>
);

export { ModalNavigator }; 
