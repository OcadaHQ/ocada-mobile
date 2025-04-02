import * as React from 'react';
import { ScrollView, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';


import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import FloatingButton from 'react-native-ui-lib/floatingButton'
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import Svg, {
  Text as SvgText,
  Image as SvgImage,
} from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HeaderSimple } from '../../components/header-simple';
import { BottomPadding } from '../../components/bottom-padding.component';
import { globalStyles } from '../../theming/common.styles';
import { APP_NAME } from '../../constants';
import { formatGainLoss } from '../../helpers/helpers';

import imgLoss from '../../../assets/images/score-card/loss-template.png';
import imgProfit from '../../../assets/images/score-card/profit-template.png';
import { Colors } from 'react-native-ui-lib';

const sharingOptions = {
    "UTI": "public.image"
};

const iconShare = () => (
  <Ionicons name="share-outline" size={20} color={Colors.$backgroundDefault} style={{marginRight: 10}} />
)

const ScoreCardScreen = ({ navigation, route }) => {
    const ref = React.useRef();
    const user = useSelector(state => state.user);
    const { symbol, pnlPerc, pnlAbs } = route.params;

    // pnlPerc, pnlAbs, symbol

    const shareImage = async () => {
        try {
          const uri = await captureRef(ref, {
            format: 'png',
            quality: 0.7,
          });
          console.log('uri', uri);

          await Sharing.shareAsync(uri, sharingOptions);
        } catch (e) {
          console.log(e);
        }
      };

    React.useEffect(() => {
      // on mount
      ref.current.capture().then(uri => {
        // console.log("do something with ", uri);
      });
    }, []);
  
    return (
      <>
      <HeaderSimple
        title='Tell your friends'
        enableGoBack={true}
        backActionCbk={null}
        backIcon={'cross'}
        displayCharacterAvatar={false}
      />
      <View style={globalStyles.standardContainer} bg-$backgroundDefault>
      <ViewShot ref={ref} style={styles.cardContainer}>
        <Svg height="100%" width="100%" viewBox="0 0 600 700">
          <SvgImage x={0} y={0} href={pnlAbs >= 0 ? imgProfit : imgLoss} width={600} height={700}/>
          {/* ticker */}
          <SvgText x="550" y="200" textAnchor='end' style={styles.cardElementTicker}>{ '$' + symbol }</SvgText>

          {/* PnL % */}
          <SvgText x="550" y="300" textAnchor='end' style={[styles.cardPNLPerc, pnlAbs >= 0 ? styles.cardProfit : styles.cardLoss]}>{formatGainLoss(pnlPerc, false)}</SvgText>

          {/* PnL $$$ */}
          <SvgText x="550" y="350" textAnchor='end' style={[styles.cardPNLAbs, pnlAbs >= 0 ? styles.cardProfit : styles.cardLoss]}>{formatGainLoss(pnlAbs)}</SvgText>

          {/* Invite */}
          <SvgText x="584" y="690" textAnchor='end' style={styles.cardInvite}>{'Use invite code ' + user?.userDetails?.id + ' for a sign up bonus'}</SvgText>
        </Svg>
      </ViewShot>
      <Button
        label={'Save or share'}
        onPress={shareImage}
        marginT-20
        iconSource={iconShare}
      />
      </View> 
      </>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
      width: '100%',
      aspectRatio: 6/7
    },
    cardElementTicker: {
      stroke: '#fff',
      fill: '#fff',
      fontSize: 50,
      // fontFamily: 'Arial',

    },
    cardPNLPerc: {
      fontSize: 100,
      // fontFamily: 'Arial',
    },
    cardPNLAbs: {
      fontSize: 30,
      // fontFamily: 'Arial',
    },
    cardProfit: {
      stroke: '#0f0',
      fill: '#0f0'
    },
    cardLoss: {
      stroke: '#BA1212',
      fill: '#BA1212'
    },
    cardInvite: {
      stroke: '#ccc',
      fill: '#ccc',
      fontSize: 25,
      fontWeight: 500,
      // fontFamily: 'Arial',
    }
  });

export { ScoreCardScreen };
