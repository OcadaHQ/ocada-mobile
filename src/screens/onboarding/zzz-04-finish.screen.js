import * as React from 'react';
import { Alert, Image, StyleSheet, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';
import { Colors, Scheme } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { ThemeContext } from '../../theming/theme-context';
import { globalStyles } from '../../theming/common.styles';

import { initUser, connectExternalAccount } from '../../redux/slices/user.slice';
import { setError } from '../../redux/slices/error.slice';
import { errors } from '../../error-messages';

import { STATIC_BASE_URL } from '../../constants';
import defaultImage from '../../../assets/images/missing-file.png';
import iconHeart from '../../../assets/images/heart.png';

import { GOOGLE_AUTH_ANDROID_CLIENT_ID, GOOGLE_AUTH_EXPO_CLIENT_ID, GOOGLE_AUTH_IOS_CLIENT_ID, GOOGLE_AUTH_WEB_CLIENT_ID } from '../../constants';

WebBrowser.maybeCompleteAuthSession();

const IconGoogle = () => (
  <Ionicons name='logo-google' size={13} style={{marginRight: 10}} />
)

const OnboardingFinishScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const onboarding = useSelector(state => state.onboarding);
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
        dispatch(connectExternalAccount({ provider: 'google', token: googleAuthResponse?.authentication?.accessToken }))
        .unwrap()
        .then((originalPromiseResult) => {
          dispatch(initUser());
        })
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
      }
  }, [googleAuthResponse]);

  const onSkip = (  ) => {
    Alert.alert(
      "Never lose your progress",
      "Connect an account to access your profile anywhere. We won't spam you and you can always change your mind by managing your connected accounts in the settings menu.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Skip anyway",
          style: "destructive",
          onPress: () => dispatch(initUser())
        }
      ]
    );
  }

  const ButtonConnectApple = () => {

    const themeContext = React.useContext(ThemeContext);

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
        .then((originalPromiseResult) => {
          dispatch(initUser());
        })
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
    //  console.log(user.userDetails, user.userDetails.accounts)
    if (Platform.OS === 'ios') {
      const foundAccount = user.userDetails?.accounts?.find(extAccount => extAccount.provider === 'apple');
      if (foundAccount === undefined) {


        return (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={Scheme.currentScheme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={22}
            style={[globalStyles.tappable, { width: '100%', height: 44 }]}
            onPress={() => onAppleAccountConnect()}
          />
        )
      } else{
        return (
          <Button
          disabled={true}
          style={globalStyles.tappable}
          label='Apple account already connected'
          />
        )
      }
    }
    else{
      return null;
    }
  }

  const ButtonConnectGoogle = () => {

    const onGoogleAccountConnect = async () => {
      googleAuthPromptAsync();
    }

    const foundAccount = user.userDetails?.accounts?.find(extAccount => extAccount.provider === 'google');
    if (foundAccount === undefined) {
      return (
        <Button
        onPress={() => onGoogleAccountConnect()}
        iconSource={IconGoogle}
        style={[globalStyles.tappable]}
        backgroundColor={Colors.blue30}
        label='Continue with Google'
        />
      )
    } else{
      return (
        <Button
        disabled={true}
        style={globalStyles.tappable}
        label='Google account already connected'
        />
      )
    }

  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(95)}
    enableGoBack={false}
    isCharacterAvatarActionable={false}
  />
  
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>

  <View style={globalStyles.spaceBetween} level='2'>
    <View>
      <Text style={globalStyles.heading}>
      Ready to go!
      </Text>
    </View>
    <View>
    <Text>
      Create a profile now to track your gains.
      </Text>
    </View>
    <LottieView source={require('../../../assets/animations/money-confetti.json')} autoPlay loop={false} />
    <View>
    <ButtonConnectApple />
    <ButtonConnectGoogle />
    <Button
        onPress={() => {onSkip()}}
        style={globalStyles.tappable}
        link
        label='I will link my account later'
        />
    </View>
  </View>
  </View>
  </>
  )
};

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
  },
  heart: {
    width: 25,
    height: 25
  }
});

export { OnboardingFinishScreen };
