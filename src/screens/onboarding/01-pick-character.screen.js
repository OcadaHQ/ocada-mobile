import * as React from 'react';
import { RefreshControl, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ContentLoader, { Circle } from "react-content-loader/native";

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import Avatar from 'react-native-ui-lib/avatar';
import { Colors } from  'react-native-ui-lib/style';

import { HeaderSimple } from '../../components/header-simple';
import { ProgressBar } from '../../components/progress-bar.component';
import { BottomPadding } from '../../components/bottom-padding.component';

import { styles } from './onboarding.style';
import { globalStyles } from '../../theming/common.styles';

import { api } from '../../api/api';

import { initUser, logout } from '../../redux/slices/user.slice';
import { setSelectedCharacter, resetOnboarding } from '../../redux/slices/onboarding.slice';
import { setError } from '../../redux/slices/error.slice';

import { STATIC_BASE_URL } from '../../constants';
import { errors } from '../../error-messages';
import contentLoaderProps from '../../helpers/content-loader-props.helper';

const PickCharacterSkeleton = (props) => {

  const LoaderLine = () => (
    <ContentLoader 
      width={300}
      height={100} 
      viewBox="0 0 300 100" 
      {...contentLoaderProps}
    >
      <Circle cx="30" cy="50" r="30" />
      <Circle cx="150" cy="50" r="30" />
      <Circle cx="270" cy="50" r="30" />
    </ContentLoader>
  );

  return (
  <>
  <View style={globalStyles.center} bg-$backgroundDefault>
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
  </View>
  </>
  )
}

const OnboardingPickCharacterScreen = ({ navigation, title }) => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const onboarding = useSelector((state) => state.onboarding);

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScreenLoaded, setScreenLoaded] = React.useState(false);
  const [characterList, setCharacterList] = React.useState([]);

  const abortOnboarding = () => {
    dispatch( resetOnboarding() );
    if(user.onboardingBackRef === 'guest'){
      dispatch(logout())
    } else {
      dispatch(initUser());
    }
  }

  const updateCharacterList = async (displaySkeleton=true) => {
    if(displaySkeleton)
      setScreenLoaded(false);
    
      api.getCharacters({
        skip: 0,
        limit: 25
      })
      .then(( { data }) => {
        setCharacterList(data);
        setScreenLoaded(true);
      })
      .catch((error) => {
        dispatch(setError({
          message: errors.CHARACTER_LIST_LOADING_ERROR,
          detail: {}
        }));
      })
  }

  const onPickCharacter = ( { id, imageUrl } ) => {
    dispatch(setSelectedCharacter({ id, imageUrl }));
    navigation.navigate('OnboardingNameCharacter');
  }

  const onRefresh = React.useCallback(() => {
    setCharacterList([])
    updateCharacterList();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    updateCharacterList(true);
  }, []);

  const EmptyContent = () => {

    if(!isScreenLoaded)
      return <PickCharacterSkeleton />

    return (
    <View style={globalStyles.spaceBetween}>
      <View></View>
      <View style={globalStyles.center} level='2'>
        <Text>No characters found. Pull to refresh</Text>
      </View>
      <View></View>
    </View>
    );
  };

  const CharacterListHeader = () => (
    <Text style={globalStyles.heading}>
    Choose your avatar
    </Text>
  );

  const CharacterListCell = ( { item } ) => (
    <Card
      onPress={() => onPickCharacter({id: item.id, imageUrl: item.image_url})}
      accessible={true}
      accessibilityLabel={`Select character represented by the image ${item.image_url}`}
      accessibilityHint="Picks a character image and navigates to character name selection"
      bg-$backgroundElevated
      enableShadow={false}
      flex center centerV paddingV-15 marginH-5
      >
      <Avatar
        size={50}
        source={{uri: `${STATIC_BASE_URL}/characters/${item.image_url}`}}
        />
    </Card>    
  );

  return (
  <>
  <HeaderSimple
    title={ProgressBar(25)}
    enableGoBack={user.onboardingBackRef === 'guest'}
    backActionCbk={abortOnboarding}
    backIcon={'cross'}
  />
  <View style={globalStyles.standardContainer} bg-$backgroundDefault>
  <FlatList
        data={characterList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={CharacterListCell}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.$backgroundInverted} // colors for iOS
            colors={[Colors.$backgroundInverted]}  // colors for Android
            progressBackgroundColor={Colors.$backgroundDefault}
          />
        }
        contentContainerStyle={globalStyles.spaceEvenly}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={CharacterListHeader}
        ListEmptyComponent={EmptyContent}
        numColumns={3}
      />
  </View>
  </>
  )
};

export { OnboardingPickCharacterScreen };
