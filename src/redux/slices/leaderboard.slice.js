import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const initialState = {
    req: {
        q: '',
        skip: 0,
        limit: 100,
    },
    mode: 'xp',
    portfolios: [],
    isFetching: false,
    isRefreshing: false,
};

export const loadMore = createAsyncThunk(
    'leaderboard/loadMore',
    async (params,  { getState, rejectWithValue }) => {
        
        const { leaderboard } = getState();

        try {
            const reqProps = {
                q: leaderboard.req.q,
                skip: leaderboard.req.skip,
                limit: leaderboard.req.limit
            };
            const response = leaderboard.mode === 'xp' ? await api.getUsersLeaderboard(reqProps) :  leaderboard.mode === 'gain' ? await api.getPortfoliosLeaderboard(reqProps) : null;
            
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

export const refresh = createAsyncThunk(
    'portfolios/refresh',
    async (params,  { getState, rejectWithValue }) => {
        
        const { leaderboard } = getState();
        
        try {
            const reqProps = {
                q: leaderboard.req.q,
                skip: 0,
                limit: leaderboard.req.limit
            };
            const response = leaderboard.mode === 'xp' ? await api.getUsersLeaderboard(reqProps) :  leaderboard.mode === 'gain' ? await api.getPortfoliosLeaderboard(reqProps) : null;
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

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        reset: (state, action) => {
            return {
                ...initialState,
            }
        },
        setSearchTerm: (state, action) => {
            state.req.q = action.payload
        },
        setSkip: (state, action) => {
            state.req.skip = action.payload
        },
        setMode: (state, action) => {
            state.mode = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        // load more
        .addCase(loadMore.pending, (state, action) => {
            return {
                ...state,
                isFetching: true,
                req: {
                    ...state.req,
                    skip: state.req.skip + state.req.limit,
                }
            }
        })
        .addCase(loadMore.fulfilled, (state, action) => {
            return {
                ...state,
                isFetching: false,
                portfolios: [...state.portfolios, ...action.payload],
                req: { ...state.req }
            }
        })
        .addCase(loadMore.rejected, (state, action) => {
            return {
                ...state,
                isFetching: false
            }
        })

        // refresh
        .addCase(refresh.pending, (state, action) => {
            return {
                ...state,
                isFetching: true,
                isRefreshing: true,
            }
        })
        .addCase(refresh.fulfilled, (state, action) => {
            return {
                ...state,
                isFetching: false,
                isRefreshing: false,
                portfolios: action.payload,
                req: { ...state.req, skip: 0 }
            }
        })
        .addCase(refresh.rejected, (state, action) => {
            return {
                ...state,
                isFetching: false,
                isRefreshing: false
            }
        })
    }
})
  

export const { reset, setSearchTerm, setMode } = leaderboardSlice.actions

export default leaderboardSlice.reducer