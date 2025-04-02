import React from 'react';
import { Appearance } from 'react-native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const defaultTheme = 'dark';
// primary colour #19A1EA

export const getPreferredTheme = async () => {  
  var preferredTheme = defaultTheme;  // by default
  try {
    const retrievedValue = await AsyncStorage.getItem('@preferredTheme');
    if(retrievedValue !== null) {
      if (['dark', 'light'].indexOf(retrievedValue) != -1){
        preferredTheme = retrievedValue;
      }
    }
    else{
      // preferredTheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
      preferredTheme = defaultTheme;
    }
  } catch(e) {
    console.error(e);
  }

  return preferredTheme;
}

export const setPreferredTheme = async (themeName) => {
  try {
    await AsyncStorage.setItem('@preferredTheme', themeName)
  } catch (e) {

  }
}
