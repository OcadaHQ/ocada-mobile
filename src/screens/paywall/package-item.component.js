import React from 'react';
import { Alert, StyleSheet, Platform } from 'react-native';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import { Colors } from  'react-native-ui-lib/style';

import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import { REVENUECAT_ENTITLEMENT_ID } from '../../constants';
import { globalStyles } from '../../theming/common.styles';


const PackageItem = ({ purchasePackage, setIsPurchasing, isPurchasing }) => {
  const {
    product: { title, description, priceString, introPrice },
  } = purchasePackage;

  const { identifier, packageType } = purchasePackage;

  const navigation = useNavigation();

  const onSelection = async () => {
    setIsPurchasing(true);

    try {
      const customerInfo = await Purchases.purchasePackage(purchasePackage);
      if (typeof customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID] !== 'undefined') {
        // Android does not display a message by default
        if(Platform.OS === 'android'){
          Alert.alert('Thanks for upgrading to Premium!');
        }
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Error purchasing package', e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

   return (
    <Card
      onPress={onSelection}
      padding-20
      bg-$backgroundElevated
      enableShadow={false}
      style={
        [globalStyles.tappable,
        packageType === 'ANNUAL' || packageType === 'LIFETIME' // highlight annual/lifetime
        // packageType === 'MONTHLY' // highlight monthly with a primary colored border
        ?
        styles.preferredOption : null
        ] }
      >
      <View style={globalStyles.row}>
        <View style={globalStyles.column}>
          <Text text50M>
            { packageType === 'MONTHLY' ? '1 month' : packageType === 'ANNUAL' ? '1 year' : packageType === 'LIFETIME' ? 'Upgrade to Premium' : null }
          </Text>
          <Text text70M>{priceString}<Text grey30>{ packageType === 'MONTHLY' ? '/month' : packageType === 'ANNUAL' ? '/year' : packageType === 'LIFETIME' ? ' one-time fee' : null }</Text></Text>
        </View>
        <View style={globalStyles.centerVertical}>
          <Text>
            { introPrice ? `🎁 Try for ${introPrice?.priceString}` :
            packageType === 'MONTHLY' ? '50% OFF' : packageType === 'ANNUAL' ? '50% OFF' : packageType === 'LIFETIME' ? 'Lifetime' : null }
          </Text>
        </View>
      </View>

    </Card>
  );
};

const styles = StyleSheet.create({
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    preferredOption: {
      borderWidth: 2,
      borderColor: Colors.$textPrimary
    }
  });

export default PackageItem;