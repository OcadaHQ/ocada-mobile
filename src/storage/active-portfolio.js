import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACTIVE_PORTFOLIO_KEY } from '../constants';


export const getSavedActivePortfolio = async () => {  
    // todo: check schema {userId, portfolioId?
    const activePortfolioValue = await AsyncStorage.getItem(ACTIVE_PORTFOLIO_KEY);
    return activePortfolioValue != null ? JSON.parse(activePortfolioValue) : null;
}

export const saveActivePortfolio = async ( { userId, portfolioId } ) => {
    return await AsyncStorage.setItem(ACTIVE_PORTFOLIO_KEY, JSON.stringify({ userId, portfolioId }) );
}

export const clearActivePortfolio = async () => {
    return await AsyncStorage.removeItem(ACTIVE_PORTFOLIO_KEY)
}