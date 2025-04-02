import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, Linking, StyleSheet, Platform, Alert } from 'react-native';
import { onReviewDialogShouldAppear } from '../../helpers/store-review.helper';
import analytics from '@react-native-firebase/analytics';

import View from 'react-native-ui-lib/view';
import Card from 'react-native-ui-lib/card';
import Text from 'react-native-ui-lib/text';
import Button from 'react-native-ui-lib/button';
import FloatingButton from 'react-native-ui-lib/floatingButton'
import { Colors } from 'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import Purchases from 'react-native-purchases';

import dayjs from 'dayjs';
import dayJsRelativeTime from 'dayjs/plugin/relativeTime';
import dayJsUTC from 'dayjs/plugin/utc';

import { HeaderSimple } from '../../components/header-simple';
import SocialButtonsRow from '../../components/social-buttons-row-component';
import { globalStyles } from '../../theming/common.styles';
import { 
  REWARD_ELIGIBILITY_HOURS_INTRADAY, REWARD_ELIGIBILITY_HOURS_DAILY, REWARD_ELIGIBILITY_HOURS_WEEKLY,
  REWARD_AMOUNT_INTRADAY, REWARD_AMOUNT_DAILY, REWARD_AMOUNT_WEEKLY,
} from '../../constants';
import { api } from '../../api/api';
import { refreshActivePortfolio } from '../../redux/slices/user.slice';
import { navigate } from '../../navigators/navigation';
import { restorePurchases, getRevCatPublicApiKey } from '../../helpers/purchases.helper';
import { isDateEligibleForIntradayReward, isDateEligibleForDailyReward, isDateEligibleForWeeklyReward, getRewardEligibilityDate  } from '../../helpers/rewards-eligibility.util'

// SocialButtonsRow

dayjs.extend(dayJsRelativeTime);
dayjs.extend(dayJsUTC);

const IconPremium = () => (
  <Ionicons name="checkmark-circle-sharp" size={20} color={Colors.$backgroundDefault} style={{marginRight: 10}} />
);

const IconGift = () => (
  <Ionicons name="gift-outline" size={20} color={Colors.$backgroundDefault} style={{marginRight: 10}} />
)

const DailyChallengeScreen = ({ navigation, title }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch()

  const intradayRewardEligibilityDate = getRewardEligibilityDate( user.activePortfolio?.data?.date_last_claimed_intraday_reward, REWARD_ELIGIBILITY_HOURS_INTRADAY );
  const dailyRewardEligibilityDate = getRewardEligibilityDate( user.activePortfolio?.data?.date_last_claimed_daily_reward, REWARD_ELIGIBILITY_HOURS_DAILY );
  const weeklyRewardEligibilityDate = getRewardEligibilityDate( user.activePortfolio?.data?.date_last_claimed_weekly_reward, REWARD_ELIGIBILITY_HOURS_WEEKLY );
  const isEligibleForIntradayReward = isDateEligibleForIntradayReward( user.activePortfolio?.data?.date_last_claimed_intraday_reward);
  const isEligibleForDailyReward = isDateEligibleForDailyReward( user.activePortfolio?.data?.date_last_claimed_daily_reward );
  const isEligibleForWeeklyReward = isDateEligibleForWeeklyReward( user.activePortfolio?.data?.date_last_claimed_weekly_reward );

  const bonusAmountDaily = user.isPremium ? '100' : '100';
  const bonusAmountWeekly = user.isPremium ? '1000' : '1000';

  const onPressClaimPortfolioReward = async ({ rewardType }) => {
    const revCatApiKey = getRevCatPublicApiKey();
    await api.claimAllRewards({
      portfolioId: user.activePortfolio?.data?.id,
      revCatApiKey: revCatApiKey
    }).then( result => {
      console.log(result);
      dispatch(refreshActivePortfolio())
      Alert.alert("Thank you", `You have claimed $${result?.data?.total_claimed} and earned ${result?.data?.xp_earned} XP.`)
      navigation.goBack();
      // console.log(result?.data?.total_claimed, result?.data?.xp_earned);
    })
    .catch( err => {
      Alert.alert("There was an error claiming rewards.")
      navigation.goBack();
    })
    // dispatch(claimPortfolioReward({ claimType: rewardType, revCatApiKey: revCatApiKey }))

    onReviewDialogShouldAppear();
  }


  const collectAllRewardsButton = (
    <Button
      onPress={() => claimAllRewards()}
      iconSource={IconGift}
      label='Collect all rewards'
    />
  )

  const dailyRewardButton = (
    <View>
    {
      isEligibleForDailyReward ? 
      (
        <Button
          onPress={() => claimPortfolioRewardPremium({rewardType: 'REWARD_DAILY'})}
          iconSource={IconGift}
          label='Claim reward'
          />
      )
      : 
      (
        <View>
          <Button
            iconSource={IconGift}
            disabled={true}
            label='Wait to claim reward'
          />
          <Text style={styles.tip}>
            Come back again {dayjs.utc().to(intradayRewardEligibilityDate)} to claim the reward
          </Text>
        </View>
      )
    
    }
    </View>
  )

  const weeklyRewardButton= (
    <View>
      {
        isEligibleForWeeklyReward ?
          ( 
            <Button
            onPress={() => claimPortfolioRewardPremium({rewardType: 'REWARD_WEEKLY'})}
              iconSource={IconGift}
              label='Claim reward'
              />
          )
          :
          (
          <View>
              <Button
                iconSource={IconGift}
                disabled={true}
                label='Wait to claim reward'
              />
              <Text style={styles.tip}>
                Come back again {dayjs.utc().to(weeklyRewardEligibilityDate)} to claim the reward
              </Text>
            </View>
          )
      }
    </View>
    )

  return (
      <>
      <HeaderSimple
        title='Rewards'
        enableGoBack={true}
        backActionCbk={null}
        backIcon={'cross'}
        displayCharacterAvatar={true}
        isCharacterAvatarActionable={false}
      />
      <View style={globalStyles.standardContainer} bg-$backgroundDefault>
        
        <ScrollView showsVerticalScrollIndicator={false}>


        {/* Intraday reward */}
        <Card enableShadow={false} bg-$backgroundElevated style={globalStyles.roundBlob} row marginV-10>
          <View centerV paddingR-20>
          { isEligibleForIntradayReward ?
          <Ionicons name='checkmark-circle-outline' size={25} color={Colors.$textSuccess}/>
          :
          <Ionicons name='time-outline' size={25} color={Colors.$textNeutral}/>
          }
          </View>
          <View>
            <Text text70>Boost reward: ${REWARD_AMOUNT_INTRADAY}</Text>
            { isEligibleForIntradayReward ?
            <Text style={{color: Colors.$textNeutral}}>Ready to collect now</Text> :
            <Text>Come back again {dayjs.utc().to(intradayRewardEligibilityDate)} to claim the reward</Text>
            }
          </View>
        </Card>

        {/* Daily reward */}
        <Card enableShadow={false} bg-$backgroundElevated style={globalStyles.roundBlob} row marginV-10>
          <View centerV paddingR-20>
          { isEligibleForDailyReward ?
          <Ionicons name='checkmark-circle-outline' size={25} color={Colors.$textSuccess}/>
          :
          <Ionicons name='time-outline' size={25} color={Colors.$textNeutral}/>
          }
          </View>
          <View>
          <Text text70>Daily reward: ${REWARD_AMOUNT_DAILY}</Text>
            { isEligibleForDailyReward ?
            <Text style={{color: Colors.$textNeutral}}>Ready to collect now</Text> :
            <Text>Come back again {dayjs.utc().to(dailyRewardEligibilityDate)} to claim the reward</Text>
            }
          </View>
        </Card>

        {/* Weekly reward */}
        <Card enableShadow={false} bg-$backgroundElevated style={globalStyles.roundBlob} row marginV-10>
          <View centerV paddingR-20>
          { isEligibleForWeeklyReward ?
          <Ionicons name='checkmark-circle-outline' size={25} color={Colors.$textSuccess}/>
          :
          <Ionicons name='time-outline' size={25} color={Colors.$textNeutral}/>
          }
          </View>
          <View>
          <Text text70>Weekly reward: ${REWARD_AMOUNT_WEEKLY}</Text>
            { isEligibleForWeeklyReward ?
            <Text style={{color: Colors.$textNeutral}}>Ready to collect now</Text> :
            <Text>Come back again {dayjs.utc().to(weeklyRewardEligibilityDate)} to claim the reward</Text>
            }
          </View>
        </Card>


      </ScrollView>
      <FloatingButton
        accessible
        accessibilityRole='button'
        accessibilityHint='Tap to collect rewards'
        visible={true}
        hideBackgroundOverlay={true}
        bottomMargin={25}
        button={{
          label: 'Collect all rewards',
          onPress: onPressClaimPortfolioReward,
          iconSource: IconGift,
          size: 'large',
          backgroundColor: Colors.$ocadaCoral,
        }}
      />
      </View>
      </>
  )
}

const styles =  StyleSheet.create({
  tip: {
    marginTop: 15
  }
});

export { DailyChallengeScreen };
