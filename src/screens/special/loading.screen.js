import * as React from 'react';
import { Linking } from 'react-native';

import View from  'react-native-ui-lib/view';
import Button from  'react-native-ui-lib/button';
import LoaderScreen from 'react-native-ui-lib/loaderScreen';
import ConnectionStatusBar from 'react-native-ui-lib/connectionStatusBar';
import { Colors } from  'react-native-ui-lib/style';


import * as Application from 'expo-application';

import { CONTACT_EMAIL } from '../../constants';

import { globalStyles } from '../../theming/common.styles';

const LoadingScreen = () => {

  const appVersion = Application.nativeApplicationVersion ?? 'UNKNOWN';
  const buildVersion = Application.nativeBuildVersion ?? 'UNKNOWN';

  const subjectLine = encodeURI(`App stuck at loading screen: version ${appVersion} (build ${buildVersion})`)

  return (
  <>
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>
  <ConnectionStatusBar label='No Internet connection' />
    <View style={globalStyles.spaceBetween}>
    <View></View>
    <LoaderScreen color={Colors.$textNeutral} message={'Loading...'} messageStyle={{color: Colors.$textNeutral}} />
    <View>
    <Button
      link
      onPress={() => Linking.openURL( `mailto:${CONTACT_EMAIL}?subject=${subjectLine}` )}
      linkColor={Colors.$textNeutral}
      label='Taking too long to load?'
      />
    </View>
  </View>
  </View>
  </>
  )
};

export { LoadingScreen };
