import React from 'react';

import { FlatList, RefreshControl } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

import View from  'react-native-ui-lib/view';
import Text from  'react-native-ui-lib/text';
import Card from 'react-native-ui-lib/card';
import Avatar from 'react-native-ui-lib/avatar';
import { Colors } from  'react-native-ui-lib/style';

import ContentLoader, { Circle } from "react-content-loader/native";

import { api } from '../../api/api';

import { HeaderSimple } from '../../components/header-simple';
import { BottomPadding } from '../../components/bottom-padding.component';
import { errors } from '../../error-messages';
import { setError } from '../../redux/slices/error.slice';
import { globalStyles } from '../../theming/common.styles';

import { STATIC_BASE_URL } from '../../constants';
import { refreshActivePortfolio } from '../../redux/slices/user.slice';
import contentLoaderProps from '../../helpers/content-loader-props.helper';

const PickCharacterSkeleton = () => {

  const LoaderLine = () => (
    <ContentLoader 
      width={300}
      height={100} 
      viewBox="0 0 300 100" 
      {...contentLoaderProps}
    >
      <Circle cx="30" cy="50" r="15" />
      <Circle cx="150" cy="50" r="15" />
      <Circle cx="270" cy="50" r="15" />
    </ContentLoader>
  );

  return (
  <>
  <View style={globalStyles.center}>
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
    <LoaderLine />
  </View>
  </>
  )
}


const ChangeCharacterAvatarScreen = ({ navigation }) => {
   
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScreenLoaded, setScreenLoaded] = React.useState(false);
  const [characterList, setCharacterList] = React.useState([]);

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
    api.updatePortfolioCharacterId({
      portfolioId: user.activePortfolio?.data?.id,
      characterId: id,
    })
    .then(
      (response) => {
        dispatch(refreshActivePortfolio());
        navigation.goBack();
      }
    )
    .catch(
      (error) => {
        dispatch(setError({
          message: errors.PORTFOLIO_UPDATE_AVATAR_ERROR,
          detail: error?.response?.data
        }))
      }
    )
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
    <View spread>
      <View></View>
      <View style={globalStyles.center}>
        <Text>No characters found. Pull to refresh</Text>
      </View>
      <View></View>
    </View>
    );
  };

  const CharacterListHeader = () => (
    <Text style={globalStyles.heading}>
    Choose your character
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
      title='Change avatar'
      enableGoBack={true}
      isCharacterAvatarActionable={false}
    />
    <View style={globalStyles.standardContainerBottomless} bg-$backgroundDefault>
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
          ListFooterComponent={<BottomPadding level='2' />}
          ListEmptyComponent={EmptyContent}
          numColumns={3}
        />
    </View>
    </>
  )

}

export { ChangeCharacterAvatarScreen };