import React, { useEffect, useState } from 'react';
import { FlatList, Alert, Platform, StyleSheet, Image, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Purchases from 'react-native-purchases';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import LoaderScreen from  'react-native-ui-lib/loaderScreen';
import { Colors } from  'react-native-ui-lib/style';

import { HeaderSimple } from '../../components/header-simple';
import { globalStyles } from '../../theming/common.styles';
import PackageItem from './package-item.component';
import { restorePurchases } from '../../helpers/purchases.helper';
import { BottomPadding } from '../../components/bottom-padding.component';
import { 
  APP_NAME, CONTACT_EMAIL,
  PRIVACY_POLICY_URL, TOS_POLICY_URL
} from '../../constants';
import Divider from '../../components/divider.component';

import imgDouble from '../../../assets/images/double-money.png';
import imgHeart from '../../../assets/images/heart.png';
import imgTrend from '../../../assets/images/trend.png';
import imgIdea from '../../../assets/images/idea.png';

import { initUser } from '../../redux/slices/user.slice';

const BenefitItem = ({ imgObj, textTitle, textDescription }) => {
  return (
    <View style={[globalStyles.row, globalStyles.tappable]}>
      <View style={globalStyles.centerVertical}>
        <Image
          source={imgObj}
          style={[styles.benefitImage, globalStyles.centerVertical]}

        />
      </View>
      <View style={{flex: 1, flexDirection: 'column', paddingLeft: 20, flexGrow: 1}}>
        <Text style={{fontWeight: 'bold'}}>{textTitle}</Text>
        <Text>{textDescription}</Text>
      </View>
    </View>
  )
}

const PaywallScreen = ({ navigation }) => {
  // - State for all available package
  const [packages, setPackages] = useState([]);

  // - State for displaying an overlay view
  const [isPurchasing, setIsPurchasing] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // Get current available packages
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        const offeringId = user.userDetails?.id % 2 == 0 ? 'PREMIUM_SUB_B' : 'PREMIUM_SUB_A';
        if (offerings.all[offeringId].availablePackages.length !== 0) {
          setPackages(offerings.all[offeringId].availablePackages)
        }
      } catch (e) {
        Alert.alert('Error getting offers', e.message);
      }
    };

    getPackages();
  }, []);


  const header = () => {
    return (
      <>
      <Text style={globalStyles.heading}>
      { user.isPremium ? 'Welcome to the Club!' : 'Hi, future millionaire!' }
      </Text>
      <View style={globalStyles.column}>
        <BenefitItem
          imgObj={imgIdea}
          textTitle={'Join Smart People'}
          textDescription={'Exclusive access only for people like you'}
        />
        <Divider />
        <BenefitItem
          imgObj={imgHeart}
          textTitle={'Stand Out'}
          textDescription={'Show others you care about your future'}
        />
      </View>
      
      <Text style={globalStyles.heading}>
      { user.isPremium ? 'You belong here' : 'Join the Premium Club' }
      </Text>
      </>
    )
  }

  const footer = () => {
    const disclaimerIOS = `Payments will be charged to the user's Apple ID Account at confirmation of purchase in compliance with Apple's privacy policy. We recommend that you familiarize yourself with the terms of payment and Apple in-app subscriptions. If a purchase is made from our iOS app, the refund is only possible in compliance with the App Store policy.\
    ${APP_NAME} may offer a trial period. It is only possible to use the trial period once. Subscription payment begins after the end of your free trial period.\
    All subscription types are renewed automatically. You can cancel the renewal option in the App Store within at least 24 hours before the end of your free trial period or the current payment date. The cancellation comes into effect at the end of the current billing period. At the same time, you retain access to the subscription from the cancellation moment until the end of the current billing period.\
    Accounts may be charged for renewal up to 24 hours before the end of the current period.`;
    const disclaimerAndroid = `Financial transactions for subscriptions made in our Android app processed by a third-party service (Google Play) in compliance with their Terms of Service, privacy policy and any applicable payment terms, in particular the response on Google Play refunds. ${APP_NAME} is not responsible for the actions or omissions of any third-party payment processor. We recommend that you familiarize yourself with the terms of payment and Google Play in-app subscriptions. If a purchase is made from our Android app, the refund is only possible in compliance with Google Play policy. \
    ${APP_NAME} may offer a trial period. It is only possible to use the trial period once. Subscription payment begins after the end of your free trial period.\
    All subscription types are renewed automatically. You can cancel the renewal option in Google Play within at least 24 hours before the end of your free trial period or the current payment date. The cancellation comes into effect at the end of the current billing period. At the same time, you retain access to the subscription from the cancellation moment until the end of the current billing period.\
    The payment is made according to the payment method that is linked to the user's account in Google Play. The subscription is made according to Google Play Account choice, which does not necessarily conform with the Google Account used to log in to the application.`
  
    return (


      
      <View>

        <Text style={globalStyles.tappable}>If you need help, email us: <Text accessibilityRole='link' onPress={() => {Linking.openURL('mailto:' + CONTACT_EMAIL)}} style={globalStyles.textBold}>{CONTACT_EMAIL}</Text></Text>

        <Text style={globalStyles.heading}>Subscription terms</Text>
        <Text grey40>{ Platform.OS === 'ios' ? disclaimerIOS : Platform.OS === 'android' ? disclaimerAndroid : null }</Text>
        <View style={[globalStyles.row, globalStyles.spaceBetween, globalStyles.tappable]}>
          <Text> </Text>
          <Text accessibilityRole='link' appearance='hint' onPress={() => {Linking.openURL(TOS_POLICY_URL)}}>Terms of Service</Text>
          <Text accessibilityRole='link' appearance='hint' onPress={() => {Linking.openURL(PRIVACY_POLICY_URL)}}>Privacy Policy</Text>
          <Text> </Text>
        </View>
        <View style={globalStyles.center}>
          <Text
            accessibilityRole='link'
            appearance='hint'
            onPress={restorePurchases}
            >Restore purchases</Text>
        </View>
        <BottomPadding />
      </View>
    );
  };

  const packagesSpinner = (
    <LoaderScreen color={Colors.grey40} message={'Loading...'} messageStyle={{color: Colors.grey30}} />
  )

  const listEmptyMessage = (
    user.isPremium ? 
    <View style={globalStyles.roundBlob} bg-$backgroundElevated>
      <Text appearance='hint'>To change or cancel your Premium membership, visit the app store you used to buy the original subscription.</Text>
    </View>
    :
    packagesSpinner
  )

  return (
    <>
      <HeaderSimple
        title='Premium Club'
        enableGoBack={true}
        backIcon={'cross'}
        displayCharacterAvatar={true}
        isCharacterAvatarActionable={false}
      />
      <View style={globalStyles.standardContainerBottomless} bg-$backgroundDefault>
      <FlatList
        data={ user.isPremium || isPurchasing ? null : packages }
        renderItem={({ item }) => <PackageItem
          purchasePackage={item}
          setIsPurchasing={setIsPurchasing}
          isPurchasing={isPurchasing}
          />}
        keyExtractor={(item) => item.identifier}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={listEmptyMessage}
        showsVerticalScrollIndicator={false}
      />      
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  benefitImage: {
    width: 25,
    height: 25
  },

})

export default PaywallScreen;