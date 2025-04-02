import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from './navigation.js';
import { SettingsHomeScreen } from '../screens/settings/settings-home.screen';
import { CreditsScreen } from '../screens/settings/credits.screen';
import { ContactScreen } from '../screens/settings/contact.screen';
import { ChangeCharacterAvatarScreen } from '../screens/settings/character-avatar.screen';
import { ChangeCharacterNameScreen } from '../screens/settings/character-name.screen.js';

const { Navigator, Screen } = createStackNavigator();

const SettingsNavigator = () => {
return (
    <Navigator
    screenOptions={{...defaultScreenOptions}}>
    <Screen
        name="Settings"
        title="Settings"
        component={SettingsHomeScreen}
    />
    <Screen
        name="Credits"
        title="Credits"
        component={CreditsScreen}
    />
    <Screen
        name="Contact"
        title="Contact"
        component={ContactScreen}
    />
    <Screen
        name="ChangeCharacterAvatar"
        component={ChangeCharacterAvatarScreen}
    />
    <Screen
        name="ChangeCharacterName"
        component={ChangeCharacterNameScreen}
    />
    </Navigator>
);
}

export { SettingsNavigator }; 
