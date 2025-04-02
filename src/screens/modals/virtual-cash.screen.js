import * as React from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';

import { HeaderSimple } from '../../components/header-simple';
import { BottomPadding } from '../../components/bottom-padding.component';
import { globalStyles } from '../../theming/common.styles';
import { APP_NAME } from '../../constants';



const VirtualCashModalScreen = ({ navigation }) => {

  return (
  <>
  <HeaderSimple
    title='How virtual cash works'
    enableGoBack={true}
    backActionCbk={null}
    backIcon={'cross'}
    displayCharacterAvatar={false}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>
  <View style={globalStyles.spaceBetween}>
    <ScrollView>
    <View>
        <Text marginV-10 selectable>
            {APP_NAME} credits you $1000 of virtual cash to get started.
        </Text>
        <Text marginV-10 selectable>
            You can get $50 daily and $500 weekly as a reward, or you can double that by upgrading to Premium.
        </Text>
        <Text marginV-10 selectable>
            You can't deposit or withdraw your virtual cash balance. We will be airdropping tokens to users with most progress who connected their Solana wallets.
        </Text>
    </View>
    </ScrollView>
    <View>
    <Button
      onPress={() => {
        navigation.goBack();
      }}
      label='Okay'
    />
      <BottomPadding />
    </View>
    </View>
  </View>
  </>
  )
}

export { VirtualCashModalScreen };
