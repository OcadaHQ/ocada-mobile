import { createSlice, createAsyncThunk, current, createAction } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const initialState = {
    req: {
        q: '', // will be used later
        skip: 0,
        limit: 100,
    },
    isUnseenBadgeDisplayed: false,
    data: [],
    isFetching: false, // are we fetching data right now
    hasFetched: false, // has an attempt to fetch already been made
};


export const refreshUnseenBadge = createAsyncThunk(
    'aiConversations/refreshUnseenBadge',
    async (params,  { getState, rejectWithValue }) => {        
        try {
            const response = await api.getConversationsStats();
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


export const loadMore = createAsyncThunk(
    'aiConversations/loadMore',
    async (params,  { getState, rejectWithValue }) => {
        
        const { aiConversations } = getState();
       
        try {
            const response = await api.getConversations({
                q: aiConversations.req.q,
                skip: aiConversations.req.skip,
                limit: aiConversations.req.limit,
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

export const refresh = createAsyncThunk(
    'aiConversations/refresh',
    async (params,  { getState, rejectWithValue }) => {
        const { aiConversations } = getState();
        
        try {
            const response = await api.getConversations({
                q: aiConversations.req.q,
                skip: 0,
                limit: aiConversations.req.limit
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

export const aiConversationsSlice = createSlice({
    name: 'aiConversations',
    initialState,
    reducers: {
        reset: (state, action) => {
            return initialState
        },
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
                data: [...state.data, ...action.payload],
                req: {
                    ...state.req,
                }
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
                data: action.payload,
                req: {
                    ...state.req,
                    skip: 0
                }
            }
        })
        .addCase(refresh.rejected, (state, action) => {
            return {
                ...state,
                isFetching: false,
                isRefreshing: false
            }
        })
        .addCase(refreshUnseenBadge.fulfilled, (state, action) => {
            return {
                ...state,
                isUnseenBadgeDisplayed: action.payload?.unseen > 0
            }
        })
        .addCase(refreshUnseenBadge.rejected, (state, action) => {
            return {
                ...state
            }
        })
    }
})
  

// export const { addMessage } = aiChatSlice.actions

export default aiConversationsSlice.reducer