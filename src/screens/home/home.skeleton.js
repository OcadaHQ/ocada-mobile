import * as React from 'react';
import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from  'react-native-ui-lib/card';
import { Colors } from  'react-native-ui-lib/style';
import Ionicons from '@expo/vector-icons/Ionicons';
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

import { styles } from './home.style';
import { globalStyles } from '../../theming/common.styles';
import contentLoaderProps from '../../helpers/content-loader-props.helper';

const StatCardSkeleton = ({ metricLabel, iconName }) => (
  <Card flex accessible centerV center margin-10 padding-10 enableShadow={false} row bg-$backgroundElevated>
    <View paddingL-10>
      <Ionicons name={iconName} size={20} color={Colors.$textNeutralLight} />
    </View>
    <View flex>
      <ContentLoader 
        height={15}
        {...contentLoaderProps}
        >
          <Rect x="0" y="0" rx="2" ry="2" width="100%" height="15" />
        </ContentLoader>
      <Text text90 grey30 center>{metricLabel}</Text>
    </View>
  </Card>
)

const HomeSkeleton = (props) => {

  return (
  <>
  <Text style={globalStyles.heading}>Player's portfolio</Text>
  <View
    accessibilityRole='summary'
  >
    <ContentLoader 
        height={20}
        {...contentLoaderProps}
        >
          <Rect x="0" y="0" rx="2" ry="2" width="100" height="30" />
      </ContentLoader>     
  </View>
  <View flex row gap-20 marginV-10>
    <StatCardSkeleton
      iconName='cash'
      metricLabel='Balance'
    />
    <StatCardSkeleton
      iconName='briefcase'
      metricLabel='Investments'
    />
  </View>
  <View flex row gap-20 marginV-10>
    <StatCardSkeleton
      iconName='trophy'
      metricLabel='Total XP'
    />
    <StatCardSkeleton
      iconName='stats-chart'
      metricLabel='Profit'
    />
  </View>
  <View>
    <Text style={globalStyles.heading}>Trade feed</Text>
  </View>  
  </>
  )
}

export { HomeSkeleton };
