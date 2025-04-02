import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice';
import errorReducer from './slices/error.slice';
import onboardingSlice from './slices/onboarding.slice';
import discoverInstrumentsSlice from './slices/discover-instruments.slice';
import discoverCollectionsSlice from './slices/discover-collections.slice';
import instrumentSlice from './slices/instrument.slice';
import leaderboardSlice from './slices/leaderboard.slice';
import transactionsSlice from './slices/transactions.slice';
import communityPortfolioSlice from './slices/community-portfolio.slice';
import pushSlice from './slices/push.slice';
import aiMessagesSlice from './slices/ai-messages.slice';
import aiConversationsSlice from './slices/ai-conversations.slice';

export default configureStore({
  reducer: {
      user: userReducer,
      error: errorReducer,
      onboarding: onboardingSlice,
      discoverInstruments: discoverInstrumentsSlice,
      discoverCollections: discoverCollectionsSlice,
      instrument: instrumentSlice,
      leaderboard: leaderboardSlice,
      transactions: transactionsSlice,
      communityPortfolio: communityPortfolioSlice,
      push: pushSlice,
      aiMessages: aiMessagesSlice,
      aiConversations: aiConversationsSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})
