import * as React from 'react';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { LandingImageWrapper } from '../../components/landing-image.component';
import { globalStyles } from '../../theming/common.styles';

import iconBrick from '../../../assets/images/onboarding/brick.png';

const OnboardingStockDefinitionScreen = ({ navigation, title }) => {

  const onCompleteStep = () => {
    navigation.navigate('OnboardingStockInvesting');
  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(55)}
    enableGoBack={true}
    displayCharacterAvatar={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>

  <View style={globalStyles.spaceBetween}>
    <View>
      <Text style={globalStyles.heading}>
      What's a stock?
      </Text>
    </View>
    <View>
    <Text>
      Most largest companies in the world are split into many equal pieces, known as shares or stocks.
      </Text>
      <LandingImageWrapper source={iconBrick} />
      <Text>
      Owning a share of a company gives you the right to benefit from success and receive a portion of income.
      </Text>
    </View>
    <View>
    <Button
        onPress={() => {onCompleteStep()}}
        style={globalStyles.tappable}
        label={'That\'s cool'}
        />
    </View>
  </View>
    </View>
  </>
  )
};

export { OnboardingStockDefinitionScreen };
