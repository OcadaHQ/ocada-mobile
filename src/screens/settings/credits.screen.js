import * as React from 'react';
import { ScrollView, Linking, StyleSheet } from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import { Colors } from  'react-native-ui-lib/style';

import { HeaderSimple } from '../../components/header-simple';
import Divider from '../../components/divider.component';
import { globalStyles } from '../../theming/common.styles';
import { APP_NAME } from '../../constants';

const CreditsScreen = ({ navigation, title }) => (
  <>
  <HeaderSimple
    title='Credits'
    enableGoBack={true}
    displayCharacterAvatar={false}
  />
  <View bg-$backgroundDefault style={globalStyles.screenContainer}>
    <ScrollView>
    <Text style={globalStyles.heading}>Mission</Text>
    <View style={styles.sectionWrapper}>
      <Text>Leverage AI to simplify blockchain user experience.</Text>
    </View>
    <Divider />
    <View>
      <Text style={globalStyles.heading}>Artwork</Text>
      <Text>
        Some of the images used in {APP_NAME} are designed by Freepik and AomAm from Flaticon.
        Thanks for making great art available for illustrating this app.
      </Text>
      <View row spread paddingV-10>
      <Button
        onPress={() => Linking.openURL('https://www.flaticon.com/authors/freepik')}
        label='Visit Freepik'
        link={true}
        accessible
        accessibilityRole='link'
        
        />
      <Button
        onPress={() => Linking.openURL('https://www.flaticon.com/authors/aomam')}
        label='Visit AomAm'
        link={true}
        accessible
        accessibilityRole='link'
        />
    
        </View>
  </View>
  <Divider />
  <View style={styles.sectionWrapper}>
    <Text style={globalStyles.heading}>Special thanks</Text>
    <Text>All of the Ocada team who made this possible.</Text>
  </View>
  <Divider />
  <View style={styles.sectionWrapper}>
    <Text style={globalStyles.heading}>Very special thanks</Text>
    <Text style={globalStyles.italic}>You</Text>
  </View>
  </ScrollView>
  </View>
  </>
)

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingBottom: 20
  }
});

export { CreditsScreen };
