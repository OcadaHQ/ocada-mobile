import { randomUUID } from 'expo-crypto';
import { createSlice, createAsyncThunk, current, createAction } from '@reduxjs/toolkit'
import { api } from '../../api/api';
import { errors } from '../../error-messages';

const initialState = {
    conversationId: randomUUID(), // current conversation ID, generated UUID
    req: {
        q: '',
        skip: 0,
        limit: 100,
    },
    data: [],
    isSending: false, // true if user submitted the message
    isFetching: false, // whether we're fetching message right now
    hasFetched: false, // whether we've attempted to fetch messages
    instrumentId: null, // conversation may be associated with a token
    isQuotaExceeded: false,
    isInputFieldShown: true,
    suggestedPrompts: null,
    context: null,
};


export const sendMessage = createAsyncThunk(
    'aiMessages/sendMessage',
    async (params,  { getState, rejectWithValue }) => {
        const { message, revCatApiKey } = params;
        const { aiMessages, user } = getState();

        try {
            const response = await api.sendMessage({
                conversationId: aiMessages.conversationId,
                message: message,
                revCatApiKey: revCatApiKey,
            });
            return response.data;
        }
        catch(err){
            return rejectWithValue({
                'errorCode': err?.code ?? null,
                'errorDetails': '',
            })
        }
    }
);

export const loadConversation = createAsyncThunk(
    'aiMessages/loadConversation',
    async (params,  { getState, rejectWithValue }) => {
        
        const { aiMessages } = getState();
        
        try {
            await api.markAsSeen({ conversationId: aiMessages.conversationId })
            const response = await api.getMessages({
                conversationId: aiMessages.conversationId,
                q: aiMessages.req.q,
                skip: 0,
                limit: aiMessages.req.limit,
                instrumentId: aiMessages.instrumentId
              });
            return response.data;
        }
        catch(err){
            return rejectWithValue({
                'errorCode': '',
                'errorDetails': '',
            })
        }
    }
  );


const createPromptsFromContext = ({ type, symbol, name, changePerc }) => {
    let prompts = [];

    // universal questions about price changes
    if(changePerc >= 1){
        prompts.push(`Why is ${name} (${symbol}) up?`)
    }
    else if(changePerc <= -1){
        prompts.push(`Why is ${name} (${symbol}) down?`)
    }

    prompts.push(`What are the recent news about ${name} (${symbol})?`)
    prompts.push(`Perform a technical analysis on ${name} (${symbol})?`)
    prompts.push(`What are key risks and benefits investing in ${name} (${symbol})?`)
    prompts.push(`Is ${name} (${symbol}) fairly valued?`)

    if(type === 'crypto'){
        prompts.push(`What is the utility of ${name} (${symbol})?`)
        prompts.push(`What is the roadmap for ${name} (${symbol})?`)
        prompts.push(`Who is behind ${name} (${symbol}) and what is their reputation?`)
    }
    // else if(type === 'stock'){
    //     prompts.push(`Could you do a fundamental research of ${name} (${symbol})?`)
    // }

    return prompts;
}


export const aiMessagesSlice = createSlice({
    name: 'aiMessages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.data.unshift({
                isSentByMe: action.payload.isSentByMe,
                content: action.payload.content
            })
            return state;
        },
        setConversationId: (state, action) => {
            return {
                ...initialState,
                conversationId: action.payload.conversationId
            }
        },
        resetChat: (state, action) => {
            return {
                ...initialState,
                conversationId: randomUUID()
            }
        },
        startNewChat: (state, action) => {
            if(action.payload.context){

                return {
                    ...initialState,
                    conversationId: randomUUID(),
                    instrumentId: action.payload.context.instrumentId,
                }
            }
            else{
                return {
                    ...initialState,
                    conversationId: randomUUID()
                }
            }

        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendMessage.pending, (state, action) => {
            return {
                ...state,
                isSending: true
            }
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
            // add user's message
            state.data.unshift({
                isSentByMe: true,
                content: action?.meta?.arg?.message ?? ''
            })

            // add ai's response
            state.data.unshift({
                isSentByMe: false,
                content: action?.payload?.response ?? errors.AI_SEND_MESSAGE_ERROR,
            })
            
            if(action?.payload?.credits_remaining - action?.payload?.send_message_fee < 0 && action?.payload?.send_message_fee > 0){
                state.isQuotaExceeded = true;
            }

            if(action?.payload?.follow_up_prompts){
                state.suggestedPrompts = action?.payload?.follow_up_prompts;
            }
            
            state.isSending = false;

            return state;
        })
        .addCase(sendMessage.rejected, (state, action) => {
            return {
                ...state,
                isSending: false,
                isQuotaExceeded: false, // allows to retry
            }
        })
        .addCase(loadConversation.pending, (state, action) => {
            return {
                ...state,
                isFetching: true,
            }
        })
        .addCase(loadConversation.fulfilled, (state, action) => {
            const fetchedMessages = action.payload?.messages?.map(item => ({
                isSentByMe: item?.sender !== "system",
                content: item?.content,
                isTyping: false
            })) ?? [];
            
            let isQuotaExceeded = false;
            if(action?.payload?.credits_remaining - action?.payload?.send_message_fee < 0 && action?.payload?.send_message_fee > 0){
                isQuotaExceeded = true;
            }

            return {
                ...state,
                isFetching: false,
                hasFetched: true,
                data: fetchedMessages,
                isQuotaExceeded: isQuotaExceeded,
                req: {
                    ...state.req,
                    skip: 0
                },
                suggestedPrompts: action?.payload?.suggested_prompts || [],
                isInputFieldShown: action?.payload?.allow_input === false ? false : true,
            }
        })
        .addCase(loadConversation.rejected, (state, action) => {
            return {
                ...state,
                isFetching: false,
                hasFetched: true,
            }
        })
    }
})
  

export const { addMessage, setConversationId, resetChat, startNewChat } = aiMessagesSlice.actions

export default aiMessagesSlice.reducer