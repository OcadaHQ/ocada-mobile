export async function getPortfolios( { q, skip, limit, targetUserId } ){
    return await this.http.get(
        '/portfolios',
        {
            params: {
                'q': q,
                'skip': skip,
                'limit': limit,
                'target_user_id': targetUserId
            },
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
};

export async function getPortfoliosLeaderboard( { q, skip, limit } ){
    return await this.http.get(
        '/portfolios/leaderboard',
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

export async function getPortfolio( { portfolioId } ){
    return await this.http.get('/portfolios/' + portfolioId, {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
}

export async function createPortfolio( { characterId, characterName, isPublic } ){
    return await this.http.post(
        '/portfolios',
        {
            "character_id": characterId,
            "name": characterName,
            "is_public": isPublic,
        },
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

export async function deletePortfolio( { portfolioId } ){
    return await this.http.delete('/portfolios/' + portfolioId);
}

export async function getPortfolioHoldings( { portfolioId, skip, limit } ){
    return await this.http.get(
        '/portfolios/' + portfolioId + '/holdings',
        {
            params: {
                'skip': skip,
                'limit': limit
            },
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

export async function getPortfolioHolding( { portfolioId, instrumentId } ){
    return await this.http.get('/portfolios/' + portfolioId + '/holdings/' + instrumentId, {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
}

export async function getPortfolioTransactions( { portfolioId } ){
    return await this.http.get('/portfolios/' + portfolioId + '/transactions', {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
}

// todo is this sufficient?
export async function createPortfolioTransaction( { portfolioId, instrumentId, transactionType, quantity, message } ){
    return await this.http.post(
        '/portfolios/' + portfolioId + '/transactions',
        {
            "instrument_id": instrumentId,
            "transaction_type": transactionType,
            "quantity": quantity,
            "message": message
        },
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

export async function getTransactions( { skip, limit, filter, sort}){
    return await this.http.get('/transactions', {
        params: {
            'skip': skip,
            'limit': limit
        },
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
}

export async function getTransaction( { transactionId }){
    return await this.http.get('/transactions/' + transactionId);
}

export async function executeTransaction( { transactionId } ){
    return await this.http.post(
        '/transactions/' + transactionId,
        null,
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

// Change character details

export async function updatePortfolioCharacterId( { portfolioId, characterId } ){
    return await this.http.patch(
        '/portfolios/' + portfolioId + '/character/character_id',
        {
            'character_id': characterId
        },
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

export async function updatePortfolioName( { portfolioId, name } ){
    return await this.http.patch(
        '/portfolios/' + portfolioId + '/character/name',
        {
            'name': name
        },
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

export async function claimPortfolioReward( { portfolioId, claimType, revCatApiKey } ){
    return await this.http.post(
        '/portfolios/' + portfolioId + '/claims/' + claimType,
        revCatApiKey ? {
            'revcat_public_api_key': revCatApiKey
        } : {},
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}

export async function claimAllRewards( { portfolioId, revCatApiKey } ){
    return await this.http.post(
        '/portfolios/' + portfolioId + '/claims/all',
        revCatApiKey ? {
            'revcat_public_api_key': revCatApiKey
        } : {},
        {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            withCredentials: true
        }
    );
}