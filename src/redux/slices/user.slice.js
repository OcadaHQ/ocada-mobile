import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import Purchases from 'react-native-purchases';
import { api } from '../../api/api';
import { saveUserToken, getUserToken, deleteUserToken } from '../../storage/credentials';
import { getSavedActivePortfolio, saveActivePortfolio, clearActivePortfolio } from '../../storage/active-portfolio';
import { registerPushToken, disablePushToken } from './push.slice';
import { refreshUnseenBadge } from './ai-conversations.slice';

const holdingsInitialState = {
    req: {
        skip: 0,
        limit: 100,
    },
    data: [],
    isFetching: false,
    isRefreshing: false,
};

const initialState = {
  isInitialised: false,     // run once on app init, true if completed
  isAuthenticated: false,   // 
  isPremium: null,          // isPremium=true unlocks certain benefits, null and False are considered not premium
  mode: "guest",            // guest, onboarding, regular
  onboardingBackRef: null,  // back ref when onboarding is closed
  userDetails: null,        // user details from API
  isCharacterPopoverVisible: false, // character popover that appears on avatar tap

  // the details of the active portfolio are loaded separately
  activePortfolio: {
    isInitFinished: false, // runs once for authenticated users
    data: null,             // the details of an active portfolio/character
    holdings: { ...holdingsInitialState }, // the holdings of the active portfolio
  },
};

export const createAnonymousUser = createAsyncThunk(
  'user/createAnonymousUser',
  async (params,  { dispatch, rejectWithValue }) => {
     try {
      const response = await api.createAnonymousUser();
      const token = response.data.access_token
      api.setToken(token);
      // dispatch(registerPushToken());
      await saveUserToken(token);
      return response.data
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const loginWithExternalAccount = createAsyncThunk(
  'user/loginWithExternalAccount',
  async ( { provider, token },  { rejectWithValue }) => {
    try {
      const response = await api.loginWithExternalAccount( { provider: provider, token: token } );
      const ocadaToken = response.data.access_token
      api.setToken(ocadaToken);
      await saveUserToken(ocadaToken);
      return response.data
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const loginWithSolana = createAsyncThunk(
  'user/loginWithSolana',
  async ( { publicKey, signedMessage, signature },  { rejectWithValue }) => {
    try {
      const response = await api.loginWithSolana( { publicKey, signedMessage, signature } );
      const ocadaToken = response.data.access_token
      api.setToken(ocadaToken);
      await saveUserToken(ocadaToken);
      return response.data
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'user/refreshAccessToken',
  async ( { token },  { rejectWithValue, dispatch }) => {
    try {
      const response = await api.refreshAccessToken(
      {
        token: token,
        lastSeenPlatform: Platform.OS,
        lastSeenAppVersion: Application.nativeApplicationVersion ?? null,
      } );
      const snipsToken = response.data.access_token
      api.setToken(snipsToken);
      await saveUserToken(snipsToken);
      // dispatch(registerPushToken());
      dispatch(refreshUnseenBadge());      
      return response.data
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);


export const initUser = createAsyncThunk(
  'user/init',
  async (params,  { rejectWithValue, dispatch }) => {
    // load user details
    try {
      const token = await getUserToken();
      if (token) {
        api.setToken(token);
        const userDetails = await api.getMe();
        dispatch(refreshAccessToken({ token: token }));
        return userDetails.data
      }
      return rejectWithValue(null);
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const setExperience = createAsyncThunk(
  'user/setExperience',
  async ({ hasExperience },  { rejectWithValue }) => {
    try {
      const response = await api.setExperience( hasExperience );
      return response.data
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (params,  { rejectWithValue, dispatch }) => {
    try {
      dispatch(disablePushToken()).unwrap();
      await deleteUserToken();
      api.setToken(null);
      Purchases.logOut().catch(()=>{});
      return null
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const refreshActivePortfolio = createAsyncThunk(
  'user/refreshActivePortfolio',
  async (params,  { getState, rejectWithValue }) => {
    try {

      const { user } = getState();

      if(!user.isInitialised || !user.isAuthenticated || !user.userDetails)
      return rejectWithValue({
        error: 'User not initialised'
      })

      const activePortfolioDetails = await getSavedActivePortfolio();
      if(activePortfolioDetails !== null) {
        if(user.userDetails.id === activePortfolioDetails.userId) { // saved portfolio belongs to the right user
          const portfolio = await api.getPortfolio( { portfolioId: activePortfolioDetails.portfolioId } );
          const holdings = await api.getPortfolioHoldings({
            portfolioId: activePortfolioDetails.portfolioId,
            skip: 0,
            limit: user.activePortfolio?.holdings?.req?.limit,
          });
          return {
            portfolio: portfolio.data,
            holdings: holdings.data,
          }
        }
      }
      
      // no saved portfolio or saved portfolio belongs to a different user
      const portfolios = await api.getPortfolios({ skip: 0, limit: 1 });
      if(portfolios.data.length > 0) {
        await saveActivePortfolio( { userId: user.userDetails.id, portfolioId: portfolios.data[0].id } );
        const holdings = await api.getPortfolioHoldings({
          portfolioId: portfolios.data[0].id,
          skip: 0,
          limit: user.activePortfolio?.holdings?.req?.limit,
        });
        return {
          portfolio: portfolios.data[0],
          holdings: holdings.data,
        }
      }else{ // list of portfolios is empty
        await clearActivePortfolio();
        return {
          portfolio: null,
          holdings: [],
        }
      }

    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const refreshActivePortfolioSummary = createAsyncThunk(
  'user/refreshActivePortfolioSummary',
  async (params,  { getState, rejectWithValue }) => {
    try {

      const { user } = getState();

      if(!user.isInitialised || !user.isAuthenticated || !user.userDetails)
      return rejectWithValue({
        error: 'User not initialised'
      })

      const activePortfolioDetails = await getSavedActivePortfolio();
      if(activePortfolioDetails !== null) {
        if(user.userDetails.id === activePortfolioDetails.userId) { // saved portfolio belongs to the right user
          const portfolio = await api.getPortfolio( {portfolioId: activePortfolioDetails.portfolioId } );
          return portfolio.data
        }
      }
      
      // no saved portfolio or saved portfolio belongs to a different user
      const portfolios = await api.getPortfolios({ skip: 0, limit: 1 });
      if(portfolios.data.length > 0) {
        return portfolios.data[0]
      }else{ // list of portfolios is empty
        await clearActivePortfolio();
        return null
      }

    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const claimPortfolioReward = createAsyncThunk(
  'user/claimPortfolioReward',
  async ( { claimType, revCatApiKey },  { getState, rejectWithValue }) => {

    const { user } = getState();

    // reject if user is already authenticated
    try {
      const response = await api.claimPortfolioReward({
        portfolioId: user.activePortfolio?.data?.id,
        claimType: claimType,
        revCatApiKey: revCatApiKey
      });
      return response.data;
    } catch (err) {
      
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue({
        data: error.response.data,
        status: error.response.status
      })
    }
  }
);



export const connectExternalAccount = createAsyncThunk(
  'user/connectExternalAccount',
  async ( { provider, token },  { rejectWithValue }) => {
    // reject if user is already authenticated
    try {
      const connectAccountResponse = await api.connectExternalAccount({ provider: provider, token: token });
      const user = await api.getMe();
      return {
        user: user.data,
        detail: connectAccountResponse.data
      }
    } catch (err) {
      
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue({
        data: error.response.data,
        status: error.response.status
      })
    }
  }
);

export const connectSolana = createAsyncThunk(
  'user/connectSolana',
  async ( { publicKey, signedMessage, signature },  { rejectWithValue }) => {
    // reject if user is already authenticated
    try {
      const connectAccountResponse = await api.connectSolana({ publicKey, signedMessage, signature });
      const user = await api.getMe();
      return {
        user: user.data,
        detail: connectAccountResponse.data
      }
    } catch (err) {
      
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue({
        data: error.response.data,
        status: error.response.status
      })
    }
  }
);

export const disconnectExternalAccount = createAsyncThunk(
  'user/disconnectExternalAccount',
  async ({ provider },  { rejectWithValue }) => {
    try {
      const disconnectAccountResponse = await api.disconnectExternalAccount({ provider: provider });
      const user = await api.getMe();
      return {
        user: user.data,
        detail: disconnectAccountResponse.data
      }
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (params,  { rejectWithValue }) => {
    try {
      const deleteUserAccountResponse = await api.deleteAccount();
      return {
        detail: deleteUserAccountResponse.data
      }
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);


export const refreshActiveHoldingByKey = createAsyncThunk(
  'user/refreshActiveHoldingByKey',
  async ({ activeHoldingKey },  { getState, rejectWithValue }) => {
    
    const { user } = getState();

    try {
      const instrumentId = user.activePortfolio?.holdings?.data[activeHoldingKey]?.instrument_id

      if(!instrumentId)
        throw new Error('No active holding key')

      const response = await api.getPortfolioHolding({
          portfolioId: user.activePortfolio?.data?.id,
          instrumentId: instrumentId
        });
              
      return response.data;
    }
    catch(err){
      rejectWithValue({
          'errorCode': '',
          'errorDetails': '',
      })
    }
}
);
    

export const loadMoreHoldings = createAsyncThunk(
  'user/loadMoreHoldings',
  async (params,  { getState, rejectWithValue }) => {
    
      const { user } = getState();
      
      try {
        if(!user.activePortfolio?.data?.id)
          return []

        const response = await api.getPortfolioHoldings({
            portfolioId: user.activePortfolio?.data?.id,
            skip: user.activePortfolio?.holdings?.req?.skip,
            limit: user.activePortfolio?.holdings?.req?.limit,
          });
                
        return response.data;
      }
      catch(err){
        rejectWithValue({
            'errorCode': '',
            'errorDetails': '',
        })
      }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    beginOnboarding: (state, action) => {
      return {
        ...state,
        isOnboarding: true,
        mode: "onboarding",
        onboardingBackRef: action.payload.backRef
      }
    },
    setCharacterPopoverVisible: (state, action) => {
      return {
        ...state,
        isCharacterPopoverVisible: action.payload
      }
    },
    setPremium: (state, action) => {
      return {
        ...state,
        isPremium: action.payload
      }
    },
    setUserDetails: (state, action) => {
      return {
        ...state,
        userDetails: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder

    // createAnonymousUser
    .addCase(createAnonymousUser.fulfilled, (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        userDetails: action.payload.user,
      }
    })
    .addCase(createAnonymousUser.rejected, (state, action) => {
      return state;
    })

    // loginWithExternalAccount
    .addCase(loginWithExternalAccount.fulfilled, (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        mode: "regular",
        isOnboarding: false,
        userDetails: action.payload.user,
      }
    })
    .addCase(loginWithExternalAccount.rejected, (state, action) => {
      return state;
    })

    // loginWithSolana
    .addCase(loginWithSolana.fulfilled, (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        mode: "regular",
        isOnboarding: false,
        userDetails: action.payload.user,
      }
    })
    .addCase(loginWithSolana.rejected, (state, action) => {
      return state;
    })

    // initUser
    .addCase(initUser.fulfilled, (state, action) => {
      return {
        ...state,
        isInitialised: true,
        isAuthenticated: true,
        mode: "regular",
        isOnboarding: false,
        userDetails: action.payload,
      }
    })
    .addCase(initUser.rejected, (state, action) => {
      return {
        ...state,
        isInitialised: true,
      }
    })

    // logout
    .addCase(logout.fulfilled, (state, action) => {
      return initialState
    })
    .addCase(logout.rejected, (state, action) => {
      return state;
    })

    // connect apple/google account
    .addCase(connectExternalAccount.fulfilled, (state, action) => {
      return {
        ...state,
        userDetails: action.payload.user,
      }
    })
    .addCase(connectExternalAccount.rejected, (state, action) => {
      return state;
    })

    // connect solana account
    .addCase(connectSolana.fulfilled, (state, action) => {
      return {
        ...state,
        userDetails: action.payload.user,
      }
    })
    .addCase(connectSolana.rejected, (state, action) => {
      return state;
    })

    // disconnect any external account
    .addCase(disconnectExternalAccount.fulfilled, (state, action) => {
      return {
        ...state,
        userDetails: action.payload.user,
      }
    })
    .addCase(disconnectExternalAccount.rejected, (state, action) => {
      return state;
    })

    // deleteAccount
    .addCase(deleteAccount.fulfilled, (state, action) => {
      return state;
    })
    .addCase(deleteAccount.rejected, (state, action) => {
      return state;
    })

    .addCase(refreshActivePortfolio.fulfilled, (state, action) => {
      return {
        ...state,
        activePortfolio: {
          ...state.activePortfolio,
          isInitFinished: true,
          data: action.payload.portfolio,
          holdings: {
            ...state.activePortfolio.holdings,
            req: {...holdingsInitialState.req},
            data: action.payload.holdings,
          }
        },
      }
    })
    .addCase(refreshActivePortfolio.rejected, (state, action) => {
      return state;
    })
    .addCase(refreshActiveHoldingByKey.fulfilled, (state, action) => {
      const { activeHoldingKey } = action.meta.arg
      if(state.activePortfolio.holdings.data[activeHoldingKey]?.instrument_id){
        state.activePortfolio.holdings.data[activeHoldingKey] = { ...action.payload }
      }
      return state;
    })
    .addCase(refreshActiveHoldingByKey.rejected, (state, action) => {
      return state;
    })
    
    // refreshActivePortfolioSummary
    .addCase(refreshActivePortfolioSummary.fulfilled, (state, action) => {
      return {
        ...state,
        activePortfolio: {
          ...state.activePortfolio,
          isInitFinished: true,
          data: action.payload,
        },
      }
    })
    .addCase(refreshActivePortfolioSummary.rejected, (state, action) => {
      return state;
    })
    // loadMoreHoldings
    .addCase(loadMoreHoldings.pending, (state, action) => {
      return {
          ...state,
          activePortfolio: {
            ...state.activePortfolio,
            holdings: {
              ...state.activePortfolio.holdings,
              isFetching: true,
              req: {
                  ...state.activePortfolio.holdings.req,
                  skip: state.activePortfolio.holdings.req.skip + state.activePortfolio.holdings.req.limit,
              }
            }
          }
        }
    })
    .addCase(loadMoreHoldings.fulfilled, (state, action) => {
      return {
        ...state,
        activePortfolio: {
          ...state.activePortfolio,
          holdings: {
            ...state.activePortfolio.holdings,
            isFetching: false,
            data: [...state.activePortfolio.holdings.data, ...action.payload],
          }
        }
      }
    })
    .addCase(loadMoreHoldings.rejected, (state, action) => {
      return {
        ...state,
        activePortfolio: {
          ...state.activePortfolio,
          holdings: {
            ...state.activePortfolio.holdings,
            isFetching: false,
          }
        }
      }
    })
  }
})

// Action creators are generated for each case reducer function
export const { beginOnboarding, logoutUser, setCharacterPopoverVisible, setUserDetails, setPremium } = userSlice.actions

export default userSlice.reducer