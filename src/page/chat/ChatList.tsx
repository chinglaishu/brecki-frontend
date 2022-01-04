import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, {FC, useEffect, useState} from "react";
import { View, FlatList, Text } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { PlainAvatar } from "../../component/image";
import { SubTitle, Title } from "../../component/text";
import { PlainTouchable } from "../../component/touchable";
import { CenterView, ContainerView, RowView, ThreePartRow } from "../../component/view";
import { SCREEN } from "../../constant/constant";
import { getAllMatchs } from "../../request/match";
import { ContextObj, PageProps, PersonalInfo, StackPageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { Match } from "../likeZone/type";
import { getUseUser } from "./helper";

export const ChatList: FC<StackPageProps> = ({navigation}) => {
  
  const drawerNavigation: DrawerNavigationProp<any> = getParamFromNavigation(navigation, "drawerNavigation");
  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const userId = getParamFromNavigation(navigation, "userId");
  const [matchs, setMatchs] = useState([] as Match[]);

  const getUsers = async () => {
    const result = await makeRequestWithStatus<Match[]>(() => getAllMatchs(userId), changeStatusModal, false);
    if (!result) {return; }
    const matchs = result.data.data;
    setMatchs(matchs);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getContent = (contextObj: ContextObj) => {

    const {theme, user, setUseNavigation, changeStatusModal} = contextObj;

    const toChat = (matchId: string) => {
      drawerNavigation.setParams({chatRoute: SCREEN.CHAT, matchId});
      setUseNavigation({navigation: navigation, backScreen: SCREEN.CHAT_LIST});
      navigation.navigate(SCREEN.CHAT, {matchId});
    };

    const toPersonalInfo = (personalInfo: PersonalInfo) => {
      drawerNavigation.setParams({chatRoute: SCREEN.PERSONAL_INFO});
      setUseNavigation({navigation: navigation, backScreen: SCREEN.CHAT_LIST});
      navigation.navigate(SCREEN.PERSONAL_INFO, {personalInfo});
    };

    const getLeft = (personalInfo: PersonalInfo) => {
      const imageUrl = personalInfo.profilePicOneUrl;
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => toPersonalInfo(personalInfo)}>
          <PlainAvatar source={{uri: imageUrl}} style={{height: hp(6), width: hp(6), borderWidth: 0}}/>
        </PlainTouchable>
      );
    };

    const getBody = (name: string) => {
      return (
        <CenterView style={{width: "100%"}}>
          <RowView style={{justifyContent: "space-between", marginBottom: hp(0.25)}}>
            <Text style={{color: theme.text, fontSize: hp(2)}}>{name}</Text>
            <Text style={{color: theme.subText, fontSize: hp(1.5)}}>{"1:50 pm"}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start"}}>
            <Text style={{color: theme.subText, fontSize: hp(1.8)}}>{"we are hapapy"}</Text>
          </RowView>
        </CenterView>
      );
    };

    const getChatListItem = ({item, index}: {item: Match, index: number}) => {
      const isFirst = index === 0;
      const isBottom = index === matchs.length - 1;
      const useBorderWidth = 0;
      const borderTopWidth = (isFirst) ? 0 : useBorderWidth;
      const borderBottomWidth = (isBottom) ? 0 : useBorderWidth;
      const useUser = getUseUser(item.users, user);
      const name = useUser?.personalInfo?.name;
      if (!name) {return null; }
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => toChat(item.id)}>
          <ThreePartRow height={hp(10)} extraStyle={{padding: wp(2), paddingRight: wp(1), borderTopWidth, borderColor: theme.border,
            marginBottom: hp(1)}}
            Left={getLeft(useUser?.personalInfo as PersonalInfo)}
            Body={getBody(name)}
            Right={null}
            />
        </PlainTouchable>
      );
    }

    return (
      <ContainerView>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{width: wp(100), paddingTop: hp(2)}}
          data={matchs}
          renderItem={getChatListItem}
          keyExtractor={item => item.id}
        />
      </ContainerView>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  )
};
