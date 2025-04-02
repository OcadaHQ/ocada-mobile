import { HTTP_TIMEOUT_AI } from '../constants';

export async function getConversations({ skip, limit }){
    return await this.http.get(
        '/conversations', {
            params: {
                'skip': skip,
                'limit': limit,
            },
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
};

export async function getMessages({ conversationId, instrumentId, q, skip, limit, }){
    return await this.http.get(
        '/conversations/' + conversationId, {
            params: {
                'q': q,
                'skip': skip,
                'limit': limit,
                'instrument_id': instrumentId
            },
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
};

export async function sendMessage({ conversationId, message, revCatApiKey }){
    return await this.http.post(
        '/conversations/' + conversationId,
        {
            'message': message,
            'revcat_public_api_key': revCatApiKey ?? null
        },
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true,
            timeout: HTTP_TIMEOUT_AI * 1000
        }
    );
};

export async function markAsSeen({ conversationId }){
    return await this.http.post(
        '/conversations/' + conversationId + '/seen',
        null,
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true,
        }
    );
};

export async function getConversationsStats(){
    return await this.http.get('/conversations_stats', {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
}