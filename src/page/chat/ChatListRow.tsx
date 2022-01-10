import React, {FC, useEffect, useState} from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ContextObj, PageProps, PersonalInfo, StackPageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import fire from "../../utils/firebase";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { getParamFromNavigation } from "../../utils/utilFunction";
import { GiftedChat } from 'react-native-gifted-chat';
import { CenterView, ContainerView, RoundInputContainer, RowView, ThreePartRow } from "../../component/view";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ChatInput, ChatMessage } from "./ChatComponent";
import { MessageData } from "./type";
import { PlainTouchable } from "../../component/touchable";
import { PlainAvatar } from "../../component/image";
import moment from "moment";
import { getChatDisplayTime } from "./helper";
import { T } from "../../utils/translate";
import { Match } from "../likeZone/type";

type ChatListRowProps = {
  chatData: MessageData,
  updateChatDataList: (matchId: string, messageData: any) => any,
  useUser: User,
  toPersonalInfo: (personalInfo: PersonalInfo) => any,
  toChat: (matchId: string, userId: string) => any,
  index: number
};

export const ChatListRow: FC<ChatListRowProps> = ({chatData, updateChatDataList, useUser, toPersonalInfo, toChat, index}) => {

  const {matchId, lastMessage, unreadNum, messageUser} = chatData;
  const {timestamp, text, type, user} = lastMessage || {};
  const {isTyping} = messageUser || {};

  useEffect(() => {
    fire.messageAddRefOn(matchId, (lastMessage: any) => {
      updateChatDataList(matchId, {lastMessage});
    });
    fire.userChangeRefOn(matchId, useUser.id, (messageUser: any) => {
      updateChatDataList(matchId, {messageUser});
    });
    return () => {
      fire.messageRefOff(matchId);
      fire.userRefOff(matchId, useUser.id);
    };
  }, []);

  const getContent = (contextObj: ContextObj) => {

    const {theme, user, setUseNavigation, changeStatusModal} = contextObj;
    const {language} = user;

    const getLeft = (personalInfo: PersonalInfo) => {
      const imageUrl = personalInfo.profilePicOneUrl;
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => toPersonalInfo(personalInfo)}>
          <PlainAvatar source={{uri: imageUrl}} style={{height: hp(6), width: hp(6), borderWidth: 0}}/>
        </PlainTouchable>
      );
    };

    const showText = (isTyping) ? T.IS_TYPING[language] : text;
    const textStyle = (isTyping) ? {color: theme.text} : {color: theme.subText};

    const getBody = (name: string) => {
      return (
        <CenterView style={{width: "100%"}}>
          <RowView style={{justifyContent: "space-between", marginBottom: hp(0.25)}}>
            <Text style={{color: theme.text, fontSize: hp(2)}}>{name}</Text>
            <Text style={{color: theme.subText, fontSize: hp(1.5)}}>{getChatDisplayTime(timestamp)}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start"}}>
            <Text style={{fontSize: hp(1.8), ...textStyle}}>{showText}</Text>
            {unreadNum > 0 && <RoundInputContainer style={{padding: wp(2), backgroundColor: theme.secondary}}>
              <Text style={{fontSize: hp(1.25), color: theme.onSecondary}}>{unreadNum}</Text>
            </RoundInputContainer>}
          </RowView>
        </CenterView>
      );
    };

    return (
      <PlainTouchable activeOpacity={0.6} onPress={() => toChat(matchId, useUser.id)}>
        <ThreePartRow height={hp(10)} extraStyle={{padding: wp(2), paddingRight: wp(1), borderColor: theme.border,
          marginBottom: hp(1)}}
          Left={getLeft(useUser?.personalInfo as PersonalInfo)}
          Body={getBody(useUser?.personalInfo?.name as string)}
          Right={null}
          />
      </PlainTouchable>
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
