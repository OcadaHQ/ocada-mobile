import * as React from 'react';
import { ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { TextField } from 'react-native-ui-lib';
import Button from 'react-native-ui-lib/button';
import { Colors } from  'react-native-ui-lib/style';

import { api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';

import { setError } from '../../redux/slices/error.slice';
import { errors } from '../../error-messages';


import { globalStyles } from '../../theming/common.styles';
import { BottomPadding } from '../../components/bottom-padding.component';

const SetLongTermGoalScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const percentCompleted = 40;
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(null);
    const inputRef = React.useRef();

    // set focus on input
    React.useEffect(() => {
        inputRef.current.focus();
    }, []);

    // navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'OnboardingCashReward' }],
    //   });
    
    const onCompleteStep =  () => {
        setIsProcessing(true)

        api.setLongTermGoal( inputValue )
          .then(( { data } ) => {
            navigation.navigate('SetAge')
          })
          .catch((error) => {
            console.log(JSON.stringify(error))
            dispatch(setError({
              message: errors.SET_GOAL_ERROR,
              detail: {
                "code": error?.code
              }
            }))
          })
          .finally(() => {
            setIsProcessing(false);
          });

    };

    return (
    <>
    <HeaderSimple
    title={ProgressBar(percentCompleted)}
    enableGoBack={true}   
    />
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1, backgroundColor: Colors.$backgroundDefault}}>
    <View style={globalStyles.standardContainerBottomless} bg-$backgroundDefault>
    <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        >
            <View style={globalStyles.spaceBetween}>
            <View>
                <Text style={globalStyles.heading}>
                    How much money will make you happy?
                </Text>
                <Text grey30>
                    Just provide an estimate, you can change it in the future.
                </Text>
            </View>
            <TextField
                leadingAccessory={<Text style={globalStyles.textBold} marginH-10>$</Text>}
                // value={tempTransaction.transactionValue}
                onChangeText={(nextValue) => {
                    setInputValue( nextValue )
                }}
                size='large'
                maxLength={9}
                ref={inputRef}
                keyboardType={Platform.OS === 'ios'? "number-pad":"numeric"}
                placeholder='How much in dollars?'
                accessibilityLabel='Enter the amount in dollars you would like to invest'
                preset='default'
                color={Colors.$textDefault}
            />

            <Button
                marginV-10
                onPress={() => onCompleteStep()}
                disabled={
                    isProcessing || !inputValue
                }
                backgroundColor={Colors.$backgroundPrimaryMedium}
                label={isProcessing ? 'Saving...' : 'Next'}
            />
        </View>
        </ScrollView>
        <BottomPadding />
    </View>
    </KeyboardAvoidingView>
    </>
    )
};

export default SetLongTermGoalScreen;