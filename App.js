import './src/theming/theme-setup';
import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import Purchases from 'react-native-purchases';
import * as Font from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
// import * as SplashScreen from 'expo-splash-screen';


// import { ThemeContext } from './src/theming/theme-context';
import  store  from './src/redux/store';
// import { getPreferredTheme, defaultTheme } from './src/theming/preferred-theme';
// import { default as colors } from './src/theming/snips-colors.json';
import { AppNavigator } from './src/navigators/app.navigator';

import { getRevCatPublicApiKey } from './src/helpers/purchases.helper';
// import { REVENUECAT_PUBLIC_SDK_KEY_ANDROID, REVENUECAT_PUBLIC_SDK_KEY_IOS } from './src/constants';

// LogBox.ignoreAllLogs();
// will fire when the color scheme changes
// static Appearance.addChangeListener(listener)

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default () => {
  // const [theme, setTheme] = React.useState(defaultTheme);
  // const themeContext = React.useContext(ThemeContext);

  // set up the colour theme (once on launch)
  // React.useEffect(() => {
  //   getPreferredTheme().then((themeName) => {
  //     configureTheme(themeName);
  //   });
  // }, []);

  // const toggleTheme = () => {
  //   const nextTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(nextTheme);
  // };

  // const configureTheme = (themeName) => {
  //   setTheme(themeName);
  // }

  // const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync();

        const fontAssets = cacheFonts([Ionicons.font]);

        await Promise.all([...fontAssets]);
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // setAppIsReady(true);
        // SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  // if (!appIsReady) {
  //   return null;
  // }

  // configure in-app purchases/subs (once on launch)
  React.useEffect(() => {
    const revCatApiKey = getRevCatPublicApiKey();
    // Purchases.setDebugLogsEnabled(__DEV__);
    Purchases.configure({ apiKey: revCatApiKey });
  }, []);

  return (
  <View style={styles.outer}>
    <ReduxProvider store={store}>
    <SafeAreaProvider>
    {/* <ThemeContext.Provider value={{ theme, toggleTheme, configureTheme }}> */}
      <View style={styles.container}>
        <AppNavigator />
      </View>
    {/* </ThemeContext.Provider> */}
    </SafeAreaProvider>
    </ReduxProvider>
  </View>
  )
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#333',
    flex: 1
  },
  container: {
    flex: 1,
    margin: 'auto',
    maxWidth: Platform.OS == 'web' ? 600 : '100%',
    width: '100%',
  },
});