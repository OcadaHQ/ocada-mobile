// creates an anonymous user
// returns a JWT token
export async function createAnonymousUser(){
    return await this.http.post('/users')
};


export async function loginWithSolana( { publicKey, signedMessage, signature } ){
    return await this.http.post('/auth/solana',
    {
        'public_key': publicKey,
        'signed_message': signedMessage,
        'signature': signature
    });
};

export async function loginWithExternalAccount( { provider, token } ){
    // provider: apple, google
    return await this.http.post('/auth/' + provider,
    {
        'token': token
    });
};

export async function refreshAccessToken( { token, lastSeenPlatform, lastSeenAppVersion } ){
    return await this.http.post('/users/me/refresh_token',
    {
        last_seen_platform: lastSeenPlatform,
        last_seen_app_version: lastSeenAppVersion,
    },
    {
    headers: {
        'Authorization': `Bearer ${this.token}`,
    }});
};

export async function getMe(){
    return await this.http.get('/users/me', {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
};

export async function setExperience( hasExperience ){
    return await this.http.put('/users/me/experience', null, {
        headers: {
            'Authorization': `Bearer ${this.token}`
        },
        params: {
            'has_experience': hasExperience
        }
    });
};


// External account management

export async function connectExternalAccount( { provider, token } ){
    return await this.http.post('/users/me/accounts/' + provider, 
    // payload
    {
        'token': token
    },
    // axios config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        },
        withCredentials: true
    });
}

export async function connectSolana( { publicKey, signedMessage, signature } ){
    return await this.http.post('/users/me/accounts/solana', 
    // payload
    {
        'public_key': publicKey,
        'signed_message': signedMessage,
        'signature': signature
    },
    // axios config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        },
        withCredentials: true
    });
};

export async function disconnectExternalAccount( { provider } ){
    return await this.http.delete('/users/me/accounts/' + provider, {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
}

// end: External account management

export async function deleteAccount(){
    return await this.http.delete('/users/me', {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
}

export async function addPushToken({ provider, token }){
    return await this.http.post('/users/me/push_token/' + provider, 
    // payload
    {
        'token': token
    },
    // axios config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        },
        withCredentials: true
    });
}

export async function disablePushToken({ provider, token }){
    return await this.http.delete('/users/me/push_token/' + provider, 
    // axios config
    {
        data: {
            'token': token
        },
        headers: {
            'Authorization': `Bearer ${this.token}`
        },
        withCredentials: true
    });
}

export async function getUsersLeaderboard( { q, skip, limit } ){
    return await this.http.get(
        '/leaderboard',
        {
            params: {
                'q': q,
                'skip': skip,
                'limit': limit
            },
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
};

export async function setLongTermGoal( newValue ){
    return await this.http.put('/users/me/long_term_goal', 
    // payload
    {
        'target_net_worth': newValue
    },
    // config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
};

export async function setAge( newValue ){
    return await this.http.put('/users/me/age', 
    // payload
    {
        'age': newValue
    },
    // config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
};

export async function setDream( newValue ){
    return await this.http.put('/users/me/dream',
    // payload
    {
        'dream_statement': newValue
    },
    // config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
};

export async function setCommitment( newValue ){
    return await this.http.put('/users/me/commitment',
    // payload
    {
        'commitment_level': newValue
    },
    // config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
};


export async function setReferrer( referrerId ){
    return await this.http.put('/users/me/referrer',
    // payload
    {
        'referrer_id': referrerId
    },
    // config
    {
        headers: {
            'Authorization': `Bearer ${this.token}`
        }
    });
};