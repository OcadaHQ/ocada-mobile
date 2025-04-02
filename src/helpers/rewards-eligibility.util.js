import dayjs from 'dayjs';
import dayJsRelativeTime from 'dayjs/plugin/relativeTime';
import dayJsUTC from 'dayjs/plugin/utc';

import { REWARD_ELIGIBILITY_HOURS_DAILY, REWARD_ELIGIBILITY_HOURS_INTRADAY, REWARD_ELIGIBILITY_HOURS_WEEKLY } from '../constants';

dayjs.extend(dayJsRelativeTime);
dayjs.extend(dayJsUTC);

const getRewardEligibilityDate = ( dateToCheck, eligibilityHours ) => {
    return dateToCheck ? dayjs(dateToCheck).add(eligibilityHours, 'hour') : null;
}

const isDateEligibleForReward = ( dateToCheck, eligibilityHours) => {
    const rewardEligibilityDate = getRewardEligibilityDate( dateToCheck, eligibilityHours );
    return rewardEligibilityDate === null || dayjs.utc() > rewardEligibilityDate;
}

const isDateEligibleForIntradayReward = ( dateToCheck ) => {
    return isDateEligibleForReward( dateToCheck, REWARD_ELIGIBILITY_HOURS_INTRADAY ); 
}

const isDateEligibleForDailyReward = ( dateToCheck ) => {
    return isDateEligibleForReward( dateToCheck, REWARD_ELIGIBILITY_HOURS_DAILY ); 
}

const isDateEligibleForWeeklyReward = ( dateToCheck ) => {
    return isDateEligibleForReward( dateToCheck, REWARD_ELIGIBILITY_HOURS_WEEKLY ); 
}

const getNRewardsAvailableForPortfolio = ( lastIntradayDate, lastDailyDate, lastWeeklyDate ) => { 
    let nRewards = 0;

    if(isDateEligibleForIntradayReward( lastIntradayDate )){
        nRewards++;
    }

    if(isDateEligibleForDailyReward( lastDailyDate )){
        nRewards++;
    }

    if(isDateEligibleForWeeklyReward( lastWeeklyDate )){
        nRewards++;
    }

    return nRewards;
}

export { getRewardEligibilityDate, isDateEligibleForIntradayReward, isDateEligibleForDailyReward, isDateEligibleForWeeklyReward, getNRewardsAvailableForPortfolio }