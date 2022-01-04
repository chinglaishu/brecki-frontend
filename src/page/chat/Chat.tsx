import React, {FC, useEffect, useState} from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ContextObj, PageProps, StackPageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import fire from "../../utils/firebase";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { getParamFromNavigation } from "../../utils/utilFunction";
import { GiftedChat } from 'react-native-gifted-chat';
import { ContainerView } from "../../component/view";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ChatInput, ChatMessage } from "./ChatComponent";

type ChatState = {
  messages: any[],
  matchId: any,
};

// the chat is not work with Functional Component somehow
export class Chat extends React.Component<StackPageProps, ChatState> {
  constructor(props: any) {
    super(props);
    this.state = {
      messages: [],
      matchId: null,
    }
  }
  public componentDidMount() {
    const matchId = getParamFromNavigation(this.props.navigation, "matchId");
    this.setState({matchId});
    fire.refOn(matchId, (newMessage: any) => {
      this.updateMessages(newMessage);
    });
    fire.getMessages(matchId, 40, (messages: any[]) => {
      const reverse = messages.reverse();
      this.setState({messages: reverse});
    });
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
  private updateMessages(newMessage: any) {
    this.setState({messages: [newMessage, ...this.state.messages]});
  }
  private sendMessage(message: any, user: User) {
    fire.send("text", this.state.matchId, user.id, message);
  }
  private getContent = (contextObj: ContextObj) => {
    const {user, theme} = contextObj;
    const useUser = {...user, _id: user.id};
    const marginBottom = hp(3);
    return (
      <View style={{flex: 1, backgroundColor: theme.background}}>
        <View style={{flex: 1, marginBottom}}>
          <GiftedChat
            messagesContainerStyle={{}}
            textInputProps={{}}
            messages={this.state.messages}
            user={useUser}
            renderMessage={(props) => <ChatMessage props={props} />}
            renderInputToolbar={() => <ChatInput onSendEvent={(text: string) => this.sendMessage(text, useUser)} />} />
            {
              Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={hp(10) + marginBottom} />
            }
        </View>
      </View>
    );
  };
}
