import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { SECURE_USER_TOKEN_KEY } from '../constants';

async function getUserToken(){
    let userToken = await SecureStore.getItemAsync(SECURE_USER_TOKEN_KEY);
    if (userToken) {
        return userToken;
    } else {
        return null;
    }
}

async function saveUserToken(newTokenValue) {
    await SecureStore.setItemAsync(SECURE_USER_TOKEN_KEY, newTokenValue);
}

async function deleteUserToken() {
    await SecureStore.deleteItemAsync(SECURE_USER_TOKEN_KEY);
}

export { getUserToken, saveUserToken, deleteUserToken };
