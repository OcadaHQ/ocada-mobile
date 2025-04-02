import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from '../../api/api';

const initialState = {
    provider: 'EXPO',  // EXPO, FCM, APNS
    token: null,
};

export const requestPushPermissions = createAsyncThunk(
    'push/requestPermissions',
    async (params,  { getState, rejectWithValue }) => {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync({
                    android: {},
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                        allowAnnouncements: true,
                    }
                });
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                return rejectWithValue({
                    'errorCode': '',
                    'errorDetails': {detail: 'Failed to get push token for push notification'},
                })
            }

            if (Platform.OS === 'android') {

                const channelPropsDefault = {
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                }

                // personalised notifications & reminders
                await Notifications.setNotificationChannelGroupAsync('personalised', {
                    name: 'For you',
                    description: 'Relevant notifications tailored to you'
                });

                // general announcements
                await Notifications.setNotificationChannelGroupAsync('announcements', {
                    name: 'General announcements',
                    description: 'General announcements for all audiences'
                });

                Notifications.setNotificationChannelAsync('portfolio_updates', {
                    name: 'Portfolio updates',
                    description: 'Updates about stocks and crypto you own or follow',
                    groupId: 'personalised',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('community_updates', {
                    name: 'Community updates',
                    description: 'Updates from players you follow',
                    groupId: 'personalised',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('rewards', {
                    name: 'Bonuses and rewards',
                    description: 'When you unlock a bonus or reward',
                    groupId: 'personalised',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('challenges', {
                    name: 'Challenges',
                    description: 'Alerts about challenges',
                    groupId: 'personalised',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('account_alerts', {
                    name: 'Account alerts',
                    description: 'Security and billing alerts related to your account',
                    groupId: 'personalised',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('app_updates', {
                    name: 'App updates and special events',
                    groupId: 'announcements',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('promos', {
                    name: 'Promotions, discounts and deals',
                    groupId: 'announcements',
                    ...channelPropsDefault
                });

                Notifications.setNotificationChannelAsync('default', {
                    name: 'Other notifications',
                    groupId: 'announcements',
                    ...channelPropsDefault
                });
            }

            await Notifications.setBadgeCountAsync(0);
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            return {
                provider: 'EXPO',
                token: token
            }

        } else {
            return rejectWithValue({
                'errorCode': '',
                'errorDetails': {detail: 'Must use physical device for Push Notifications'},
            })
        }
    }
);


export const registerPushToken = createAsyncThunk(
    'push/register',
    async (params,  { getState, rejectWithValue }) => {
        const { push } = getState();
        
        if(push.token === null){
            return rejectWithValue({
                'errorCode': '',
                'errorDetails': 'Push token could not be assigned because it is empty',
            })
        }

        try {
            const response = await api.addPushToken({
                provider: push.provider,
                token: push.token
              });
            
            return response.data;
        }
        catch(err){
            return rejectWithValue({
                'errorCode': '',
                'errorDetails': 'Push token could not be registered by the server',
            })
        }
    }
);


export const disablePushToken = createAsyncThunk(
    'push/disablePushToken',
    async (params,  { getState, rejectWithValue }) => {
        const { push } = getState();
        
        if(push.token === null){
            return rejectWithValue({
                'errorCode': '',
                'errorDetails': 'Push token could not be assigned because it is empty',
            })
        }

        try {
            
            const response = await api.disablePushToken({
                provider: push.provider,
                token: push.token
              });
            
            return response.data;
        }
        catch(err){
            return rejectWithValue({
                'errorCode': '',
                'errorDetails': 'Push token could not be registered by the server',
            })
        }
    }
);


export const pushSlice = createSlice({
    name: 'push',
    initialState,
    reducers: {
        reset: (state, action) => {
            return {...initialState,}
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(requestPushPermissions.fulfilled, (state, action) => {
            return {
                ...state,
                provider: action.payload.provider,
                token: action.payload.token,
            }
        })
        .addCase(requestPushPermissions.rejected, (state, action) => {
            return state
        })
        .addCase(registerPushToken.fulfilled, (state, action) => {
            return state
        })
        .addCase(registerPushToken.rejected, (state, action) => {
            return state
        })
        .addCase(disablePushToken.fulfilled, (state, action) => {
            return state
        })
        .addCase(disablePushToken.rejected, (state, action) => {
            return state
        })
    }
})
  

export const { reset } = pushSlice.actions

export default pushSlice.reducer