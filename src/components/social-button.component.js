import * as React from 'react';
import { Linking } from 'react-native';
import Button from 'react-native-ui-lib/button';
import analytics from '@react-native-firebase/analytics';

const SocialButton = ({ targetId, bgColor, imgSrc, url, ...props}) => {
    return (
      <Button
        size={Button.sizes.large}
        backgroundColor={bgColor}
        iconSource={imgSrc}
        round
        style={{width: 32, height: 32}}
        onPress={
          () => {
            analytics().logEvent('tap_social', {target: targetId});
            Linking.openURL(url)
          }}
        />
    )
}

export default SocialButton;
