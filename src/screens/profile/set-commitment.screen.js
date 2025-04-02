import * as React from 'react';
import { ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import Card from 'react-native-ui-lib/card';
import LoaderScreen from  'react-native-ui-lib/loaderScreen';
import { Colors } from  'react-native-ui-lib/style';

import { api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';

import { setError } from '../../redux/slices/error.slice';
import { errors } from '../../error-messages';


import { globalStyles, modalStyles } from '../../theming/common.styles';
import { BottomPadding } from '../../components/bottom-padding.component';
import { setUserDetails } from '../../redux/slices/user.slice';

const SetCommitmentScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const percentCompleted = 80;
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(null);
    const inputRef = React.useRef();

    // set focus on input
    React.useEffect(() => {
        // inputRef.current.focus();
    }, []);
    
    const onCompleteStep = ( commitmentLevel ) => {
        setIsProcessing(true)

        api.setCommitment( commitmentLevel )
          .then(( { data } ) => {
            dispatch(setUserDetails(data))
            navigation.goBack()
          })
          .catch((error) => {
            dispatch(setError({
              message: errors.SET_COMMITMENT_LEVEL_ERROR,
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
    backIcon='cross'
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
                    Ready to reach your goal?
                </Text>
                <Text marginV-5>
                    To reach your goal, you need to take small steps regularly.
                </Text>
                <Text marginV-5>
                    How much are you determined to get there?
                </Text>
            </View>

            <View>
                <Button
                    marginV-10
                    outline
                    onPress={() => onCompleteStep( 'serious' )}
                    disabled = { isProcessing }
                    backgroundColor={Colors.$backgroundSuccessHeavy}
                    label={ 'I\'m serious and want to learn daily' }
                />
                <Button
                    marginV-10
                    outline
                    onPress={() => onCompleteStep( 'casual' )}
                    disabled = { isProcessing }
                    backgroundColor={Colors.$backgroundPrimaryMedium}
                    label={ 'A couple of times a week is enough' }
                />
            </View>

            
        </View>
        </ScrollView>
        <BottomPadding />
    </View>
    </KeyboardAvoidingView>
    </>
    )
};

export default SetCommitmentScreen;