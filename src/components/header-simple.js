import React from 'react';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import {  useNavigation } from '@react-navigation/native';

import ConnectionStatusBar from 'react-native-ui-lib/connectionStatusBar';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Badge from 'react-native-ui-lib/badge';
import { Colors } from 'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image } from 'expo-image';
import { STATIC_BASE_URL } from '../constants';
import { globalStyles } from '../theming/common.styles';

const CharacterAvatar = (props) => {
    const user = useSelector(state => state.user);
    const characterId = user.activePortfolio?.data?.character_id;
    const imageFileName = user.activePortfolio?.data?.character?.image_url
    if(!characterId || !imageFileName)
        return null;
    
    const imageSrc = {uri: `${STATIC_BASE_URL}/characters/${imageFileName}`}
    // const onCharacterPress = 

    return (
        <Pressable
        // onPress={onCharacterPress}
        hitSlop={20}
        accessible={true}
        accessibilityLabel="Open settings"
        accessibilityHint="Press on character avatar to open settings"
        {...props}
        >
        <Image {...props}
            source={imageSrc}
            cachePolicy={'disk'}
            style={{width: 25, height: 25, borderRadius: 0}}
        />
        { props?.onPress === null || user.userDetails.accounts?.length ? null : <Badge backgroundColor={Colors.$backgroundDangerHeavy} size={5} style={{position: 'absolute', bottom: 0, right: 0}} /> }
        </Pressable>
    )
}


export const HeaderSimple = ( { headerTitle, title, subtitle, enableGoBack=false, displayCharacterAvatar=true, isCharacterAvatarActionable=true, backActionCbk=null, backIcon='arrow', isBackActionBadgeVisible=false, ...evaProps } ) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const onPressNavigateBack = () => {
        backActionCbk ? backActionCbk() : navigation.goBack();
    };

    const onPressAvatar = () => {
        navigation.navigate(
            'SettingsNav', { screen: 'Settings' }
        )
    }
    
    return (
    <>
    <View row spread bg-$backgroundDefault centerV
        accessibilityRole='header'
        style={{paddingTop: insets.top, paddingBottom: 10, paddingHorizontal: 10, borderBottomColor: Colors.$backgroundNeutral, borderBottomWidth: 1}}>
    <View style={{width: 25, height: 25}} centerV>
        { enableGoBack ?
        <Pressable
            onPress={onPressNavigateBack}
            hitSlop={20}
        >
        <Ionicons
            name={ 
                backIcon === 'arrow' ? 'chevron-back-sharp' :
                backIcon === 'list' ? 'list-outline' :
                backIcon === 'cross' ? 'close-sharp' :
                backIcon === 'refresh' ? 'refresh-sharp' :
                null
            }
            size={25}
            color={Colors.$textDefault}
        />
        { isBackActionBadgeVisible ? <Badge size={10} backgroundColor={Colors.$backgroundDangerHeavy} containerStyle={{position: 'absolute', top: 0, right: -5}} /> : null }
        </Pressable>
        : null }
    </View>
    <View centerV style={{height: 35}}>
        { React.isValidElement(title) ? title : <Text center style={globalStyles.textBold}>{title}</Text> }
        { subtitle ? <Text text90 grey30 center>{subtitle}</Text> : null }
    </View>
    <View style={{width: 25, height: 25}} centerV>
        { displayCharacterAvatar ? 
        <CharacterAvatar
            onPress={isCharacterAvatarActionable ? onPressAvatar : null}
        /> : null }
    </View>
    <ConnectionStatusBar label='No Internet connection' allowDismiss={true}/>
    </View>
    </>
    )
}
