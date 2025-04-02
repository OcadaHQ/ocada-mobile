import React from 'react';
import { Platform } from 'react-native';

import View from  'react-native-ui-lib/view';
import Button from  'react-native-ui-lib/button';
import Text from  'react-native-ui-lib/text';
import { Colors, Scheme } from  'react-native-ui-lib/style';

import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Ionicons from '@expo/vector-icons/Ionicons';


import { HeaderSimple } from '../../components/header-simple';
import { BottomPadding } from '../../components/bottom-padding.component';
import { LandingImage } from '../../components/landing-image.component';
import SolanaConnectComponent from '../../components/solana-connect.component';

import { styles } from './guest-home.style';
import { globalStyles } from '../../theming/common.styles';

import { useDispatch } from 'react-redux';
import { loginWithExternalAccount } from '../../redux/slices/user.slice';

// import iconHandWave from '../../../assets/images/onboarding/hand-wave.png';
import iconOcada from '../../../assets/images/ocada-orange.png'
import { setError } from '../../redux/slices/error.slice';
import { errors } from '../../error-messages';
import {
  APP_NAME,
  GOOGLE_AUTH_ANDROID_CLIENT_ID, GOOGLE_AUTH_EXPO_CLIENT_ID, GOOGLE_AUTH_IOS_CLIENT_ID, GOOGLE_AUTH_WEB_CLIENT_ID,
} from '../../constants';


WebBrowser.maybeCompleteAuthSession();

const IconGoogle = ( { style } ) => (
  <Ionicons name='logo-google' size={13} style={{marginRight: 10}} />
)

const AppleAuthenticationComponent = () => {

  const dispatch = useDispatch();

  const processAuth = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken } = credential;
      dispatch(loginWithExternalAccount( { provider: 'apple', token: identityToken }))
      .unwrap()
      .catch((rejectedValueOrSerializedError) => {
        dispatch(setError({
          message: errors.LOGIN_ERROR,
          detail: rejectedValueOrSerializedError
        }));
      })
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

  return (
  <AppleAuthentication.AppleAuthenticationButton
    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
    buttonStyle={Scheme.currentScheme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
    cornerRadius={22}
    style={[globalStyles.tappable, { width: '100%', height: 44 }]}
    onPress={() => processAuth()}
  />
  )
}

const GoogleAuthenticationComponent = () => {

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
        dispatch(loginWithExternalAccount( {
          provider: 'google',
          token: googleAuthResponse?.authentication?.accessToken 
        } ))
        .unwrap()
        .catch((rejectedValueOrSerializedError) => {
          dispatch(setError({
            message: errors.LOGIN_ERROR,
            detail: rejectedValueOrSerializedError
          }));
        })
      }
  }, [googleAuthResponse]);

  const onGoogleAuthPress = () => {
    googleAuthPromptAsync();
  };

  return (
    <Button
    onPress={() => onGoogleAuthPress()}
    iconSource={IconGoogle}
    style={[globalStyles.tappable, { width: '100%', height: 44 }]}
    label='Sign in with Google'
    backgroundColor={Colors.blue30}
    />
  )
}


const PhantomConnectButton = (props) => (
  <Button
  style={[globalStyles.tappable, { width: '100%', height: 44 }]}
  label='Sign in with Phantom'
  backgroundColor={'#ab9ff2'}
  {...props}
  />
)

const SolflareConnectButton = (props) => (
  <Button
  style={[globalStyles.tappable, { width: '100%', height: 44 }]}
  label='Sign in with Solflare'
  backgroundColor={'#fba752'}
  {...props}
  />
)

const GuestHomeScreen = ({ navigation, title }) => {
  return (
  <>
  {/* <HeaderSimple
    title={APP_NAME}
    enableGoBack={false}
  /> */}
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>
    <View style={globalStyles.spaceBetween}>
    <View></View>
    <View style={styles.pagerContainer} key={2}>
      <LandingImage source={iconOcada} />
      <Text style={styles.captionHeading}>Welcome to {APP_NAME}</Text>
    </View>
    <View>
    { Platform.OS === 'ios' ? 
      <AppleAuthenticationComponent style={styles.button} />
      :
      <></>
      }
      <GoogleAuthenticationComponent style={styles.button} />

      <SolanaConnectComponent RenderComponent={PhantomConnectButton} walletApp='phantom' />

      <SolanaConnectComponent RenderComponent={SolflareConnectButton} walletApp='solflare' />
      
      <BottomPadding />
    </View>

      </View>
    </View>
  </>
  )
};



export { GuestHomeScreen };
