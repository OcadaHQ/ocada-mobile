import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { LAST_REVIEW_KEY } from '../constants';

const currentAppVersion = Application.nativeApplicationVersion ?? 'UNKNOWN';

export const hasCurrentVersionPromptedReview = async() => {
    try {
        const lastReviewedVersion = await AsyncStorage.getItem(LAST_REVIEW_KEY);
        // console.log('get', lastReviewedVersion)
        return lastReviewedVersion === currentAppVersion;
    }
    catch(e){
        return false;
    }
}

export const updateAppReviewDetails = async () => {
    // console.log('set', currentAppVersion)
    return await AsyncStorage.setItem(LAST_REVIEW_KEY, currentAppVersion);
}

export const clearAppReviewDetails = async () => {
    return await AsyncStorage.removeItem(LAST_REVIEW_KEY)
}