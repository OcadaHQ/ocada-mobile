import * as React from 'react';
import View from 'react-native-ui-lib/view';
import { Colors } from 'react-native-ui-lib/style';
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import contentLoaderProps from '../../helpers/content-loader-props.helper';

const LeaderboardCardSkeleton = () => (
    <View
    style={[{marginVertical: 10}]}>
        <ContentLoader
            height={50}
            width={500}
            {...contentLoaderProps}>
        <Circle cx="25" cy="25" r="20" />
        <Rect x="80" y="10" rx="2" ry="2" width="150" height="10" />
        </ContentLoader>
  </View>
)

const LeaderboardSkeleton = (props) => {

    return (
    <View bg-$backgroundDefault>
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
    </View>
    )
};

export { LeaderboardSkeleton };