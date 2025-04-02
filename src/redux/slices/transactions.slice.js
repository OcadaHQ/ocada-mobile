import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const initialState = {
    req: {
        skip: 0,
        limit: 100,
        filter: 'EXECUTED_TRADES',
        sort: 'DESC',
    },
    data: [],
    isFetching: false,
    isRefreshing: false,
};

export const loadMore = createAsyncThunk(
    'transactions/loadMore',
    async (params,  { getState, rejectWithValue }) => {
        const { transactions } = getState();

        try {
            const response = await api.getTransactions({
                skip: transactions.req.skip,
                limit: transactions.req.limit,
                filter: transactions.req.filter,
                sort: transactions.req.sort,
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
    'transactions/refresh',
    async (params,  { getState, rejectWithValue }) => {
        const { transactions } = getState();
        
        try {
            const response = await api.getTransactions({
                skip: 0,
                limit: transactions.req.limit,
                filter: transactions.req.filter,
                sort: transactions.req.sort,
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

export const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        reset: (state, action) => {
            return {
                ...initialState,
            }
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
                data: action.payload,
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
  

export const { reset } = transactionsSlice.actions

export default transactionsSlice.reducer