import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from  'react-native-ui-lib/button';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { LandingImageWrapper } from '../../components/landing-image.component';

import { api } from '../../api/api';

import { refreshActivePortfolio } from '../../redux/slices/user.slice';
import { setError } from '../../redux/slices/error.slice';
import { styles } from './onboarding.style';
import { globalStyles } from '../../theming/common.styles';
import { errors } from '../../error-messages';

import iconPlant from '../../../assets/images/onboarding/plant.png';


const OnboardingStockInvestingScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const onboarding = useSelector(state => state.onboarding);
  const user = useSelector(state => state.user);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const onCompleteStep = () => {
    // 1. create portfolio. if successful:
    //  a. save as active portfolio (refreshActivePortfolio)
    //  b. reset navigation to cash reward

    setIsProcessing(true);

    api.createPortfolio( { 
      characterId: onboarding.selectedCharacter.id,
      characterName: onboarding.characterName,
      isPublic: true,
      isRiskTaker: onboarding.isRiskTaker,
     } )
    .then(( { data } ) =>{

      dispatch(refreshActivePortfolio())
      .unwrap()
      .then(() => {
        // reset navigation
        navigation.reset({
          index: 0,
          routes: [{ name: 'OnboardingCashReward' }],
        });
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
      setIsProcessing(false);
      dispatch(setError({
        message: errors.CREATE_PORTFOLIO_ERROR,
        detail: {}
      }))
    })


  }

  return (
  <>
  <HeaderSimple
    title={ProgressBar(65)}
    enableGoBack={true}
    displayCharacterAvatar={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>

  <View style={globalStyles.spaceBetween} level='2'>
    <View level='2'>
      <Text style={globalStyles.heading}>
      Investing in stock
      </Text>
    </View>
    <View level='2'>
    <Text>
      Successful companies grow, and as they do, so does each of their shares.
      </Text>
      <LandingImageWrapper source={iconPlant} />
      <Text>
      When people invest in stocks, they bet that $1 they spend today could multiply in the future.
      </Text>
    </View>
    <View level='2'>
    <Button
        disabled={isProcessing}
        onPress={() => {onCompleteStep()}}
        style={globalStyles.tappable}
        label={isProcessing ? 'Creating profile...' : 'Got it'}
        />
    </View>
  </View>
    </View>
  </>
  )
};

export { OnboardingStockInvestingScreen };
