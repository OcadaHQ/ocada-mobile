import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from './navigation.js';
import { OnboardingPickCharacterScreen } from '../screens/onboarding/01-pick-character.screen';
import { OnboardingNameCharacterScreen } from '../screens/onboarding/02-name-character.screen';
import { OnboardingCharacterGreetingScreen } from '../screens/onboarding/03-character-greeting.screen';

const { Navigator, Screen } = createStackNavigator();

const OnboardingNavigator = () => {
return (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
    <Screen
        name="OnboardingPickCharacter"
        component={OnboardingPickCharacterScreen}
    />
    <Screen
        name="OnboardingNameCharacter"
        component={OnboardingNameCharacterScreen}
    />
    <Screen
        name="OnboardingCharacterGreeting"
        component={OnboardingCharacterGreetingScreen}
    />
    </Navigator>
);
}

export { OnboardingNavigator }; 
