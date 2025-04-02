import * as React from 'react';
import { ScrollView, Image, StyleSheet, Linking } from 'react-native';

import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import Card from 'react-native-ui-lib/card';

import { HeaderSimple } from '../../components/header-simple';
import { BottomPadding } from '../../components/bottom-padding.component';
import Divider from '../../components/divider.component';
import { globalStyles } from '../../theming/common.styles';
import SocialButtonsRow from '../../components/social-buttons-row-component';

import { CONTACT_EMAIL } from '../../constants';

import imgBuyAssets from '../../../assets/images/cash-hand.png';
import imgCollectRewards from '../../../assets/images/money-gift.png';
import imgTakeProfit from '../../../assets/images/trend.png';
import imgAskAI from '../../../assets/images/idea.png';
import imgFeed from '../../../assets/images/speech-bubble.png';
import imgHeart from '../../../assets/images/heart.png';

const XPTrigger = ({ imgObj, triggerTitle, triggerAmount, triggerLimit }) => {
    return (
      <View row paddingV-20>
        <View centerV>
          <Image
            source={imgObj}
            style={[styles.triggerImage, globalStyles.centerVertical]}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', paddingLeft: 20, flexGrow: 1}}>
            <View style={[{flex: 1, flexGrow: 1}, globalStyles.centerVertical]}>
            <Text style={{fontWeight: 'bold'}}>{triggerTitle}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <Text>{triggerAmount}</Text>
                <Text grey30>{triggerLimit}</Text>
          </View>
        </View>
      </View>
    )
}

const XP101Screen = ({ navigation, route }) => {

  return (
  <>
  <HeaderSimple
    title='How to win'
    enableGoBack={true}
    backActionCbk={null}
    backIcon={'cross'}
    displayCharacterAvatar={false}
  />
  <View paddingH-20 bg-$backgroundDefault flex>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={globalStyles.heading}>
          Follow socials
      </Text>
      {/* <Text>
          To be eligible for Ocada AI Airdrop, you must follow our socials and connect a Solana account.
      </Text> */}
      <Card enableShadow={false} marginT-20 paddingV-20>
        <SocialButtonsRow />
      </Card>


      <Text style={globalStyles.heading}>
          How to get XP
      </Text>
      <Text>
          XP collected this week or season will get you higher on the leaderboard.
          {/* The higher you get, the more you win. */}
      </Text>
      <View column marginV-20>
        <XPTrigger
          imgObj={imgBuyAssets}
          triggerTitle='Buy tokens'
          triggerAmount='+500 XP'
          triggerLimit='up to 10 times/day'
        />
        <Divider />
        <XPTrigger
            imgObj={imgTakeProfit}
            triggerTitle='Sell and take profit'
            triggerAmount='+100 XP'
            triggerLimit='per $1 of profit'
            />
        <Divider />
        <XPTrigger
            imgObj={imgFeed}
            triggerTitle='Post in feed'
            triggerAmount='+200 XP'
            triggerLimit='per message'
            />
        <Divider />
        <XPTrigger
            imgObj={imgCollectRewards}
            triggerTitle='Collect rewards'
            triggerAmount='+100 XP'
            triggerLimit='per reward'
            />
        <Divider />
        <XPTrigger
            imgObj={imgAskAI}
            triggerTitle='Ask AI'
            triggerAmount='+200 XP'
            triggerLimit='per message'
            />
        <Divider />
        <XPTrigger
            imgObj={imgHeart}
            triggerTitle='Refer friends'
            triggerAmount='10%'
            triggerLimit='XP your referees earn'
            />
        </View>

        <Text>
            You receive +500 XP when you start playing, and +10,000 XP when you sign up with an invite code.
        </Text>
        <Text style={globalStyles.heading}>Referral program</Text>
        <Text>
          When your friends join using your invite code, you get 10% of the XP they earn. The XP you earn from referrals is unlimited. 
        </Text>

        <Text style={globalStyles.heading}>Prizes</Text>
        {/* <Text>
          Ocada users will be eligible for a USDC airdrop. Follow announcements on telegram for details. Only users with a linked Solana account (via Phantom or Solfalre) will be eligible for winnings.
        </Text> */}
        {/* <Text style={globalStyles.heading}>Changes</Text> */}
        {/* <Text>
            Join our telegram group for up-to-date changes to the rules, announcements and more rewards.
        </Text> */}
        <Text style={globalStyles.heading}>Ideas or feedback?</Text>
        <Text>Send an email to <Text accessibilityRole='link' onPress={() => {Linking.openURL('mailto:' + CONTACT_EMAIL)}} style={globalStyles.textBold}>{CONTACT_EMAIL}</Text> if you'd like to share feedback or ideas.</Text>
        <View paddingT-20></View>
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
  </>
  )
}

const styles = StyleSheet.create({
    triggerImage: {
      width: 25,
      height: 25
    },
  
  })

export { XP101Screen };
