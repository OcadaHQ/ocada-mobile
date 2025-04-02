import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const initialState = {
    req: {
        q: '',
        skip: 0,
        limit: 100,
        collectionId: null
    },
    instruments: [],
    isFetching: false,
    isRefreshing: false,
};

export const loadMore = createAsyncThunk(
    'discoverInstruments/loadMore',
    async (params,  { getState, rejectWithValue }) => {
        
        const { discoverInstruments } = getState();
       
        // if(!discover.isFetching)
        //     return rejectWithValue({});

        try {
            const response = await api.getInstruments({
                q: discoverInstruments.req.q,
                skip: discoverInstruments.req.skip,
                limit: discoverInstruments.req.limit,
                sort: 'name_asc',
                collectionId: discoverInstruments.req.collectionId ?? null
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
    'discoverInstruments/refresh',
    async (params,  { getState, rejectWithValue }) => {
        
        const { discoverInstruments } = getState();
        
        try {
            const response = await api.getInstruments({
                q: discoverInstruments.req.q,
                skip: 0,
                limit: discoverInstruments.req.limit,
                sort: 'name_asc',
                collectionId: discoverInstruments.req.collectionId ?? null
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

export const discoverInstrumentsSlice = createSlice({
    name: 'discoverInstruments',
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
        setCollectionId: (state, action) => {
            state.req.collectionId = action.payload
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
                instruments: [...state.instruments, ...action.payload],
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
                instruments: action.payload,
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
  

export const { reset, setSearchTerm, setCollectionId } = discoverInstrumentsSlice.actions

export default discoverInstrumentsSlice.reducer