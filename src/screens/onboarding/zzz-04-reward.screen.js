import * as React from 'react';
import LottieView from 'lottie-react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { LandingImage, LandingImageWrapper } from '../../components/landing-image.component';
import { BottomPadding } from '../../components/bottom-padding.component';

import { styles } from './onboarding.style';
import { globalStyles } from '../../theming/common.styles';

import iconMedal from '../../../assets/images/onboarding/medal.png';

const OnboardingRewardScreen = ({ navigation, title }) => {

  const onCompleteStep = (  ) => {
    navigation.navigate('OnboardingFinish');
  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(75)}
    enableGoBack={false}
    isCharacterAvatarActionable={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>

  <View style={globalStyles.spaceBetween}>
    <Text style={globalStyles.heading}>
    You've earned $1000 in virtual rewards!
    </Text>
    <View>
    <Text>
      Keep learning about investing to make progress and earn even more rewards.
      </Text>
      <LandingImageWrapper source={iconMedal} level='2' />
      <LottieView source={require('../../../assets/animations/confetti.json')} autoPlay loop={false} />
      <Text>
      Now, let's use this money to buy your first stock.
      </Text>
    </View>
    <Button
        onPress={() => {onCompleteStep()}}
        style={globalStyles.tappable}
        label='Collect reward'
        />
  </View>
    </View>
  </>
  )
};

export { OnboardingRewardScreen };
