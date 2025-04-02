import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Purchases from 'react-native-purchases';
import * as ExpoLinking from 'expo-linking';
import analytics from '@react-native-firebase/analytics';

import { requestPushPermissions, registerPushToken } from '../redux/slices/push.slice';
import { validatePremium } from '../helpers/purchases.helper';
import { GuestNavigator } from './guest.navigator';
import { OnboardingNavigator } from './onboarding.navigator';
import { LoadingScreen } from '../screens/special/loading.screen';
import { navigationRef } from './navigation';
import { initUser, setPremium } from '../redux/slices/user.slice';
import { refreshUnseenBadge } from '../redux/slices/ai-conversations.slice';
import { RegularNavigator } from './regular.navigator';
import { config as deepLinkingConfig } from './deep-linking.config';

const linking = {
  prefixes: [ExpoLinking.createURL('/ul/'), 'https://ocada.ai'],
  config: deepLinkingConfig,
};

const AppNavigator = ( props ) => {

  const user = useSelector(state => state.user);
  const push = useSelector(state => state.push);
  const aiConversations = useSelector(state => state.aiConversations);
  const dispatch = useDispatch();
  const routeNameRef = React.useRef();

  // request push permissions (once on launch)
  React.useEffect(() => {
    dispatch(requestPushPermissions());
  }, []);

  React.useEffect(() => {
    // console.log('push token changed: ', push.token)
    dispatch(registerPushToken())
  }, [push.token])

  // run once for user init
  React.useEffect(() => {
    if(user.isInitialised !== true)
      dispatch(initUser())
      .unwrap()
      .then(({ id, secret_id }) => {
        const revcatUserId = `${id}_${secret_id}`
        Purchases.logIn(revcatUserId)
        .then(({ customerInfo, created }) => {
          const { entitlements } = customerInfo;
          const isPremium = validatePremium(entitlements)
          dispatch(setPremium(isPremium))
        })
        .catch(() => {
          console.debug('Could not log in as a revcat customer');
        })
      })
      .catch(error => {
        // log out the user
        Purchases.logOut().catch(()=>{});
      });
  }, [dispatch, user.isInitialised]);

  // listen to sub status updates
  React.useEffect(() => {
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const { entitlements } = customerInfo;
      const isPremium = validatePremium(entitlements)
      dispatch(setPremium(isPremium))
    });
  }, []);

  React.useEffect(() => {
    if(user.userDetails !== null){
      const revcatUserId = `${user.userDetails?.id}_${user.userDetails?.secret_id}`;
      Purchases.logIn(revcatUserId)
      .then(({ customerInfo, created }) => {
        const { entitlements } = customerInfo;
        const isPremium = validatePremium(entitlements);
        dispatch(setPremium(isPremium))
      })
      .catch(() => {
        console.debug('Could not log in as a revcat customer');
      })
    }
  }, [user.userDetails?.id]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if(user.isAuthenticated){
        dispatch(refreshUnseenBadge())
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user.isAuthenticated]);

  let activeNavigator;

  if(user.isInitialised !== true)
    return <LoadingScreen />

  if(user.mode == 'regular') {
    activeNavigator = <RegularNavigator />;
  }
  else if(user.mode == 'onboarding') {
    activeNavigator = <OnboardingNavigator />;
  }
  else {
    activeNavigator = <GuestNavigator />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}

      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      {activeNavigator}
    </NavigationContainer>
  );
};

export { AppNavigator };