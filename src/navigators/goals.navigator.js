import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SetDreamScreen from '../screens/profile/set-dream.screen.js';
import SetLongTermGoalScreen from '../screens/profile/set-long-term-goal.screen.js';
import SetAgeScreen from '../screens/profile/set-age.screen.js';
import SetCommitmentScreen from '../screens/profile/set-commitment.screen.js';
import { defaultScreenOptions, slideFromBottomScreenOptions } from './navigation.js';

const { Navigator, Screen } = createStackNavigator();


const GoalsNavigator = () => (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
        <Screen
            name="SetDream"
            component={SetDreamScreen}
        />
        <Screen
            name="SetLongTermGoal"
            component={SetLongTermGoalScreen}
        />
        <Screen
            name="SetAge"
            component={SetAgeScreen}
        />
        <Screen
            name="SetCommitment"
            component={SetCommitmentScreen}
        />
    </Navigator>
);

export { GoalsNavigator }; 
