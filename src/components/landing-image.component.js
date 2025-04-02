import React from 'react';
import { Image } from 'react-native';
import View from  'react-native-ui-lib/view';
import defaultImage from '../../assets/images/missing-file.png'

const defaultWidth = '60%';

const LandingImage = ( { source, imageStyle, width=defaultWidth } ) => {
  return (
    <Image
      source={source}
      defaultSource={defaultImage}
      style={[{
        width: width,
        height: width,
        aspectRatio: 1,
      }, imageStyle]} />
  )
};

const LandingImageWrapper = ( { source, width=defaultWidth, imageStyle=null, level='1' } ) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30
    }}>
    <LandingImage
      source={source}
      width={width}
      imageStyle={imageStyle}
      />
    </View>
  )
};

export { LandingImage, LandingImageWrapper };
