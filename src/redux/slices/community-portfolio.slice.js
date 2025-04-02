import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const holdingsInitialState = {
    req: {
        skip: 0,
        limit: 100,
    },
    data: [],
    isFetching: false,
    isRefreshing: false,
};

// the details of the selected community portfolio 
const initialState = {
    isRefreshing: false, 
    data: null,             // the details of a portfolio
    holdings: { ...holdingsInitialState }, // the holdings of the selected portfolio
};

export const refreshCommunityPortfolio = createAsyncThunk(
    'community/refreshCommunityPortfolio',
    async (params,  { getState, rejectWithValue }) => {

        const { communityPortfolio } = getState();
        let portfolioId = params?.portfolioId;
        
        if(!portfolioId && !communityPortfolio.data?.id) {
            rejectWithValue(
                {
                    message: 'No instrument id provided',
                    detail: {}
                }
            );
            return
        }
        else if(!portfolioId) {
            portfolioId = communityPortfolio.data.id;
        }

        try {
            const portfolio = await api.getPortfolio( { portfolioId } );
            const holdings = await api.getPortfolioHoldings({
              portfolioId: portfolioId,
              skip: 0,
              limit: communityPortfolio?.holdings?.req?.limit,
            });

            return {
              portfolio: portfolio.data,
              holdings: holdings.data,
            }
        }
        catch(err){
            rejectWithValue({
                'errorCode': '',
                'errorDetails': '',
            })
        }
    }
);

export const refreshCommunityPortfolioSummary = createAsyncThunk(
    'community/refreshCommunityPortfolioSummary',
    async (params,  { getState, rejectWithValue }) => {

        const { communityPortfolio } = getState();
        let portfolioId = params?.portfolioId;
        
        if(!portfolioId && !communityPortfolio.data?.id) {
            rejectWithValue(
                {
                    message: 'No instrument id provided',
                    detail: {}
                }
            );
            return
        }
        else if(!portfolioId) {
            portfolioId = communityPortfolio.data.id;
        }


        try {
  
            const portfolio = await api.getPortfolio( {portfolioId } );
            return portfolio.data       
  
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


export const refreshCommunityHoldingByKey = createAsyncThunk(
    'community/refreshCommunityHoldingByKey',
    async ({ communityHoldingKey },  { getState, rejectWithValue }) => {
      
      const { communityPortfolio } = getState();
  
      try {
        const instrumentId = communityPortfolio?.holdings?.data[communityHoldingKey]?.instrument_id
  
        if(!instrumentId)
          throw new Error('No community holding key')
  
        const response = await api.getPortfolioHolding({
            portfolioId: communityPortfolio?.data?.id,
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

export const loadMoreCommunityHoldings = createAsyncThunk(
    'community/loadMoreCommunityHoldings',
    async (params,  { getState, rejectWithValue }) => {
      
        const { communityPortfolio } = getState();
        
        try {
          if(!communityPortfolio?.data?.id)
            return []
  
          const response = await api.getPortfolioHoldings({
              portfolioId: communityPortfolio?.data?.id,
              skip: communityPortfolio.holdings?.req?.skip,
              limit: communityPortfolio?.holdings?.req?.limit,
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

export const communityPortfolioSlice = createSlice({
    name: 'communityPortfolio',
    initialState,
    reducers: {
        resetPortfolio: (state, action) => {
            return initialState
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(refreshCommunityPortfolio.fulfilled, (state, action) => {
            return {
                ...state,
                isRefreshing: false,
                data: action.payload.portfolio,
                holdings: {
                    ...state.holdings,
                    req: {...holdingsInitialState.req},
                    data: action.payload.holdings,
                }
            }
        })
        .addCase(refreshCommunityPortfolio.rejected, (state, action) => {
            return state;
        })
        .addCase(refreshCommunityHoldingByKey.fulfilled, (state, action) => {
            const { communityHoldingKey } = action.meta.arg
            if(state.holdings.data[communityHoldingKey]?.instrument_id){
                state.holdings.data[communityHoldingKey] = { ...action.payload }
            }
            return state;
        })
        .addCase(refreshCommunityHoldingByKey.rejected, (state, action) => {
            return state;
        })
        .addCase(refreshCommunityPortfolioSummary.fulfilled, (state, action) => {
            return {
                ...state,
                data: action.payload,
                isRefreshing: false,
            }
        })
        .addCase(refreshCommunityPortfolioSummary.rejected, (state, action) => {
            return state;
        })
        .addCase(loadMoreCommunityHoldings.pending, (state, action) => {
            return {
                ...state,
                holdings: {
                    ...state.holdings,
                    isFetching: true,
                        req: {
                            ...state.holdings.req,
                            skip: state.holdings.req.skip + state.holdings.req.limit,
                        }
                    }
            }
        })
        .addCase(loadMoreCommunityHoldings.fulfilled, (state, action) => {
            return {
                ...state,
                holdings: {
                    ...state.holdings,
                    isFetching: false,
                    data: [...state.holdings.data, ...action.payload],
                }
            }
        })
        .addCase(loadMoreCommunityHoldings.rejected, (state, action) => {
            return {
                ...state,
                holdings: {
                    ...state.holdings,
                    isFetching: false,
                }
            }
        })
    }
})
  

export const { resetPortfolio } = communityPortfolioSlice.actions

export default communityPortfolioSlice.reducer