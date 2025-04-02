import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform} from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';
import { TextField } from 'react-native-ui-lib';
import { Colors } from  'react-native-ui-lib/style';


import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { LandingImageWrapper } from '../../components/landing-image.component';
import { globalStyles } from '../../theming/common.styles';

import { errors } from '../../error-messages';
import { api } from '../../api/api'
import { refreshActivePortfolio, initUser } from '../../redux/slices/user.slice';
import { setError } from '../../redux/slices/error.slice';

import iconSolana from '../../../assets/images/solana-logo.png';


const OnboardingCharacterGreetingScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const onboarding = useSelector((state) => state.onboarding);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [inviteCodeInput, setInviteCodeInput] = React.useState('');
  const [isKeyboardOn, setKeyboardOn] = React.useState(false);

  // const onCompleteStep = ( ) => {
  //   navigation.navigate('OnboardingStockDefinition');
  // }

  React.useEffect(() => {

    const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardOn(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardOn(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onCompleteStep = () => {
    // 1. create portfolio. if successful:
    //  a. save as active portfolio (refreshActivePortfolio)
    //  b. reset navigation to cash reward

    setIsProcessing(true);

    if(inviteCodeInput){
      api.setReferrer( inviteCodeInput )
      .then(() => {})
      .catch(() => {})
    }
    api.createPortfolio( { 
      characterId: onboarding.selectedCharacter.id,
      characterName: onboarding.characterName,
      isPublic: true,
      // isRiskTaker: onboarding.isRiskTaker,
     } )
    .then(( { data } ) =>{

      dispatch(refreshActivePortfolio())
      .unwrap()
      .then(() => {
        // reset navigation
        dispatch(initUser())
      })
      .catch(error => {
        dispatch(setError({
          message: 'We managed to create your portfolio, but we couldn\'t save it as your active portfolio. Try restarting the app and report this issue to us.',
          detail: {}
        }))
      })
      .finally(() => {
        setIsProcessing(false);
      });
    })
    .catch((error) => {
      console.log(error)
      setIsProcessing(false);
      dispatch(setError({
        message: errors.CREATE_PORTFOLIO_ERROR,
        detail: {}
      }))
    })


  }

  return (
  <>
  { !isKeyboardOn ? <HeaderSimple
    title={ProgressBar(75)}
    enableGoBack={true}
    displayCharacterAvatar={false}
  /> : null }
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex: 1}}>
  <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}>
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>

  <View style={globalStyles.spaceBetween}>
    <View>
      <Text style={globalStyles.heading}>
      Hey {onboarding.characterName}!
      </Text>
    </View>
    <View>
    <Text>With your profile set up, let's dive into Solana's web3 metaverse!</Text>
      <LandingImageWrapper source={iconSolana} />
      <View>

<TextField
  value={inviteCodeInput}
  placeholder='Do you have an invite code?'
  onChangeText={(nextValue) => {setInviteCodeInput( nextValue )}}
  accessibilityLabel='Enter a name for your character'
  preset='default'
  color={Colors.$textDefault}
/>
</View>
    </View>
    <View>
    <Button
        onPress={() => {onCompleteStep()}}
        style={globalStyles.tappable}
        disabled={isProcessing}
        label={isProcessing ? 'Creating profile...' : 'Let\'s go!'}
        />
    </View>
    </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </>
  )
};

export { OnboardingCharacterGreetingScreen };
