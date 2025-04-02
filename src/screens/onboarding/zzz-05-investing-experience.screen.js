import * as React from 'react';
import { useDispatch } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import GiantButton from '../../components/giant-button.component';
import { BottomPadding } from '../../components/bottom-padding.component';

import { setExperience } from '../../redux/slices/user.slice';
import { setError } from '../../redux/slices/error.slice';
import { setIsExperiencedInvestor } from '../../redux/slices/onboarding.slice';
import { errors } from '../../error-messages';

import { globalStyles } from '../../theming/common.styles';

import iconWitch from '../../../assets/images/onboarding/witch.png';
import iconGuru from '../../../assets/images/onboarding/fakir.png';


const OnboardingInvestingExpScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();

  const setHasExperience = ( hasExperience, navigation ) => {

    dispatch( setIsExperiencedInvestor( hasExperience ) );

    dispatch( setExperience( { hasExperience } ) )
    .unwrap()
    .then((originalPromiseResult) => {
      navigation.navigate('OnboardingRiskPreference');
    })
    .catch((rejectedValueOrSerializedError) => {
      dispatch(setError({
        message: errors.UNKNOWN_ERROR,
        detail: rejectedValueOrSerializedError
      }));
    })
  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(35)}
    enableGoBack={true}
    displayCharacterAvatar={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>
      <View style={globalStyles.spaceBetween}>
        <Text style={globalStyles.heading}>
        Do you know how to pick a stock?
        </Text>
        <View>
          <GiantButton
          buttonIcon={iconWitch}
          buttonText={'I\'m just beginning to learn'}
          onPress={() => {setHasExperience(false, navigation)}}
          />

          <GiantButton
            buttonIcon={iconGuru}
            buttonText={'I\'ve got some experience'}
            onPress={() => {setHasExperience(true, navigation)}}
            />
        </View>
          <BottomPadding level='2' />
      </View>
    </View>
  </>
  )
};

export { OnboardingInvestingExpScreen };
