import * as React from 'react';
import { ScrollView, Linking, StyleSheet } from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { Colors } from  'react-native-ui-lib/style';

import { HeaderSimple } from '../../components/header-simple';
import Divider from '../../components/divider.component';
import { globalStyles } from '../../theming/common.styles';

import { CONTACT_EMAIL } from '../../constants';

const ContactScreen = () => (
  <>
  <HeaderSimple
    title='Contact & Support'
    enableGoBack={true}
    displayCharacterAvatar={false}
  />
  <View bg-$backgroundDefault style={globalStyles.screenContainer}>
  <ScrollView>
    <View paddingV-10>
      <Text>For partnerships proposals, and support requests as a user, the best way to get in touch is by sending an email to <Text accessibilityRole='link' onPress={() => {Linking.openURL('mailto:' + CONTACT_EMAIL)}} style={globalStyles.textBold}>{CONTACT_EMAIL}</Text>.</Text>
    </View>
    <View paddingV-10>
      <Text>If you'd like to say thanks, the best way is by leaving a review on the app store.</Text>
    </View>
    <Button
    onPress={() => {Linking.openURL('mailto:' + CONTACT_EMAIL)}}
    label='Contact support'
    marginB-30
    outline
    />
  </ScrollView>
  </View>
  </>
)

export { ContactScreen };
