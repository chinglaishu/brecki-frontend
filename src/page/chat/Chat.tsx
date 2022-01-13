import React, {FC, useEffect, useState} from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ContextObj, PageProps, StackPageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import fire from "../../utils/firebase";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { checkIsIOS, getParamFromNavigation } from "../../utils/utilFunction";
import { GiftedChat } from 'react-native-gifted-chat';
import { ContainerView } from "../../component/view";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ChatInput, ChatMessage } from "./ChatComponent";
import { Message, MessageUser, MessageUserStatus } from "./type";
import { addChatDataRecord, getMatchById } from "../../request/match";
import { sendPushNotification } from "../../utils/notification";
import { getUseUserById } from "./helper";

type ChatState = {
  messageUser: MessageUser | null,
  messages: Message[],
  matchId: any,
  messageUserStatus: MessageUserStatus | null,
  matchUser: User | null,
};

// the chat is not work with Functional Component somehow
export class Chat extends React.Component<StackPageProps, ChatState> {
  constructor(props: any) {
    super(props);
    this.state = {
      messageUser: null,
      messages: [],
      matchId: null,
      messageUserStatus: null,
      matchUser: null,
    }
  }
  public componentDidMount() {
    const matchId = getParamFromNavigation(this.props.navigation, "matchId");
    const userId = getParamFromNavigation(this.props.navigation, "userId");
    const selfUserId = getParamFromNavigation(this.props.navigation, "selfUserId");  
    this.getMatch(matchId, selfUserId);
    this.setState({matchId});
    fire.messageAddRefOn(matchId, (newMessage: Message) => {
      this.updateMessages(newMessage);
      fire.updateLastSeen(matchId, selfUserId);
    });
    fire.userChangeRefOn(matchId, userId, (messageUser: MessageUser) => {
      this.updateMessageUser(messageUser);
    });
    fire.userStatusRefOn(userId, (messageUserStatus: MessageUserStatus) => {
      this.setState({messageUserStatus});
    });
    fire.getMessages(matchId, 40, (messages: any[]) => {
      const reverse = messages.reverse();
      this.setState({messages: reverse});
    });
  }
  private async getMatch(matchId: string, selfUserId: string) {
    const result = await getMatchById(matchId);
    const match = result.data.data;
    const matchUser = getUseUserById(match.users, selfUserId);
    this.setState({matchUser});
  }
  public render() {
    return (
      <ContextConsumer>
        {(contextObj: ContextObj) => {
          return this.getContent(contextObj);
        }}
      </ContextConsumer>
    );
  }
  private changeMatchIsTyping(isTyping: boolean) {
    const changeMatchIsTyping = getParamFromNavigation(this.props.navigation, "changeMatchIsTyping");
    changeMatchIsTyping(this.state.matchId, isTyping);
  }
  private updateMessageUser(messageUser: MessageUser) {
    if (this.state.messageUser?.isTyping !== messageUser.isTyping) {
      this.changeMatchIsTyping(messageUser.isTyping);
    }
    this.setState({messageUser});
  }
  private updateMessages(newMessage: any) {
    this.setState({messages: [newMessage, ...this.state.messages]});
  }
  private sendMessage(message: any, user: User) {
    if (!message) {return; }
    if (message.length === 0) {return; }
    fire.send("text", this.state.matchId, user.id, message);
    addChatDataRecord(this.state.matchId, "text", message?.length);
    if (this.state.matchUser?.notificationTokens) {
      const useTitle = `${user.personalInfo?.name} send you a new message`;
      sendPushNotification(this.state.matchUser?.notificationTokens, useTitle, message, {matchId: this.state.matchId, type: "text"});
    }
  }
  private changeIsTyping(isTyping: boolean, userId: string) {
    if (isTyping) {
      fire.startTyping(this.state.matchId, userId);
    } else {
      fire.endTyping(this.state.matchId, userId);
    }
  }
  private getContent = (contextObj: ContextObj) => {
    const {user, theme} = contextObj;
    const useUser = {...user, _id: user.id};
    const marginBottom = (checkIsIOS()) ? hp(6) : hp(3);
    return (
      <View style={{flex: 1, backgroundColor: theme.background}}>
        <View style={{flex: 1, marginBottom}}>
          <GiftedChat
            messagesContainerStyle={{}}
            textInputProps={{}}
            messages={this.state.messages as any[]}
            user={useUser}
            renderMessage={(props) => <ChatMessage props={props} messageUser={this.state.messageUser} />}
            renderInputToolbar={() => <ChatInput onSendEvent={(text: string) => this.sendMessage(text, useUser)}
              changeIsTyping={(isTyping: boolean) => this.changeIsTyping(isTyping, user.id)} />} />
            {
              Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={hp(10) + marginBottom} />
            }
        </View>
      </View>
    );
  };
}
