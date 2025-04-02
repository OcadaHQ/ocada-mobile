import React from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Purchases from 'react-native-purchases';

import  store  from '../redux/store';
import { setPremium } from '../redux/slices/user.slice';
import {
  CONTACT_EMAIL, REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_PUBLIC_SDK_KEY_IOS,
  REVENUECAT_PUBLIC_SDK_KEY_ANDROID
} from '../constants';



export const validatePremium = ( entitlements ) => {
  return typeof entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID] !== "undefined";
};

export const restorePurchases = async () => {
  
  try {
      const { entitlements } = await Purchases.restorePurchases();
      console.debug(entitlements);
      const isPremium = validatePremium( entitlements );
      store.dispatch(setPremium(isPremium));
      Alert.alert(
        "Purchases restored",
        isPremium ? "Your Premium membership is now active" : `No Premium membership found for this account. Contact ${CONTACT_EMAIL} if you need help.`
      );
    } catch (e) {
      console.error(e)
      Alert.alert(
          "Error occurred",
          "We could not restore your purchases. Try again, and contact support if you need help"
      );
    }
}

export const getRevCatPublicApiKey = () => {
  if (Platform.OS === 'ios') {
    return REVENUECAT_PUBLIC_SDK_KEY_IOS;
  } else if (Platform.OS === 'android') {
    return REVENUECAT_PUBLIC_SDK_KEY_ANDROID;
  } else {
    return null
  }
}