import React from 'react';

import { Alert, Platform, Linking, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';
import Card from  'react-native-ui-lib/card';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemeContext } from '../../theming/theme-context';
import { setPreferredTheme } from '../../theming/preferred-theme';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as Application from 'expo-application';
import { Image } from 'expo-image';

import { HeaderSimple } from '../../components/header-simple';
import Divider from '../../components/divider.component';
import SolanaConnectComponent from '../../components/solana-connect.component';

import { connectExternalAccount, disconnectExternalAccount, deleteAccount, logout } from '../../redux/slices/user.slice';
import { errors } from '../../error-messages';
import { setError } from '../../redux/slices/error.slice';
import { globalStyles } from '../../theming/common.styles';

import { clearAllCache } from '../../storage/cache';

import { restorePurchases } from '../../helpers/purchases.helper';
import { APP_NAME, GOOGLE_AUTH_ANDROID_CLIENT_ID, GOOGLE_AUTH_EXPO_CLIENT_ID, GOOGLE_AUTH_IOS_CLIENT_ID, GOOGLE_AUTH_WEB_CLIENT_ID,
   PRIVACY_POLICY_URL, STATIC_BASE_URL } from '../../constants';
import { Pressable } from 'react-native';
import SocialButtonsRow from '../../components/social-buttons-row-component';

WebBrowser.maybeCompleteAuthSession();

const SettingItem = ({ label, iconName, componentRight, onPress, ...props }) => (
  <Pressable onPress={onPress}>
  <View paddingV-20 flex row centerV>
    <Ionicons name={iconName} size={20} color={Colors.$textNeutralLight} />
    <View flexG paddingH-10>
      <Text>{ label }</Text>
    </View>
    <View>
      { componentRight ? componentRight : <Ionicons name='chevron-forward-sharp' size={20} color={Colors.$textNeutralLight} /> }
    </View>
  </View>
  </Pressable>
)

const SettingsHomeScreen = ({ navigation }) => {
   
  const themeContext = React.useContext(ThemeContext);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [googleAuthRequest, googleAuthResponse, googleAuthPromptAsync] = Google.useAuthRequest(
  {
      scopes: ['profile', 'email'],
      expoClientId: GOOGLE_AUTH_EXPO_CLIENT_ID,
      iosClientId: GOOGLE_AUTH_IOS_CLIENT_ID,
      androidClientId: GOOGLE_AUTH_ANDROID_CLIENT_ID,
      webClientId: GOOGLE_AUTH_WEB_CLIENT_ID,
  });

  // on google auth
  React.useEffect(() => {
    if (googleAuthResponse?.type === 'success') {
        dispatch(connectExternalAccount( { provider: 'google', token: googleAuthResponse?.authentication?.accessToken } ));
      }
  }, [googleAuthResponse]);
  

  const MenuItemExtAccountApple = () => {

    const onAppleAccountConnect = async () => {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        const { identityToken } = credential;
        dispatch(connectExternalAccount( { provider: 'apple', token: identityToken }))
        .unwrap()
        .catch((rejectedValueOrSerializedError) => {

          switch(rejectedValueOrSerializedError.status){
            case 409:
              dispatch(setError({
                message: errors.ACCOUNT_ALREADY_CONNECTED,
                detail: rejectedValueOrSerializedError
              }));
              break;
            default:
              dispatch(setError({
                message: errors.UNKNOWN_ERROR,
                detail: rejectedValueOrSerializedError
              }));
            }
          });
      } catch (e) {
        if (e.code === 'ERR_CANCELED') {
          // User canceled the sign-in flow, do nothing
        } else {
          dispatch(setError({
            message: errors.UNKNOWN_ERROR,
            detail: {
              code: e.code,
              message: e.message,
            },
          }));
        }
      }
    }

    const onAppleAccountDisconnect = async () => {
      Alert.alert(
        "You're disconnecting your Apple account",
        `Once you disconnect your Apple account, you won't be able to log into ${APP_NAME} with it. Do you want to disconnect the account?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Disconnect",
            style: "destructive",
            onPress: () => dispatch(disconnectExternalAccount( {provider: 'apple'} ))
          }
        ]
      );
    };
    
    if (Platform.OS === 'ios') {
      const foundAccount = user.userDetails?.accounts?.find(extAccount => extAccount.provider === 'apple');
      if (foundAccount === undefined) {
        return (
          <SettingItem
          label='Connect Apple account'
          iconName='logo-apple'
          onPress={onAppleAccountConnect}
          componentRight={user.userDetails.accounts?.length ? null : <Ionicons name='warning-outline' size={20} color={Colors.$textDanger} />}
          />
        )
      } else{
        return (
          <SettingItem
          label='Disconnect Apple account'
          iconName='logo-apple'
          onPress={onAppleAccountDisconnect}
          />
        )
      }
    }
    else{
      return null;
    }
  }

  const MenuItemExtAccountSolana = () => {

    const PhantomConnectButton = (props) => (
      <SettingItem
      label='Connect Solana (Phantom)'
      iconName='wallet-outline'
      componentRight={user.userDetails.accounts?.length ? null : <Ionicons name='warning-outline' size={20} color={Colors.$textDanger} />}
      {...props}
      />
    )

    const SolflareConnectButton = (props) => (
      <SettingItem
      label='Connect Solana (Solflare)'
      iconName='wallet-outline'
      componentRight={user.userDetails.accounts?.length ? null : <Ionicons name='warning-outline' size={20} color={Colors.$textDanger} />}
      {...props}
      />
    )

    const onAccountDisconnect = async () => {
      Alert.alert(
        "You're disconnecting your Solana account",
        `Once you disconnect your Solana account, you won't be able to log into ${APP_NAME} with it. Do you want to disconnect the account?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Disconnect",
            style: "destructive",
            onPress: () => dispatch(disconnectExternalAccount( {provider: 'solana'} ))
          }
        ]
      );
    };
  
    const foundAccount = user.userDetails?.accounts?.find(extAccount => extAccount.provider === 'solana');
    if (foundAccount === undefined) {
      return (
        <>
        <SolanaConnectComponent
          RenderComponent={PhantomConnectButton}
          walletApp='phantom'
        />
        <Divider />
        <SolanaConnectComponent
          RenderComponent={SolflareConnectButton}
          walletApp='solflare'
        />
        </>
      )
    } else{
      return (
        <SettingItem
        label='Disconnect Solana account'
        iconName='wallet-outline'
        onPress={onAccountDisconnect}
        />
      )
    }
  }

  const MenuItemExtAccountGoogle = () => {

    const onGoogleAccountConnect = async () => {
      googleAuthPromptAsync();
    }

    const onGoogleAccountDisconnect = async () => {
      Alert.alert(
        "You're disconnecting your Google account",
        `Once you disconnect your Google account, you won't be able to log into ${APP_NAME} with it. Do you want to disconnect the account?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Disconnect",
            style: "destructive",
            onPress: () => dispatch(disconnectExternalAccount({provider: 'google'}))
          }
        ]
      );
    };

    const foundAccount = user.userDetails?.accounts?.find(extAccount => extAccount.provider === 'google');

    if (foundAccount === undefined) {
      return (
        <SettingItem
        label='Connect Google account'
        iconName='logo-google'
        onPress={onGoogleAccountConnect}
        componentRight={user.userDetails.accounts?.length ? null : <Ionicons name='warning-outline' size={20} color={Colors.$textDanger} />}
        />
      )
    } else {
      return (
        <SettingItem
        label='Disconnect Google account'
        iconName='logo-google'
        onPress={onGoogleAccountDisconnect}
        />
      )
    }
  };

  const onPressSetGoals = () => {
    navigation.navigate(
      'GoalsNav', { screen: 'SetDream' }
    )
  }

  // event handlers

  const onToggleDarkTheme = () => {
    const newPreferredTheme = themeContext.theme === 'dark' ? 'light' : 'dark';
    setPreferredTheme(newPreferredTheme);
    themeContext.toggleTheme();
  };

  const onPressViewCredits = () => {
    navigation.navigate('Credits');
  };

  const onPressContactSupport = () => {
    navigation.navigate('Contact');
  }

  const onPressChangeCharacterAvatar = () => {
    navigation.navigate('ChangeCharacterAvatar');
  };

  const onPressChangeCharacterName = () => {
    navigation.navigate('ChangeCharacterName');
  };

  const onPressViewPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const onPressClearCache = async () => {
    Alert.alert(
      "Clear cache",
      "All cache will be cleared. Do you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear cache",
          style: "destructive",
          onPress: () => {
            clearAllCache();
          }
        }
      ]
    );
  };

  const onLogout = () => {
    Alert.alert(
      "You are about to log out",
      "It's been fun while you were here. Sure you want to leave?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log out",
          style: "destructive",
          onPress: () => dispatch(logout())
        }
      ]
    );
  };

  const onPressDeleteAccount = () => {

    const onConfirmDeleteAccount = () => {
      dispatch(deleteAccount())
      .unwrap()
      .then(() =>{
        dispatch(logout());
      })
      .catch((rejectedValueOrSerializedError) => {
        dispatch(setError({
          message: errors.UNKNOWN_ERROR,
          detail: rejectedValueOrSerializedError
        }));
      });
      
    }

    Alert.alert(
      'Delete my account',
      'If you continue, your account along with all your progress, characters and data will be deleted. This is immediate and cannot be reversed.\n\nEven though we might get a little sad seeing you go, we support your privacy and will always be happy to see you back.\n\nAre you sure you want to delete your account?',
      [
          {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
          },
          {
              text: 'Delete my account',
              onPress: () => {onConfirmDeleteAccount()},
              style: 'destructive',
          },
      ],
      {cancelable: false},
    );
  };

  const appVersion = Application.nativeApplicationVersion ?? 'UNKNOWN';
  const buildVersion = Application.nativeBuildVersion ?? 'UNKNOWN';
  const debugLine = `App version ${appVersion} (build ${buildVersion})`

  return (
  <>
  <HeaderSimple
    title='Settings'
    enableGoBack={true}
    backActionCbk={null}
    backIcon={'cross'}
    displayCharacterAvatar={false}
  />
  <View flex bg-$backgroundDefault paddingH-20>
    <ScrollView
      showsVerticalScrollIndicator={false}
    >

    <Text style={globalStyles.heading}>My character</Text>
    <Card enableShadow={false} paddingH-20>
      <SettingItem
        label='Change name'
        iconName='pencil'
        componentRight={
          <Text style={{color: Colors.$textNeutral}}>{user.activePortfolio?.data?.name}</Text>
        }
        onPress={onPressChangeCharacterName}
      />
      <Divider />
      <SettingItem
        label='Change avatar'
        iconName='person-circle-outline'
        componentRight={
          ( user.activePortfolio?.data?.character_id && user.activePortfolio?.data?.character?.image_url ) ?
          <Image 
            source={{uri: `${STATIC_BASE_URL}/characters/${user.activePortfolio?.data?.character?.image_url}`}}
            cachePolicy={'disk'}
            style={{width: 20, height: 20, borderRadius: 0}}
          /> : null
        }
        onPress={onPressChangeCharacterAvatar}
      />
      <Divider />
      <SettingItem
        label='Set goals'
        iconName='rocket-outline'
        onPress={onPressSetGoals}
      />
    </Card>

    
    <Text style={globalStyles.heading}>My account</Text>
    <Card enableShadow={false} paddingH-20>
      {/* 
            <MenuItemExtAccountApple />
      
      */}
    <MenuItemExtAccountApple />
    <Divider />
    <MenuItemExtAccountGoogle/>
    <Divider />
    <MenuItemExtAccountSolana />
    <Divider />

    <SettingItem
      label={ user.isPremium ? 'My Premium' : 'Upgrade to Premium' }
      iconName='checkmark-circle-outline'
      onPress={() => {
        analytics().logEvent('paywall_open', {source: 'settings'});
        navigation.navigate('PaywallNav',{screen: 'Paywall'})}
    }
    />
    <Divider />
    <SettingItem
        label='Restore purchases'
        iconName='sync'
        onPress={restorePurchases}
      />
    </Card>


    <Text style={globalStyles.heading}>App settings</Text>
    <Card enableShadow={false} paddingH-20>
    {/* 
      <MenuItem
        title='Dark theme'
        onPress={onToggleDarkTheme}
        accessoryRight={DarkThemeToggle}/>
    */}
      <SettingItem
        label='Clear cache'
        iconName='close-circle-outline'
        onPress={onPressClearCache}
      />
      <Divider />
      <SettingItem
        label='Notifications'
        iconName='notifications-outline'
        onPress={() => {Linking.openSettings()}}
      />
    </Card>

    <Text style={globalStyles.heading}>Socials</Text>
    <Card enableShadow={false} paddingH-20 paddingV-20>
      <SocialButtonsRow />
    </Card>

    <Text style={globalStyles.heading}>Information</Text>
    <Card enableShadow={false} paddingH-20>
      <SettingItem
        label='Privacy policy'
        iconName='shield-checkmark-outline'
        onPress={onPressViewPrivacyPolicy}
      />
      <Divider />
      <SettingItem
        label='Credits'
        iconName='heart-outline'
        onPress={onPressViewCredits}
      />
      <Divider />
      <SettingItem
        label='Contact & support'
        iconName='chatbubbles-outline'
        onPress={onPressContactSupport}
      />
    </Card>


    <Text style={globalStyles.heading}>Danger zone</Text>
    <Card enableShadow={false} paddingH-20>
      <SettingItem
        label='Delete account'
        iconName='trash-bin-outline'
        onPress={onPressDeleteAccount}
      />
      <Divider />
      <SettingItem
        label='Log out'
        iconName='log-out-outline'
        onPress={onLogout}
      />
    </Card>

    <View marginV-20>
      <Text center grey30 selectable>
        {debugLine}
      </Text>
    </View>

    </ScrollView>

  </View>


  </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  left15: {
    paddingLeft: 15
  }

});

export { SettingsHomeScreen };
