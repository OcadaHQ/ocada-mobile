import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { TextField } from 'react-native-ui-lib';
import { Colors } from  'react-native-ui-lib/style';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { BottomPadding } from '../../components/bottom-padding.component';
import { LandingImageWrapper } from '../../components/landing-image.component';

import { styles } from './onboarding.style';
import { globalStyles } from '../../theming/common.styles';

import { setCharacterName } from '../../redux/slices/onboarding.slice';
import { setError } from '../../redux/slices/error.slice';

import { TEMP_CHARACTER_NAME_REGEX, STATIC_BASE_URL } from '../../constants';
import { errors } from '../../error-messages';
import { default as characterNames } from '../../../assets/data/character-names.json';

const OnboardingNameCharacterScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const [tempCharacterName, setTempCharacterName] = React.useState('');
  const onboarding = useSelector(state => state.onboarding);
  const user = useSelector(state => state.user);
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
    dispatch( setCharacterName( tempCharacterName ) )
    .unwrap()
    .then((originalPromiseResult) => {
      navigation.navigate('OnboardingCharacterGreeting');
    })
    .catch((rejectedValueOrSerializedError) => {
      dispatch(setError({
        message: errors.INVALID_CHARACTER_NAME,
        detail: rejectedValueOrSerializedError
      }));
    })
  }


  return (
  <>
  {!isKeyboardOn ? <HeaderSimple
    title={ProgressBar(55)}
    enableGoBack={true}
  /> : null }
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex: 1}}>
  <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}>
  <View style={[globalStyles.standardContainer, {justifyContent: "space-around"}]} bg-$backgroundDefault>
  <View style={globalStyles.spaceBetween}>
    <View>
      <Text style={!isKeyboardOn ? globalStyles.heading: globalStyles.headingTopMargin}>
      What's your name?
      </Text>
    </View>
    <View>
    <LandingImageWrapper
      source={{uri: `${STATIC_BASE_URL}/characters/${onboarding.selectedCharacter.imageUrl}`}}
      accessibilityRole='image'
      />
    </View>
    <View>

    <TextField
      value={tempCharacterName}
      placeholder='Enter the name'
      onChangeText={(nextValue) => {onCharacterNameChange( nextValue )}}
      // accessoryRight={setRandomNameIcon}
      accessibilityLabel='Enter a name for your character'
      preset='default'
      color={Colors.$textDefault}
    />
    </View>
    <View>
    <Button
        onPress={() => {onCompleteStep()}}
        style={globalStyles.tappable}
        size='large'
        label='Continue'
        />
      <BottomPadding level='2' />
    </View>
  </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </>
  )
};

export { OnboardingNameCharacterScreen };
