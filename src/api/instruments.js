export async function getInstruments( { q, shuffle, sort, showWellKnownOnly, skip, limit, collectionId } ){
    return await this.http.get('/instruments', {
        params: {
            'q': q,
            // 'shuffle': shuffle,
            'sort': sort,
            'show_well_known_only': showWellKnownOnly || false,
            'skip': skip,
            'limit': limit,
            'collection_id': collectionId ?? null
        },
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
};

export async function getInstrument( { instrumentId } ){
    return await this.http.get('/instruments/' + instrumentId, {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
}

export async function getInstrumentBars( { instrumentId, lookbackHours, barInterval } ){
    return await this.http.get('/instruments/' + instrumentId + '/bars', {
        params: {
            'lookback_hours': lookbackHours,
            'bar_interval': barInterval
        },
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
};

export async function getCollections( { skip, limit } ){
    return await this.http.get('/collections', {
        params: {
            'skip': skip,
            'limit': limit,
        },
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    });
};
