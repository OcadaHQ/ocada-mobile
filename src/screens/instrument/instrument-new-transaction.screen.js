import * as React from 'react';
import { ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import { TextField } from 'react-native-ui-lib';
import Button from 'react-native-ui-lib/button';
import Card from 'react-native-ui-lib/card';
import LoaderScreen from  'react-native-ui-lib/loaderScreen';
import { Colors } from  'react-native-ui-lib/style';

import { api } from '../../api/api';
import { HeaderSimple } from '../../components/header-simple';

import { refreshInstrument, refreshPrice, resetInstrument, resetTransaction, setTransactionDetails, resetTransactionReqDetails } from '../../redux/slices/instrument.slice';
import { refreshActivePortfolio } from '../../redux/slices/user.slice';
import { setError } from '../../redux/slices/error.slice';
import { errors } from '../../error-messages';
import { InstrumentSkeleton } from './instrument.skeleton';
import { InstrumentItemSimple } from './instrument.components';


import { APP_NAME } from '../../constants';
import { styles } from './instrument.style';
import { globalStyles, modalStyles } from '../../theming/common.styles';



const InstrumentNewTransactionScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const instrument = useSelector(state => state.instrument);
    const user = useSelector(state => state.user);

    const [transactionMessage, setTransactionMessage] = React.useState('');
    const [transactionStatus, setTransactionStatus] = React.useState('IDLE');
    const [tempTransaction, setTempTransaction] = React.useState({
        transactionValue: '',
        balanceAfter: user.activePortfolio?.data?.cash_balance,
    });
    const transactionValueInput = React.useRef();

    React.useEffect(() => {
        dispatch(resetTransactionReqDetails());
        dispatch(refreshPrice());
        dispatch(refreshActivePortfolio());
        
        if(instrument.transaction.type === 'buy') {
            setTempTransaction({
                ...tempTransaction,
                balanceAfter: user.activePortfolio?.data?.cash_balance
            });
        }
        else if(instrument.transaction.type === 'sell') {
            setTempTransaction({
                ...tempTransaction,
                balanceAfter: instrument.holding?.quantity
            });
        }
        transactionValueInput.current.focus();
    }, []);

    const onTransactionValueChange = (value) => {
        const BUY_TRANSACTION_VALUE_REGEX = /^[0-9]{0,10}$/;
        const SELL_TRANSACTION_VALUE_REGEX = /^[0-9]{0,10}\.{0,1}[0-9]{0,16}$/;
        
        if(instrument.transaction.type === 'buy' && BUY_TRANSACTION_VALUE_REGEX.test(value)) {
            setTempTransaction({
                transactionValue: value,
                balanceAfter: user.activePortfolio?.data?.cash_balance - value
            });
        }
        else if(instrument.transaction.type === 'sell' && SELL_TRANSACTION_VALUE_REGEX.test(value)){
            setTempTransaction({
                transactionValue: value,
                balanceAfter: instrument.holding?.quantity - value
            });
        }
        else{

            if(tempTransaction.transactionValue.substring(0, tempTransaction.transactionValue.length - 1) === value){
                if(instrument.transaction.type === 'buy'){
                    setTempTransaction({
                        transactionValue: '',
                        balanceAfter: user.activePortfolio?.data?.cash_balance
                    });
                }
                else if(instrument.transaction.type === 'sell'){
                    setTempTransaction({
                        transactionValue: '',
                        balanceAfter: instrument.holding?.quantity
                    }); 
                }
            }
        }
    };

    const onSellAll = () => {
        setTempTransaction({
            transactionValue: (instrument.holding?.quantity ?? 0).toString(),
            balanceAfter: 0
        });
    }

    const onBuyAllIn = () => {
        setTempTransaction({
            transactionValue: (user.activePortfolio?.data?.cash_balance ?? 0).toString(),
            balanceAfter: 0
        });
    }

    const onCreateTransaction = ( ) => {
        // setCTProcessing(true);
        setTransactionStatus('CREATING');
        dispatch(refreshPrice());

        if(instrument.transaction.type === 'buy') {
            api.createPortfolioTransaction( { 
                portfolioId: user.activePortfolio.data.id, 
                instrumentId: instrument.data.id,
                transactionType: instrument.transaction.type,
                quantity: tempTransaction.transactionValue / instrument.data.kpi_latest_price.price,
                message: transactionMessage
               } )
            .then(( { data } ) =>{
                if(data?.id) {                 
                    dispatch(setTransactionDetails( data ));
                    Alert.alert(
                        title=`Buy ${instrument.data?.name}?`,
                        message='',
                        buttons=[
                            { 
                              text: "Buy",
                              style: "default",
                              onPress: () => {onExecuteTransaction( data )}
                            },
                            {
                              text: "Cancel",
                              style: "cancel",
                              onPress: () => {onModalClose()}
                            },
                          ]
                    )
                }
                else {
                    dispatch(resetTransactionReqDetails());
                    dispatch(setError({
                        message: errors.PURCHASE_INSTRUMENT_ERROR,
                        detail: data,
                    }));
                }
            })
            .catch(err => {
                dispatch(resetTransactionReqDetails());
                dispatch(setError({
                    message: errors.PURCHASE_INSTRUMENT_ERROR,
                    detail: err?.response,
                }));
            })
            .finally(() => {
                setTransactionStatus('IDLE');
                // setCTProcessing(false);
            });
        }
        else if(instrument.transaction.type === 'sell') {
            api.createPortfolioTransaction( { 
                portfolioId: user.activePortfolio.data.id, 
                instrumentId: instrument.data.id,
                transactionType: instrument.transaction.type,
                quantity: tempTransaction.transactionValue,
                message: transactionMessage
               } )
            .then(( { data } ) =>{
                if(data?.id) {
                    dispatch(setTransactionDetails( data ));
                    Alert.alert(
                        title=`Sell ${instrument.data?.name}?`,
                        message='',
                        buttons=[
                            { 
                              text: "Sell",
                              style: "default",
                              onPress: () => {onExecuteTransaction( data )}
                            },
                            {
                              text: "Cancel",
                              style: "cancel",
                              onPress: () => {onModalClose()}
                            },
                          ]
                    )
                }
                else {
                    dispatch(resetTransactionReqDetails( ));
                    dispatch(setError({
                        message: errors.SELL_INSTRUMENT_ERROR,
                        detail: data,
                    }));
                }
            })
            .catch(err => {
                dispatch(resetTransactionReqDetails());
                dispatch(setError({
                    message: errors.SELL_INSTRUMENT_ERROR,
                    detail: err?.response,
                }));
            })
            .finally(() => {
                setTransactionStatus('IDLE');
                // setCTProcessing(false);
            });
        }
    };

    const onExecuteTransaction =  ( transactionData ) => {
        // setETProcessing(true);
        setTransactionStatus('EXECUTING');
        api.executeTransaction( { transactionId: transactionData?.id } )
        .then(( { data } ) => {
            // setETProcessing(false);
            setTransactionStatus('IDLE');
            if(data?.id) {
                navigation.goBack({
                    routes: [{ name: 'Instrument' }],
                });

                if(instrument.transaction.type === 'sell'){
                    const instrumentSymbol = instrument.data?.symbol;
                    const pnlAbs = ((tempTransaction.transactionValue || 0) * ((instrument.data.kpi_latest_price.price || 0) - (instrument.holding?.average_price || 0) ));
                    const bookValue = (instrument.holding?.quantity * instrument.holding?.average_price);
                    const currentValue = (instrument.holding?.quantity * instrument.data?.kpi_latest_price?.price);
                    const pnlPerc = (currentValue - bookValue)/bookValue*100;
        
                    console.log(pnlAbs)
                    { pnlAbs != 0 ?
                    navigation.navigate('ModalNav', {
                        screen: 'ScoreCard',
                        params: {
                          symbol: instrumentSymbol,
                          pnlAbs: pnlAbs,
                          pnlPerc: pnlPerc
                        }
                      })
                    : null }
                }

                dispatch(setTransactionDetails( data ));
                dispatch(refreshInstrument());
                dispatch(refreshActivePortfolio());

            }else{

                if(instrument.transaction.type === 'buy') {
                    dispatch(setError({
                        message: errors.PURCHASE_INSTRUMENT_ERROR,
                        detail: data,
                    }));
                }
                else if(instrument.transaction.type === 'sell') {
                    dispatch(setError({
                        message: errors.SELL_INSTRUMENT_ERROR,
                        detail: data,
                    }));
                }
                else{
                    dispatch(setError({
                        message: errors.UNKNOWN_ERROR,
                        detail: data,
                    }));
                }
            }
        })
        .catch((error) => {
            setTransactionStatus('IDLE');
            // setETProcessing(false);

            if(instrument.transaction.type === 'buy') {
                dispatch(setError({
                    message: errors.PURCHASE_INSTRUMENT_ERROR,
                    detail: error?.response
                }));
            }
            else if(instrument.transaction.type === 'sell') {
                dispatch(setError({
                    message: errors.SELL_INSTRUMENT_ERROR,
                    detail: error?.response
                }));
            }
            else{
                dispatch(setError({
                    message: errors.UNKNOWN_ERROR,
                    detail: error?.response
                }));
            }
        })
    };

    const onModalClose = () => {
        dispatch(resetTransactionReqDetails());
        setTransactionStatus('IDLE');
        // setETProcessing(false);
        // setCTProcessing(false);
    };


    const TransactionHelpers = () => {
        if(instrument.transaction.type === 'buy')
            return (
                <>
                <View row>
                <Text style={{
                    color: tempTransaction.balanceAfter < 0 ? Colors.$textDanger : 
                    tempTransaction.balanceAfter < (user.activePortfolio?.data?.cash_balance * 0.7) ? Colors.$textMajor : Colors.$textDefault
                    }}>Balance after purchase: ${tempTransaction.balanceAfter.toFixed(2)} </Text>
                    <Text style={{color: Colors.$textPrimary}} onPress={() => {onBuyAllIn()}}>(All in)</Text>
                </View>
                </>
                
            )
        else if(instrument.transaction.type === 'sell')
        {
            const saleValue = ((tempTransaction.transactionValue || 0) * (instrument.data.kpi_latest_price.price || 0)).toFixed(2)
            const saleProfit = ((tempTransaction.transactionValue || 0) * ((instrument.data.kpi_latest_price.price || 0) - (instrument.holding?.average_price || 0) )).toFixed(2);
            const unitType = instrument.data?.type == 'stock' ? 'Shares' : instrument.data?.type == 'crypto' ? 'Coins' : 'Units';
            return (
                <>
                    <View row>
                        <Text style={{
                            color: tempTransaction.balanceAfter < 0 ? Colors.$textDanger : Colors.$textDefault
                         }}
                    >{unitType} available: {tempTransaction.balanceAfter.toFixed(5)} </Text><Text style={{color: Colors.$textPrimary}} onPress={() => {onSellAll()}}>(Sell all)</Text>
                    </View>
                        <Text>Sale value: ${ saleValue } (
                            <Text style={{ color: saleProfit >= 0 ? Colors.$textSuccess : Colors.$textDanger }}>
                            {saleProfit >= 0 ? "+": null}${ saleProfit }
                            </Text>
                        )</Text>
                </>
            )
        }
        return null;
    }

    const CreateTransactionButton = () => {
        if(instrument.transaction.type === 'buy') 
            return (
                <View>
                    <Button
                    onPress={() => onCreateTransaction()}
                    disabled={tempTransaction.transactionValue <= 0 || tempTransaction.balanceAfter < 0 || transactionStatus === 'CREATING'}
                    backgroundColor={Colors.$backgroundSuccessHeavy}
                    label='Buy'
                    />
                    <View style={globalStyles.verticalOffset}>
                        <Text grey30>
                            Tip: a few smaller investments over time are better than a large one now
                        </Text>
                    </View>
                </View>
            )
        else if(instrument.transaction.type === 'sell')
            return (
                <View>
                    <Button
                    onPress={() => onCreateTransaction()}
                    disabled={tempTransaction.transactionValue <= 0 || tempTransaction.balanceAfter < 0 || transactionStatus === 'CREATING'}
                    backgroundColor={Colors.$backgroundDangerHeavy}
                    label='Sell'
                    />
                    <View style={globalStyles.verticalOffset}>
                        <Text grey30>
                            Tip: selling too early is an easy way to lose money
                        </Text>
                    </View>
                </View>
            )
        return null;
    }

    if(!instrument.transaction?.type === 'buy' && !instrument.transaction?.type === 'sell')
        return <InstrumentSkeleton />

    return (
    <>
    <HeaderSimple
    title={APP_NAME}
    enableGoBack={true}   
    />
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1, backgroundColor: Colors.$backgroundDefault}}>
    <TouchableWithoutFeedback 
        onPress={() => Keyboard.dismiss()}>
    <View style={globalStyles.standardContainerBottomless} bg-$backgroundDefault>
    <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        >
            <View style={globalStyles.spaceBetween}>
            <Text style={globalStyles.heading}>
            {   
            instrument.transaction.type === 'buy' ? `Buy ${instrument.data?.name}` :
            instrument.transaction.type === 'sell' ? `Sell ${instrument.data?.name}` : null
            }
            </Text>
            <View>
                <InstrumentItemSimple />
            </View>


            { transactionStatus === 'IDLE' ?
            <>
            <View>
                { instrument.transaction.type === 'buy' ? 
                
                <TextField
                leadingAccessory={<Text style={globalStyles.textBold} marginH-10>$</Text>}
                value={tempTransaction.transactionValue}
                onChangeText={(nextValue) => {onTransactionValueChange( nextValue )}}
                size='large'
                ref={transactionValueInput}
                keyboardType={Platform.OS === 'ios'? "number-pad":"numeric"}
                placeholder='How much?'
                accessibilityLabel='Enter the amount in dollars you would like to invest'
                preset='default'
                color={Colors.$textDefault}
                />

                : 
                
                instrument.transaction.type === 'sell' ? 

                <TextField
                value={tempTransaction.transactionValue}
                onChangeText={(nextValue) => {onTransactionValueChange( nextValue )}}
                size='large'
                ref={transactionValueInput}
                keyboardType='numeric'
                placeholder={
                    instrument.data?.type == 'stock' ? 'How many shares?' :
                    instrument.data?.type == 'crypto' ? 'How many coins?' : 
                    'How many units?'
                }
                accessibilityLabel={
                    instrument.data?.type == 'stock' ? 'Enter the amount of shares you would like to sell' :
                    instrument.data?.type == 'crypto' ? 'Enter the amount of coins you would like to sell' : 
                    'Enter the amount of units you would like to sell'
                }
                preset='default'
                color={Colors.$textDefault}
                />
                
                : null}
            </View>
            <View>
            <TextField
                // value={transactionMessage}
                onChangeText={(nextValue) => {setTransactionMessage( nextValue )}}
                size='large'
                // ref={transactionValueInput}
                placeholder={`*Why are you ${ instrument.transaction.type === 'buy' ? 'apeing' : instrument.transaction.type === 'sell' ? 'dumping' : null } ${instrument.data?.symbol}?`}
                hint={'Enter a message to earn +200 XP'}
                accessibilityLabel='Enter the reason'
                preset='default'
                maxLength={120}
                color={Colors.$textDefault}
                />
            </View>
            <View style={globalStyles.verticalOffset}>
                <TransactionHelpers />
            </View>

            <CreateTransactionButton />
            </>
            : <LoaderScreen color={Colors.grey40} message={'Loading...'} messageStyle={{color: Colors.grey30}} />
            }
        </View>
        </ScrollView>
        {/* <ConfirmationDialog /> */}
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </>
    )
};

export default InstrumentNewTransactionScreen;