import * as React from 'react';
import View from  'react-native-ui-lib/view';
import { Colors } from  'react-native-ui-lib/style';
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import Divider from '../../components/divider.component';
import contentLoaderProps from '../../helpers/content-loader-props.helper';

const DiscoverCardSkeleton = () => (
    <View
    marginV-10
    disabled={true}>
        <ContentLoader
            height={50}
            width={500}
            {...contentLoaderProps}>
        <Circle cx="30" cy="25" r="25" />
        <Rect x="60" y="10" rx="2" ry="2" width="150" height="10" />
        <Rect x="60" y="30" rx="2" ry="2" width="125" height="10" />
        </ContentLoader>
  </View>
)

const DiscoverSkeleton = (props) => {

    return (
    <View bg-$backgroundDefault>
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
        <Divider />
        <DiscoverCardSkeleton />
    </View>
    )
};

export { DiscoverSkeleton };