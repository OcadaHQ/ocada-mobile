import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import GiantButton from '../../components/giant-button.component';
import { globalStyles } from '../../theming/common.styles';
import { setIsRiskTaker } from '../../redux/slices/onboarding.slice';
import iconCompass from '../../../assets/images/onboarding/compass.png';
import iconRocket from '../../../assets/images/onboarding/rocket.png';


const OnboardingRiskPreferenceScreen = ({ navigation, title }) => {

  const onboarding = useSelector((state) => state.onboarding);
  const dispatch = useDispatch();

  const pickRiskPreference = ( { isRiskTaker } ) => {
    dispatch( setIsRiskTaker( isRiskTaker ) );
    navigation.navigate('OnboardingCharacterGreeting');
  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(45)}
    enableGoBack={true}
    displayCharacterAvatar={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>

  <View style={globalStyles.spaceBetween}>
    <Text style={globalStyles.heading}>
    What's more important to you?
    </Text>
    <View>
      <GiantButton
      buttonIcon={iconCompass}
      buttonText={'Stability'}
      onPress={() => {pickRiskPreference({isRiskTaker: false}, navigation)}}
      />

      <GiantButton
        buttonIcon={iconRocket}
        buttonText={'Fast growth'}
        onPress={() => {pickRiskPreference({isRiskTaker: true}, navigation)}}
        />
    </View>
    <View />
    </View>
    </View>
  </>
  )
};

export { OnboardingRiskPreferenceScreen };
