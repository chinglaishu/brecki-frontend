import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
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
import fire from "../../utils/firebase";
import { getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { Match } from "../likeZone/type";
import { getUseUser, getUseUserById, getUseUserByMatchId } from "./helper";
import { Message, MessageData } from "./type";
import { ChatListRow } from "./ChatListRow";

type ChatListProps = {
  navigation: StackNavigationProp<any>,
  matchs: Match[],
  userId: string,
};

export const ChatList: FC<ChatListProps> = ({navigation, matchs, userId}) => {

  const drawerNavigation: DrawerNavigationProp<any> = getParamFromNavigation(navigation, "drawerNavigation");
  // const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  const [chatDataList, setChatDataList] = useState([] as MessageData[]);

  const getChatDataList = async () => {
    const useChatDataList = await Promise.all(matchs.map(async (match) => {
      const useUser = getUseUserById(match.users, userId);
      const lastMessage = await fire.getLastMessage(match.id);
      const messageUser = await fire.getMessageUser(match.id, useUser?.id as string);
      const selfMessageUser = await fire.getMessageUser(match.id, userId);
      const unreadMessages = await fire.getUnreadMessages(match.id, selfMessageUser?.lastSeen);
      const unreadNum = unreadMessages?.length || 0;
      const data: MessageData = {matchId: match.id, lastMessage, unreadNum, messageUser};
      return data;
    }));
    // useChatDataList.sort((a, b) => {
    //   return a?.lastMessage?.timestamp || 0 - b?.lastMessage?.timestamp || 0;
    // });
    setChatDataList(useChatDataList);
  };

  const updateChatDataList = async (matchId: string, updateMessageData: MessageData, isMessage?: boolean) => {
    console.log("updatee");
    console.log(updateMessageData);
    console.log(isMessage);
    const useChatDataList: MessageData[] = JSON.parse(JSON.stringify(chatDataList));
    for (let i = 0 ; i < useChatDataList.length ; i++) {
      if (useChatDataList[i].matchId === matchId) {

        if (isMessage) {
          if ((useChatDataList[i].lastMessage?.timestamp || 0) > (updateMessageData?.lastMessage?.timestamp || 0)) {return; }
          console.log("userId");
          console.log(userId);
          const addNum = (updateMessageData?.lastMessage?.user?.id === userId) ? 0 : 1;
          const unreadNum = useChatDataList[i].unreadNum || 0 + addNum;
          useChatDataList[i] = {...useChatDataList[i], ...updateMessageData, unreadNum};
        } else {
          useChatDataList[i] = {...useChatDataList[i], ...updateMessageData};
        }
      }
    }
    useChatDataList.sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) {return 1; }
      return a?.lastMessage?.timestamp - b?.lastMessage?.timestamp;
    });
    setChatDataList(useChatDataList);
  };

  useEffect(() => {
    getChatDataList();
  }, []);

  useEffect(() => {
    getChatDataList();
  }, [matchs]);

  const getContent = (contextObj: ContextObj) => {

    const {theme, user, setUseNavigation, changeStatusModal} = contextObj;

    const toChat = (matchId: string, userId: string) => {
      updateChatDataList(matchId, {matchId, unreadNum: 0}, false);
      setUseNavigation({navigation: navigation, backScreen: SCREEN.CHAT_LIST});
      navigation.navigate(SCREEN.CHAT, {matchId, userId, selfUserId: user.id});
    };

    const toPersonalInfo = (personalInfo: PersonalInfo, match: Match | any) => {
      setUseNavigation({navigation: navigation, backScreen: SCREEN.CHAT_LIST});
      navigation.navigate(SCREEN.PERSONAL_INFO, {personalInfo, matchId: match?.id});
    };

    const getChatListItem = ({item, index}: {item: MessageData, index: number}) => {
      // const isFirst = index === 0;
      // const isBottom = index === matchs.length - 1;
      // const useBorderWidth = 0;
      // const borderTopWidth = (isFirst) ? 0 : useBorderWidth;
      // const borderBottomWidth = (isBottom) ? 0 : useBorderWidth;
      // console.log(item.matchId);
      const match = matchs.find((match) => match.id === item.matchId);
      if (!match?.users) {return null; }
      const useUser = getUseUserById(match?.users, user.id) as User;
      if (!useUser) {return null; }
      return (
        <ChatListRow chatData={item} updateChatDataList={updateChatDataList} useUser={useUser}
          toPersonalInfo={(personalInfo: PersonalInfo) => toPersonalInfo(personalInfo, match)} toChat={toChat} index={index} />
      );
    }

    return (
      <ContainerView>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{width: wp(100), paddingTop: hp(2)}}
          data={chatDataList}
          renderItem={getChatListItem}
          keyExtractor={item => item.id as string}
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
