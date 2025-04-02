import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const initialState = {
    req: {
        q: '',
        skip: 0,
        limit: 100,
    },
    collections: [],
    isFetching: false,
    isRefreshing: false,
};

export const loadMore = createAsyncThunk(
    'discoverCollections/loadMore',
    async (params,  { getState, rejectWithValue }) => {
        
        const { discoverCollections } = getState();
       
        // if(!discover.isFetching)
        //     return rejectWithValue({});

        try {
            const response = await api.getCollections({
                q: discoverCollections.req.q,
                skip: discoverCollections.req.skip,
                limit: discoverCollections.req.limit
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
    'discoverCollections/refresh',
    async (params,  { getState, rejectWithValue }) => {
        
        const { discoverCollections } = getState();
        
        try {
            const response = await api.getCollections({
                q: discoverCollections.req.q,
                skip: 0,
                limit: discoverCollections.req.limit,
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

export const discoverCollectionsSlice = createSlice({
    name: 'discoverCollections',
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
                collections: [...state.collections, ...action.payload],
                req: {
                    ...state.req,
                    // skip: state.req.skip + state.req.limit
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
                collections: action.payload,
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
    }
})
  

export const { reset, setSearchTerm } = discoverCollectionsSlice.actions

export default discoverCollectionsSlice.reducer