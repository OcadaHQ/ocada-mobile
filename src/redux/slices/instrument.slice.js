import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/api';

const transactionInitialState = {
    type: null,
    transactionReq: {},
    transactionDetails: {},
};

const initialState = {
    data: null,
    insights: null,
    holding: null,
    transaction: { ...transactionInitialState },
    priceHistory: {
        data: [],
        lookbackOption: null,
    },
    isRefreshing: false,
    isFetching: false,
};

export const refreshInstrument = createAsyncThunk(
    'instrument/refresh',
    async (params,  { getState, rejectWithValue }) => {

        const { user, instrument } = getState();
        let instrumentId = params?.instrumentId;
        
        if(!instrumentId && !instrument.data?.id) {
            rejectWithValue(
                {
                    message: 'No instrument id provided',
                    detail: {}
                }
            );
            return
        }
        else if(!instrumentId) {
            instrumentId = instrument.data.id;
        }

        const findKPI = ( { kpiSummary, category, key, fiscal } ) => {
   
            if(!kpiSummary)
              return null;
                
            const data = kpiSummary.find(kpi => 
              kpi.category === category && kpi.kpi_key === key && kpi.fiscal === fiscal
              );
      
            return data?.kpi_value;
        }
        
        try {
            const instrumentResponse = await api.getInstrument({instrumentId: instrumentId,});
            const holdingResponse = await api.getPortfolioHolding({portfolioId: user.activePortfolio.data?.id, instrumentId: instrumentId,});
            
            return {
                data: instrumentResponse.data,
                insights: {
                    profitableYears: findKPI( {kpiSummary: instrumentResponse.data?.kpi_summary, category: 'EPS', key: 'PROFIT', fiscal: 'year'}),
                    profitableQuarters: findKPI( {kpiSummary: instrumentResponse.data?.kpi_summary, category: 'EPS', key: 'PROFIT', fiscal: 'quarter'}),
                    growthYears: findKPI( {kpiSummary: instrumentResponse.data?.kpi_summary, category: 'EPS', key: 'GROWTH', fiscal: 'year'}),
                    growthQuarters: findKPI( {kpiSummary: instrumentResponse.data?.kpi_summary, category: 'EPS', key: 'GROWTH', fiscal: 'quarter'})
                },
                holding: holdingResponse.data,
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

export const refreshPrice = createAsyncThunk(
    'instrument/refreshPrice',
    async (params,  { getState, rejectWithValue }) => {
        
        const { instrument } = getState();
        
        try {
            const response = await api.getInstrument({
                instrumentId: instrument.data.id,
                });
            return {
                price: response.data.kpi_latest_price.price
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

export const loadPriceHistory = createAsyncThunk(
    'instrument/loadPriceHistory',
    async ({ instrumentId, lookbackOption },  { getState, rejectWithValue }) => {


        let lookbackHours = 4;
        let barInterval = '5m';
        if(lookbackOption === '4HOUR'){
            lookbackHours = 4;
            barInterval = '5m'
        }
        else if(lookbackOption === '1DAY'){
            lookbackHours = 24;
            barInterval = '5m';
        }
        else if(lookbackOption === '1WEEK'){
            lookbackHours = 168; // 24 * 7
            barInterval = '1H';
        }
        else if(lookbackOption === '1MONTH'){
            lookbackHours = 720; // 24 * 30
            barInterval = '1D';
        }
        else if(lookbackOption === '3MONTH'){
            lookbackHours = 2160; // 24 * 30 * 3
            barInterval = '1D';
        }
        else if(lookbackOption === '6MONTH'){
            lookbackHours = 4320; // 24 * 30 * 6
            barInterval = '1D';

        }
        else if(lookbackOption === '1YEAR'){
            lookbackHours = 8640; // 24 * 30 * 12
            barInterval = '1D';
        }

        try {
            const response = await api.getInstrumentBars({
                instrumentId,
                lookbackHours,
                barInterval
                });

            const raw_points = response.data.map((bar) => ({
                date: bar.date_as_of,
                // x: index,
                value: bar.price_close
            }));
            return raw_points
        }
        catch(err){
            rejectWithValue({
                'errorCode': '',
                'errorDetails': '',
            })
        }
    }
);


export const instrumentSlice = createSlice({
    name: 'instrument',
    initialState,
    reducers: {
        resetInstrument: (state, action) => {
            return {
                ...initialState,
            }
        },
        resetTransaction: (state, action) => {
            return {
                ...state,
                transaction: { ...transactionInitialState },
            }
        },
        setTransactionType: (state, action) => {
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    type: action.payload.type,
                }
            }
        },
        setTransactionDetails: (state, action) => {
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    transactionDetails: action.payload,
                }
            }
        },
        resetTransactionReqDetails: (state, action) => {
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    transactionReq: {},
                    transactionDetails: {},
                }
            }
        },
        setHighlightedPriceIndex: (state, action) => {
            return {
                ...state,
                priceHistory: {
                    ...state.priceHistory,
                    highlightedPriceIndex: action.payload,
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
        // refresh instrument
        .addCase(refreshInstrument.pending, (state, action) => {
            return {
                ...state,
                isFetching: true,
            }
        })
        .addCase(refreshInstrument.fulfilled, (state, action) => {
            return {
                ...state,
                isFetching: false,
                data: action.payload.data,
                insights: action.payload.insights,
                holding: action.payload.holding,
            }
        })
        .addCase(refreshInstrument.rejected, (state, action) => {
            return {
                ...state,
                isFetching: false
            }
        })

        // refresh price
        .addCase(refreshPrice.fulfilled, (state, action) => {
            return {
                ...state,
                data: {
                    ...state.data,
                    price: action.payload.price,
                }
            }
        })
        .addCase(refreshPrice.rejected, (state, action) => {
            return {
                ...state,
            }
        })

        // load price history
        .addCase(loadPriceHistory.pending, (state, action) => {
            const { lookbackOption } = action.meta.arg;
            return {
                ...state,
                priceHistory: {
                    ...state.priceHistory,
                    lookbackOption: lookbackOption,
                }
            }
        })
        .addCase(loadPriceHistory.fulfilled, (state, action) => {
            return {
                ...state,
                priceHistory: {
                    ...state.priceHistory,
                    data: action.payload,
                }
            }
        })
        .addCase(loadPriceHistory.rejected, (state, action) => {
            return state;
        })
    }
})
  

export const { resetInstrument, resetTransaction, setTransactionType, setTransactionDetails, resetTransactionReqDetails, setHighlightedPriceIndex } = instrumentSlice.actions

export default instrumentSlice.reducer