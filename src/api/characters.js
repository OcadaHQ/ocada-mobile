export async function getCharacters( {skip, limit}){
    return await this.http.get('/characters', {
        params: {
            'skip': skip,
            'limit': limit
        },
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    })
}

export async function getCharacter( {characterId} ){
    return await this.http.get('/characters/' + characterId, {
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
        withCredentials: true
    })
}
