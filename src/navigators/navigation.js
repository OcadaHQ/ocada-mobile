import React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';

const navigationRef = createNavigationContainerRef();

function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

const defaultScreenOptions = {
  presentation: 'card',
  headerShown: false,
  cardOverlayEnabled: false,
  cardShadowEnabled: false,
  detachPreviousScreen: false,
  ...TransitionPresets.SlideFromRightIOS,
}

const slideFromBottomScreenOptions = {
  presentation: 'modal',
  headerShown: false,
  ...TransitionPresets.ModalSlideFromBottomIOS,
  ...TransitionPresets.ModalPresentationIOS,
}

export { navigationRef, defaultScreenOptions, slideFromBottomScreenOptions, navigate };