import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform} from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { TextField } from 'react-native-ui-lib';
import { Colors } from  'react-native-ui-lib/style';
import { useDispatch, useSelector } from 'react-redux';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { BottomPadding } from '../../components/bottom-padding.component';
import { LandingImageWrapper } from '../../components/landing-image.component';

import { api } from '../../api/api';

import { globalStyles } from '../../theming/common.styles';

import { setError } from '../../redux/slices/error.slice';
import { refreshActivePortfolio } from '../../redux/slices/user.slice';
import { TEMP_CHARACTER_NAME_REGEX, STATIC_BASE_URL } from '../../constants';
import { errors } from '../../error-messages';

const ChangeCharacterNameScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [tempCharacterName, setTempCharacterName] = React.useState(user.activePortfolio?.data?.name);
  
  const [isKeyboardOn, setKeyboardOn] = React.useState(false);

  const onCharacterNameChange = (text) => {
    if(TEMP_CHARACTER_NAME_REGEX.test(text)) {
      setTempCharacterName(text);
    }
  }

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

    api.updatePortfolioName({
        portfolioId: user.activePortfolio?.data?.id,
        name: tempCharacterName
    })
    .then((response) => {
        dispatch(refreshActivePortfolio());
        navigation.goBack();
    })
    .catch((error) => {
      dispatch(setError({
        message: errors.PORTFOLIO_UPDATE_NAME_ERROR,
        detail: error?.data
      }));
    })
  }


  return (
  <>
  {!isKeyboardOn ? <HeaderSimple
    title='Change name'
    enableGoBack={true}
    displayCharacterAvatar={false}
  /> : null }
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}>
  <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}>
  <View style={[globalStyles.standardContainerBottomless, {justifyContent: "space-around"}]} bg-$backgroundDefault>
  <View style={globalStyles.spaceBetween}>
    <View>
      <Text style={!isKeyboardOn ? globalStyles.heading: globalStyles.headingTopMargin}>
      What should we call your character?
      </Text>
    </View>
    <View>
    <LandingImageWrapper
      source={{uri: `${STATIC_BASE_URL}/characters/${user.activePortfolio?.data?.character?.image_url}`}}
      accessibilityRole='image'
      />
    </View>
    <View>

    <TextField
      value={tempCharacterName}
      placeholder='Enter the name'
      onChangeText={(nextValue) => {onCharacterNameChange( nextValue )}}
      accessibilityLabel='Enter a new name for your character'    
      preset={'default'}  
      color={Colors.$textDefault}
    />
    </View>
    <View>
    <Button
        onPress={() => {onCompleteStep()}}
        disabled={!tempCharacterName?.length}
        style={globalStyles.tappable}
        label='Save'
        />
      <BottomPadding />
    </View>
    </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </>
  )
};

export { ChangeCharacterNameScreen };
